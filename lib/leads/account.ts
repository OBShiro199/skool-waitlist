import 'server-only'
import { siteDb } from '@/lib/store'

// Per-member export allowance and saved searches, in the site's own database
// (tables from supabase/migrations/*_vault_leads.sql). In local development without a
// database they live in memory.
export const MONTHLY_EXPORTS = 5000

const memExports: { username: string; rows: number; at: number }[] = []
const memSaved = new Map<string, SavedSearch>()

export type SavedSearch = { id: string; name: string; dataset: string; search: Record<string, unknown>; created_at: string; updated_at: string }

const monthStart = () => {
  const d = new Date()
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
}
export const nextReset = () => {
  const d = monthStart()
  d.setUTCMonth(d.getUTCMonth() + 1)
  return d
}

export async function exportedThisMonth(username: string): Promise<number> {
  const db = siteDb()
  const since = monthStart()
  if (!db) return memExports.filter((e) => e.username === username && e.at >= since.getTime()).reduce((n, e) => n + e.rows, 0)
  const { data, error } = await db.from('vault_exports').select('rows').eq('username', username).gte('created_at', since.toISOString())
  if (error) throw new Error(error.message)
  return (data ?? []).reduce((n, r) => n + Number(r.rows), 0)
}

export async function logExport(username: string, dataset: string, rows: number, kind: 'selected' | 'all') {
  const db = siteDb()
  if (!db) return void memExports.push({ username, rows, at: Date.now() })
  const { error } = await db.from('vault_exports').insert({ username, dataset, rows, kind })
  if (error) throw new Error(error.message)
}

export async function listSaved(username: string): Promise<SavedSearch[]> {
  const db = siteDb()
  if (!db) return [...memSaved.values()].filter((s) => (s as SavedSearch & { owner: string }).owner === username)
  const { data, error } = await db
    .from('vault_saved_searches')
    .select('id,name,dataset,search,created_at,updated_at')
    .eq('username', username)
    .order('updated_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data as SavedSearch[]
}

export async function saveSearch(
  username: string,
  s: { id?: string; name?: string; dataset: string; search: Record<string, unknown> },
): Promise<SavedSearch | 'duplicate'> {
  const db = siteDb()
  const now = new Date().toISOString()
  if (!db) {
    const mine = [...memSaved.values()] as (SavedSearch & { owner: string })[]
    if (s.name && mine.some((m) => m.owner === username && m.name === s.name && m.id !== s.id)) return 'duplicate'
    const prev = s.id ? memSaved.get(s.id) : undefined
    const row = { ...(prev ?? { id: crypto.randomUUID(), created_at: now }), name: s.name ?? prev?.name ?? '', dataset: s.dataset, search: s.search, updated_at: now, owner: username }
    memSaved.set(row.id, row)
    return row
  }
  const q = s.id
    ? db.from('vault_saved_searches').update({ dataset: s.dataset, search: s.search, updated_at: now, ...(s.name ? { name: s.name } : {}) }).eq('id', s.id).eq('username', username)
    : db.from('vault_saved_searches').insert({ username, name: s.name, dataset: s.dataset, search: s.search })
  const { data, error } = await q.select('id,name,dataset,search,created_at,updated_at').single()
  if (error) {
    if (error.code === '23505') return 'duplicate'
    throw new Error(error.message)
  }
  return data as SavedSearch
}

export async function deleteSaved(username: string, id: string) {
  const db = siteDb()
  if (!db) return void memSaved.delete(id)
  const { error } = await db.from('vault_saved_searches').delete().eq('id', id).eq('username', username)
  if (error) throw new Error(error.message)
}
