import 'server-only'
import { randomUUID, scryptSync, timingSafeEqual, randomBytes } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { siteDb } from '@/lib/store'
import type { VaultUser } from '@/lib/vault-auth'

// Member accounts and everything they save, in the skool-waitlist Supabase project
// (supabase/migrations/20261109000000_vault_accounts.sql). Passwords live in Supabase Auth.
// Without a database (local development) accounts are kept in memory so the UI can be exercised.

export type MemberState = {
  profile: { user_id: string; skool_handle: string; email: string; display_name: string; role: string; status: string; tour_done: boolean; active_app: string | null; created_at: string }
  commitments: Record<string, { typedName: string; signature: string; signedAt: string }>
  progress: Record<string, { startedAt: string; lastTab: string | null; checked: Record<string, string> }>
  activeDays: string[]
  savedDesigns: string[]
}

export class MemberError extends Error {
  constructor(public code: string, message: string, public status = 400) {
    super(message)
  }
}

const SLUG = /^[a-z0-9-]{1,60}$/
const DESIGN = /^[a-z0-9-]{1,80}$/
const url = () => process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const key = () => process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY

// ───────────────────────── in-memory fallback (local dev only) ─────────────────────────
type MemUser = { id: string; email: string; hash: string; salt: string; state: MemberState }
const g = globalThis as unknown as { __vaultMem?: Map<string, MemUser> }
const mem = (g.__vaultMem ??= new Map())
const hashPw = (pw: string, salt: string) => scryptSync(pw, salt, 32).toString('hex')
const memByEmail = (email: string) => [...mem.values()].find((u) => u.email === email)

function dbOrMem() {
  const db = siteDb()
  if (!db && process.env.NODE_ENV === 'production') throw new MemberError('not_configured', 'Accounts are not set up yet.', 503)
  return db
}

// ───────────────────────────────── accounts ─────────────────────────────────

export async function createMember(input: { handle: string; email: string; password: string; name: string }): Promise<VaultUser> {
  const db = dbOrMem()
  if (!db) {
    if ([...mem.values()].some((u) => u.state.profile.skool_handle === input.handle)) throw new MemberError('handle_taken', 'That Skool handle already has an account. Sign in instead.', 409)
    if (memByEmail(input.email)) throw new MemberError('email_taken', 'That email already has an account. Sign in instead.', 409)
    const id = randomUUID(), salt = randomBytes(8).toString('hex')
    mem.set(id, { id, email: input.email, salt, hash: hashPw(input.password, salt), state: {
      profile: { user_id: id, skool_handle: input.handle, email: input.email, display_name: input.name, role: 'member', status: 'active', tour_done: false, active_app: null, created_at: new Date().toISOString() },
      commitments: {}, progress: {}, activeDays: [], savedDesigns: [] } })
    return { id, handle: input.handle }
  }
  const { data: taken } = await db.from('vault_members').select('user_id').eq('skool_handle', input.handle).maybeSingle()
  if (taken) throw new MemberError('handle_taken', 'That Skool handle already has an account. Sign in instead.', 409)

  const { data, error } = await db.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true, // no confirmation email: members are vetted by the member code
    user_metadata: { skool_handle: input.handle, display_name: input.name },
  })
  if (error || !data.user) {
    const msg = (error?.message ?? '').toLowerCase()
    if (error?.code === 'email_exists' || msg.includes('already') || msg.includes('registered')) throw new MemberError('email_taken', 'That email already has an account. Sign in instead.', 409)
    if (error?.code === 'weak_password' || msg.includes('password')) throw new MemberError('weak_password', 'Choose a longer password: at least 8 characters.', 400)
    throw new MemberError('signup_failed', 'Could not create your account. Try again in a moment.', 502)
  }
  const { error: insErr } = await db.from('vault_members').insert({ user_id: data.user.id, skool_handle: input.handle, email: input.email, display_name: input.name })
  if (insErr) {
    await db.auth.admin.deleteUser(data.user.id).catch(() => {})
    if (insErr.code === '23505') throw new MemberError('handle_taken', 'That Skool handle or email already has an account. Sign in instead.', 409)
    throw new MemberError('signup_failed', 'Could not create your account. Try again in a moment.', 502)
  }
  return { id: data.user.id, handle: input.handle }
}

/** Checks an email and password. Uses a throwaway client so the shared server client never holds a user session. */
export async function verifyPassword(email: string, password: string): Promise<string | null> {
  const db = dbOrMem()
  if (!db) {
    const u = memByEmail(email)
    if (!u) return null
    const a = Buffer.from(hashPw(password, u.salt)), b = Buffer.from(u.hash)
    return a.length === b.length && timingSafeEqual(a, b) ? u.id : null
  }
  const auth = createClient(url()!, key()!, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data, error } = await auth.auth.signInWithPassword({ email, password })
  if (error || !data.user) return null
  await auth.auth.signOut().catch(() => {})
  return data.user.id
}

export async function memberById(id: string): Promise<{ id: string; handle: string; status: string } | null> {
  const db = dbOrMem()
  if (!db) {
    const u = mem.get(id)
    return u ? { id, handle: u.state.profile.skool_handle, status: u.state.profile.status } : null
  }
  const { data, error } = await db.from('vault_members').select('user_id,skool_handle,status').eq('user_id', id).maybeSingle()
  if (error) throw new MemberError('db', 'Could not load your account.', 502)
  return data ? { id: data.user_id, handle: data.skool_handle, status: data.status } : null
}

export async function changePassword(user: VaultUser, current: string, next: string) {
  const db = dbOrMem()
  const email = db
    ? (await db.from('vault_members').select('email').eq('user_id', user.id).single()).data?.email
    : mem.get(user.id)?.email
  if (!email || (await verifyPassword(email, current)) !== user.id) throw new MemberError('wrong_password', 'Your current password is not right.', 401)
  if (!db) {
    const u = mem.get(user.id)!
    u.hash = hashPw(next, u.salt)
    return
  }
  const { error } = await db.auth.admin.updateUserById(user.id, { password: next })
  if (error) throw new MemberError('password_failed', 'Could not change your password. Try another one.', 400)
}

// ───────────────────────────────── state ─────────────────────────────────

export async function memberState(user: VaultUser): Promise<MemberState | null> {
  const db = dbOrMem()
  if (!db) return mem.get(user.id)?.state ?? null
  const { data, error } = await db.rpc('vault_member_state', { p_user: user.id })
  if (error) throw new MemberError('db', 'Could not load your progress.', 502)
  // a light "last seen", at most every 10 minutes
  void db.from('vault_members').update({ last_seen_at: new Date().toISOString() }).eq('user_id', user.id)
    .lt('last_seen_at', new Date(Date.now() - 10 * 60_000).toISOString()).then(() => {})
  return (data as MemberState) ?? null
}

/** The member's local date (YYYY-MM-DD), if it's within a day of the server's; otherwise today (UTC). */
function day(input: unknown) {
  const today = new Date()
  if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const d = new Date(`${input}T12:00:00Z`)
    if (Math.abs(d.getTime() - today.getTime()) < 36 * 3600_000) return input
  }
  return today.toISOString().slice(0, 10)
}

export type SyncOp =
  | { op: 'commit'; app: string; typedName: string; signature: string }
  | { op: 'tick'; app: string; item: string; on: boolean; day?: string }
  | { op: 'tab'; app: string; tab: string }
  | { op: 'active'; app: string }
  | { op: 'reset'; app: string }
  | { op: 'tour'; done: boolean }
  | { op: 'profile'; name: string }
  | { op: 'design'; slug: string; saved: boolean }
  | { op: 'import'; data: Record<string, unknown> }

/** Applies one change from the Vault. Throws MemberError on bad input. */
export async function applyOp(user: VaultUser, o: SyncOp) {
  const bad = (m = 'That change was not valid.') => { throw new MemberError('invalid', m) }
  const app = 'app' in o ? String(o.app) : ''
  if ('app' in o && !SLUG.test(app)) bad()
  const db = dbOrMem()
  const now = new Date().toISOString()

  if (!db) {
    const s = mem.get(user.id)?.state
    if (!s) throw new MemberError('unauthorized', 'Sign in again.', 401)
    const prog = () => (s.progress[app] ??= { startedAt: now, lastTab: null, checked: {} })
    switch (o.op) {
      case 'commit': s.commitments[app] = { typedName: o.typedName, signature: o.signature, signedAt: now }; prog(); s.profile.active_app = app; break
      case 'tick': { const p = prog(); if (o.on) { if (!p.checked[o.item]) { p.checked[o.item] = now; const d = day(o.day); if (!s.activeDays.includes(d)) s.activeDays.push(d) } } else delete p.checked[o.item]; break }
      case 'tab': prog().lastTab = o.tab; break
      case 'active': s.profile.active_app = app; break
      case 'reset': s.progress[app] = { startedAt: now, lastTab: null, checked: {} }; break
      case 'tour': s.profile.tour_done = !!o.done; break
      case 'profile': s.profile.display_name = o.name; break
      case 'design': s.savedDesigns = o.saved ? [o.slug, ...s.savedDesigns.filter((x: string) => x !== o.slug)] : s.savedDesigns.filter((x: string) => x !== o.slug); break
      case 'import': {
        const d = o.data as Partial<MemberState> & { tourDone?: boolean; activeApp?: string }
        for (const [k, v] of Object.entries(d.commitments ?? {})) s.commitments[k] ??= v
        for (const [k, v] of Object.entries(d.progress ?? {})) s.progress[k] ??= { startedAt: v.startedAt, lastTab: v.lastTab ?? null, checked: v.checked ?? {} }
        for (const x of d.activeDays ?? []) if (!s.activeDays.includes(x)) s.activeDays.push(x)
        s.profile.tour_done ||= !!d.tourDone
        s.profile.active_app ??= d.activeApp ?? null
      }
    }
    return
  }

  const run = async (p: PromiseLike<{ error: { message: string; code?: string } | null }>) => {
    const { error } = await p
    if (error) {
      if (error.code === '23514' || error.code === '22P02') bad()
      throw new MemberError('db', 'Could not save that. Try again.', 502)
    }
  }
  switch (o.op) {
    case 'commit': {
      if (typeof o.signature !== 'string' || !o.signature.startsWith('data:image/png;base64,') || o.signature.length > 380_000) bad('That signature could not be saved.')
      const name = String(o.typedName ?? '').trim().slice(0, 80)
      if (!name) bad('Type your name to sign.')
      await run(db.from('vault_commitments').upsert({ user_id: user.id, app_slug: app, typed_name: name, signature: o.signature, signed_at: now }))
      await run(db.from('vault_app_progress').upsert({ user_id: user.id, app_slug: app }, { onConflict: 'user_id,app_slug', ignoreDuplicates: true }))
      await run(db.from('vault_members').update({ active_app: app }).eq('user_id', user.id))
      return
    }
    case 'tick':
      if (typeof o.item !== 'string' || !o.item || o.item.length > 120) bad()
      return run(db.rpc('vault_set_item', { p_user: user.id, p_app: app, p_item: o.item, p_on: !!o.on, p_day: day(o.day) }))
    case 'tab':
      return run(db.from('vault_app_progress').upsert({ user_id: user.id, app_slug: app, last_tab: String(o.tab).slice(0, 60) }, { onConflict: 'user_id,app_slug' }))
    case 'active':
      return run(db.from('vault_members').update({ active_app: app }).eq('user_id', user.id))
    case 'reset':
      await run(db.from('vault_app_progress').delete().eq('user_id', user.id).eq('app_slug', app))
      return run(db.from('vault_app_progress').insert({ user_id: user.id, app_slug: app }))
    case 'tour':
      return run(db.from('vault_members').update({ tour_done: !!o.done }).eq('user_id', user.id))
    case 'profile': {
      const name = String(o.name ?? '').trim().slice(0, 80)
      if (!name) bad('Enter a name.')
      return run(db.from('vault_members').update({ display_name: name }).eq('user_id', user.id))
    }
    case 'design':
      if (!DESIGN.test(String(o.slug))) bad()
      return o.saved
        ? run(db.from('vault_saved_designs').upsert({ user_id: user.id, design_slug: o.slug }, { ignoreDuplicates: true }))
        : run(db.from('vault_saved_designs').delete().eq('user_id', user.id).eq('design_slug', o.slug))
    case 'import':
      if (!o.data || typeof o.data !== 'object' || JSON.stringify(o.data).length > 2_000_000) bad()
      return run(db.rpc('vault_import_local', { p_user: user.id, p_data: o.data }))
    default:
      bad()
  }
}
