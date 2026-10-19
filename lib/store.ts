import 'server-only'
import { createHash, createHmac } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

export type Signup = {
  email: string
  form_location: string
  ref: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  referrer: string | null
  country: string | null
  ip_hash: string
  user_agent: string | null
}

export type Profile = { first_name: string | null; stage: 'idea' | 'building' | 'launched' | null }

// The server writes with the secret key (sb_secret_…), never the publishable one, so the table can stay fully locked.
const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseSecret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase =
  supabaseUrl && supabaseSecret ? createClient(supabaseUrl, supabaseSecret, { auth: { persistSession: false } }) : null

export const usingLocalStore = !supabase

export const hashIp = (ip: string) =>
  createHash('sha256').update(ip + (process.env.IP_HASH_SALT ?? 'dev-salt')).digest('hex')

const secret = () => process.env.TOKEN_SECRET ?? 'dev-secret'
export const signId = (id: string) => `${id}.${createHmac('sha256', secret()).update(id).digest('hex').slice(0, 32)}`
export const verifyToken = (token: string) => {
  const [id] = token.split('.')
  return id && signId(id) === token ? id : null
}

/* ---- local fallback: .data/waitlist.json, used when Supabase is not configured ---- */
type LocalRow = Signup & Profile & { id: string; created_at: string; confirmation_sent_at: string | null }
const file = path.join(process.cwd(), '.data', 'waitlist.json')
async function readLocal(): Promise<LocalRow[]> {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'))
  } catch {
    return []
  }
}
async function writeLocal(rows: LocalRow[]) {
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, JSON.stringify(rows, null, 2))
}

export async function recentFromIp(ipHash: string, minutes: number): Promise<number> {
  const since = new Date(Date.now() - minutes * 60_000).toISOString()
  if (supabase) {
    const { count, error } = await supabase
      .from('waitlist_signups')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', since)
    if (error) throw error
    return count ?? 0
  }
  return (await readLocal()).filter((r) => r.ip_hash === ipHash && r.created_at >= since).length
}

/** Inserts the signup. Returns the new row id, or null if the email was already on the list. */
export async function insertSignup(s: Signup): Promise<string | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from('waitlist_signups')
      .upsert(s, { onConflict: 'email', ignoreDuplicates: true })
      .select('id')
    if (error) throw error
    return data?.[0]?.id ?? null
  }
  const rows = await readLocal()
  if (rows.some((r) => r.email === s.email)) return null
  const id = crypto.randomUUID()
  rows.push({ ...s, id, first_name: null, stage: null, created_at: new Date().toISOString(), confirmation_sent_at: null })
  await writeLocal(rows)
  return id
}

export async function markConfirmationSent(id: string) {
  const at = new Date().toISOString()
  if (supabase) {
    await supabase.from('waitlist_signups').update({ confirmation_sent_at: at }).eq('id', id)
    return
  }
  const rows = await readLocal()
  const row = rows.find((r) => r.id === id)
  if (row) row.confirmation_sent_at = at
  await writeLocal(rows)
}

export async function updateProfile(id: string, p: Profile) {
  if (supabase) {
    const { error } = await supabase.from('waitlist_signups').update(p).eq('id', id)
    if (error) throw error
    return
  }
  const rows = await readLocal()
  const row = rows.find((r) => r.id === id)
  if (row) Object.assign(row, p)
  await writeLocal(rows)
}

export type SignupRow = Signup & Profile & { id: string; created_at: string; confirmation_sent_at: string | null }

/** Newest first. Used by the private /waitlist page. */
export async function listSignups(limit = 5000): Promise<SignupRow[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('waitlist_signups')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return (data ?? []) as SignupRow[]
  }
  return (await readLocal()).sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, limit)
}

export async function countSignups(): Promise<number> {
  if (supabase) {
    const { count, error } = await supabase.from('waitlist_signups').select('id', { count: 'exact', head: true })
    if (error) throw error
    return count ?? 0
  }
  return (await readLocal()).length
}
