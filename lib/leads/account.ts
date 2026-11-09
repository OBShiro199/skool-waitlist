import 'server-only'
import { siteDb } from '@/lib/store'
import type { VaultUser } from '@/lib/vault-auth'

// Per-member export allowance, export history, saved searches and lead lists, in the site's own
// database (supabase/migrations/*_vault_leads.sql and *_vault_accounts.sql), keyed by the member's
// user id. In local development without a database they live in memory.
export const MONTHLY_EXPORTS = 5000
export const LIST_MAX = 5000

type Mem = {
  exports: { id: number; user: string; dataset: string; rows: number; kind: string; label: string | null; filters: unknown; lead_ids: string[]; created_at: string }[]
  saved: (SavedSearch & { user: string })[]
  lists: (LeadList & { user: string; items: string[] })[]
}
const g = globalThis as unknown as { __leadsMem?: Mem }
const mem = (g.__leadsMem ??= { exports: [], saved: [], lists: [] })

export type SavedSearch = { id: string; name: string; dataset: string; search: Record<string, unknown>; created_at: string; updated_at: string }
export type ExportRecord = { id: number; dataset: string; rows: number; kind: string; label: string | null; created_at: string; redownload: boolean }
export type LeadList = { id: string; name: string; dataset: string; created_at: string; updated_at: string; count: number }

const monthStart = () => {
  const d = new Date()
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
}
export const nextReset = () => {
  const d = monthStart()
  d.setUTCMonth(d.getUTCMonth() + 1)
  return d
}
const fail = (e: { message: string } | null) => { if (e) throw new Error(e.message) }

// ───────────────────────────── exports ─────────────────────────────

export async function exportedThisMonth(user: VaultUser): Promise<number> {
  const db = siteDb()
  const since = monthStart().toISOString()
  if (!db) return mem.exports.filter((e) => e.user === user.id && e.created_at >= since).reduce((n, e) => n + e.rows, 0)
  const { data, error } = await db.rpc('vault_exported_this_month', { p_user: user.id })
  fail(error)
  return Number(data ?? 0)
}

export async function logExport(user: VaultUser, x: { dataset: string; leadIds: string[]; kind: 'selected' | 'all' | 'list'; filters?: unknown; label?: string }) {
  const db = siteDb()
  const label = x.label?.slice(0, 160) ?? null
  if (!db) {
    mem.exports.push({ id: mem.exports.length + 1, user: user.id, dataset: x.dataset, rows: x.leadIds.length, kind: x.kind, label, filters: x.filters ?? null, lead_ids: x.leadIds, created_at: new Date().toISOString() })
    return
  }
  const { error } = await db.from('vault_exports').insert({
    user_id: user.id, username: user.handle, dataset: x.dataset, rows: x.leadIds.length, kind: x.kind,
    lead_ids: x.leadIds.slice(0, 1000), filters: x.filters ?? null, label,
  })
  fail(error)
}

export async function listExports(user: VaultUser): Promise<ExportRecord[]> {
  const db = siteDb()
  if (!db) return mem.exports.filter((e) => e.user === user.id).reverse().map((e) => ({ id: e.id, dataset: e.dataset, rows: e.rows, kind: e.kind, label: e.label, created_at: e.created_at, redownload: e.lead_ids.length > 0 }))
  const { data, error } = await db.from('vault_exports').select('id,dataset,rows,kind,label,created_at,has:lead_ids').eq('user_id', user.id).order('created_at', { ascending: false }).limit(200)
  fail(error)
  return (data ?? []).map((r) => ({ id: r.id, dataset: r.dataset, rows: r.rows, kind: r.kind, label: r.label, created_at: r.created_at, redownload: Array.isArray(r.has) && r.has.length > 0 }))
}

/** The lead ids of one of the member's past export batches (to download again, free). */
export async function exportIds(user: VaultUser, id: number): Promise<{ dataset: string; ids: string[] } | null> {
  const db = siteDb()
  if (!db) { const e = mem.exports.find((x) => x.id === id && x.user === user.id); return e ? { dataset: e.dataset, ids: e.lead_ids } : null }
  const { data, error } = await db.from('vault_exports').select('dataset,lead_ids').eq('id', id).eq('user_id', user.id).maybeSingle()
  fail(error)
  return data ? { dataset: data.dataset, ids: data.lead_ids ?? [] } : null
}

// ───────────────────────────── saved searches ─────────────────────────────

export async function listSaved(user: VaultUser): Promise<SavedSearch[]> {
  const db = siteDb()
  if (!db) return mem.saved.filter((s) => s.user === user.id).sort((a, b) => b.updated_at.localeCompare(a.updated_at))
  const { data, error } = await db.from('vault_saved_searches').select('id,name,dataset,search,created_at,updated_at').eq('user_id', user.id).order('updated_at', { ascending: false })
  fail(error)
  return data as SavedSearch[]
}

export async function saveSearch(user: VaultUser, s: { id?: string; name?: string; dataset: string; search: Record<string, unknown> }): Promise<SavedSearch | 'duplicate'> {
  const db = siteDb()
  const now = new Date().toISOString()
  if (!db) {
    if (s.name && mem.saved.some((m) => m.user === user.id && m.name === s.name && m.id !== s.id)) return 'duplicate'
    const prev = s.id ? mem.saved.find((m) => m.id === s.id && m.user === user.id) : undefined
    if (prev) { Object.assign(prev, { dataset: s.dataset, search: s.search, updated_at: now, ...(s.name ? { name: s.name } : {}) }); return prev }
    const row = { id: crypto.randomUUID(), created_at: now, updated_at: now, name: s.name ?? '', dataset: s.dataset, search: s.search, user: user.id }
    mem.saved.push(row)
    return row
  }
  const q = s.id
    ? db.from('vault_saved_searches').update({ dataset: s.dataset, search: s.search, updated_at: now, ...(s.name ? { name: s.name } : {}) }).eq('id', s.id).eq('user_id', user.id)
    : db.from('vault_saved_searches').insert({ user_id: user.id, username: user.handle, name: s.name, dataset: s.dataset, search: s.search })
  const { data, error } = await q.select('id,name,dataset,search,created_at,updated_at').single()
  if (error) {
    if (error.code === '23505') return 'duplicate'
    throw new Error(error.message)
  }
  return data as SavedSearch
}

export async function deleteSaved(user: VaultUser, id: string) {
  const db = siteDb()
  if (!db) { mem.saved = mem.saved.filter((s) => !(s.id === id && s.user === user.id)); return }
  const { error } = await db.from('vault_saved_searches').delete().eq('id', id).eq('user_id', user.id)
  fail(error)
}

// ───────────────────────────── lead lists ─────────────────────────────

export async function listLists(user: VaultUser): Promise<LeadList[]> {
  const db = siteDb()
  if (!db) return mem.lists.filter((l) => l.user === user.id).map(({ items, user: _u, ...l }) => ({ ...l, count: items.length })).sort((a, b) => b.updated_at.localeCompare(a.updated_at))
  const { data, error } = await db.from('vault_lead_lists').select('id,name,dataset,created_at,updated_at,items:vault_lead_list_items(count)').eq('user_id', user.id).order('updated_at', { ascending: false })
  fail(error)
  return (data ?? []).map((l) => ({ id: l.id, name: l.name, dataset: l.dataset, created_at: l.created_at, updated_at: l.updated_at, count: (l.items as unknown as { count: number }[])?.[0]?.count ?? 0 }))
}

async function ownList(user: VaultUser, id: string) {
  const db = siteDb()
  if (!db) return mem.lists.find((l) => l.id === id && l.user === user.id) ?? null
  const { data, error } = await db.from('vault_lead_lists').select('id,name,dataset').eq('id', id).eq('user_id', user.id).maybeSingle()
  fail(error)
  return data
}

export async function createList(user: VaultUser, name: string, dataset: string): Promise<LeadList | 'duplicate'> {
  const db = siteDb()
  const now = new Date().toISOString()
  if (!db) {
    if (mem.lists.some((l) => l.user === user.id && l.name === name)) return 'duplicate'
    const l = { id: crypto.randomUUID(), name, dataset, created_at: now, updated_at: now, user: user.id, items: [] as string[], count: 0 }
    mem.lists.push(l)
    return { id: l.id, name, dataset, created_at: now, updated_at: now, count: 0 }
  }
  const { data, error } = await db.from('vault_lead_lists').insert({ user_id: user.id, name, dataset }).select('id,name,dataset,created_at,updated_at').single()
  if (error) { if (error.code === '23505') return 'duplicate'; throw new Error(error.message) }
  return { ...data, count: 0 }
}

/** Adds leads to a list; returns how many were new, or 'full'. */
export async function addToList(user: VaultUser, id: string, leadIds: string[]): Promise<{ added: number; count: number } | 'not_found' | 'full'> {
  const db = siteDb()
  const list = await ownList(user, id)
  if (!list) return 'not_found'
  if (!db) {
    const l = list as Mem['lists'][number]
    const fresh = leadIds.filter((x) => !l.items.includes(x))
    if (l.items.length + fresh.length > LIST_MAX) return 'full'
    l.items.push(...fresh); l.updated_at = new Date().toISOString()
    return { added: fresh.length, count: l.items.length }
  }
  const { count: before } = await db.from('vault_lead_list_items').select('lead_id', { count: 'exact', head: true }).eq('list_id', id)
  const { data: have } = await db.from('vault_lead_list_items').select('lead_id').eq('list_id', id).in('lead_id', leadIds)
  const existing = new Set((have ?? []).map((r) => r.lead_id))
  const fresh = leadIds.filter((x) => !existing.has(x))
  if ((before ?? 0) + fresh.length > LIST_MAX) return 'full'
  if (fresh.length) {
    const { error } = await db.from('vault_lead_list_items').insert(fresh.map((lead_id) => ({ list_id: id, lead_id })))
    if (error) { if (error.message.includes('list_full')) return 'full'; throw new Error(error.message) }
    await db.from('vault_lead_lists').update({ name: list.name }).eq('id', id) // bumps updated_at
  }
  return { added: fresh.length, count: (before ?? 0) + fresh.length }
}

export async function removeFromList(user: VaultUser, id: string, leadIds: string[]) {
  const db = siteDb()
  const list = await ownList(user, id)
  if (!list) return false
  if (!db) { const l = list as Mem['lists'][number]; l.items = l.items.filter((x) => !leadIds.includes(x)); return true }
  const { error } = await db.from('vault_lead_list_items').delete().eq('list_id', id).in('lead_id', leadIds)
  fail(error)
  return true
}

export async function listItems(user: VaultUser, id: string, offset: number, limit: number): Promise<{ list: { id: string; name: string; dataset: string }; ids: string[]; total: number } | null> {
  const db = siteDb()
  const list = await ownList(user, id)
  if (!list) return null
  if (!db) { const l = list as Mem['lists'][number]; return { list: { id: l.id, name: l.name, dataset: l.dataset }, ids: [...l.items].reverse().slice(offset, offset + limit), total: l.items.length } }
  const { data, error, count } = await db.from('vault_lead_list_items').select('lead_id', { count: 'exact' }).eq('list_id', id).order('added_at', { ascending: false }).range(offset, offset + limit - 1)
  fail(error)
  return { list: { id: list.id, name: list.name, dataset: list.dataset }, ids: (data ?? []).map((r) => r.lead_id), total: count ?? 0 }
}

export async function renameList(user: VaultUser, id: string, name: string): Promise<boolean | 'duplicate'> {
  const db = siteDb()
  const list = await ownList(user, id)
  if (!list) return false
  if (!db) { if (mem.lists.some((l) => l.user === user.id && l.name === name && l.id !== id)) return 'duplicate'; (list as Mem['lists'][number]).name = name; return true }
  const { error } = await db.from('vault_lead_lists').update({ name }).eq('id', id).eq('user_id', user.id)
  if (error) { if (error.code === '23505') return 'duplicate'; throw new Error(error.message) }
  return true
}

export async function deleteList(user: VaultUser, id: string) {
  const db = siteDb()
  if (!db) { mem.lists = mem.lists.filter((l) => !(l.id === id && l.user === user.id)); return }
  const { error } = await db.from('vault_lead_lists').delete().eq('id', id).eq('user_id', user.id)
  fail(error)
}
