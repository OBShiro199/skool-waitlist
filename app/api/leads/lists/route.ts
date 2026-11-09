import { clampInt, guard, json } from '@/lib/leads/guard'
import { isDataset } from '@/lib/leads/datasets'
import { addToList, createList, deleteList, listItems, listLists, removeFromList, renameList } from '@/lib/leads/account'
import { rowsByIds } from '@/lib/leads/rows'
import { mockEnabled, mockSearch } from '@/lib/leads/mock'

export const dynamic = 'force-dynamic'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const ids = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && UUID.test(x)).slice(0, 1000) : [])
const err = (e: unknown) => { console.error('lead lists', e instanceof Error ? e.message : e); return json({ error: 'lists_failed', message: 'That did not save. Try again.' }, 502) }

// GET → the member's lists. GET ?id=&offset=&limit= → one list's leads (full rows), or ?id=&ids=1 → all its lead ids.
export async function GET(req: Request) {
  const g = await guard()
  if ('res' in g) return g.res
  const p = new URL(req.url).searchParams
  const id = p.get('id')
  try {
    if (!id) return json({ lists: await listLists(g.user) })
    if (!UUID.test(id)) return json({ error: 'not_found' }, 404)
    const allIds = p.get('ids') === '1'
    const r = await listItems(g.user, id, allIds ? 0 : clampInt(Number(p.get('offset')), 0, 5000, 0), allIds ? 5000 : clampInt(Number(p.get('limit')), 1, 100, 20))
    if (!r) return json({ error: 'not_found', message: 'That list was not found.' }, 404)
    if (allIds) return json({ list: r.list, ids: r.ids, total: r.total })
    const ds = isDataset(r.list.dataset) ? r.list.dataset : 'uk-eu'
    const rows = r.ids.length ? (mockEnabled() ? mockSearch(ds, {}).filter((x) => r.ids.includes(x.lead_id)) : await rowsByIds(ds, r.ids)) : []
    return json({ list: r.list, rows, total: r.total })
  } catch (e) { return err(e) }
}

// POST { name, dataset, ids? } → new list (with leads). POST { id, ids } → add leads to a list.
export async function POST(req: Request) {
  const g = await guard()
  if ('res' in g) return g.res
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>
  try {
    let id = typeof b.id === 'string' && UUID.test(b.id) ? b.id : null
    let list = null
    if (!id) {
      const name = typeof b.name === 'string' ? b.name.trim().slice(0, 120) : ''
      if (!name) return json({ error: 'invalid_name', message: 'Give the list a name.' }, 400)
      if (!isDataset(b.dataset)) return json({ error: 'invalid_dataset' }, 400)
      const c = await createList(g.user, name, b.dataset)
      if (c === 'duplicate') return json({ error: 'duplicate', message: 'You already have a list with that name.' }, 409)
      id = c.id; list = c
    }
    const add = ids(b.ids)
    if (!add.length) return json({ list, added: 0 })
    const r = await addToList(g.user, id, add)
    if (r === 'not_found') return json({ error: 'not_found', message: 'That list was not found.' }, 404)
    if (r === 'full') return json({ error: 'list_full', message: 'A list holds up to 5,000 leads. Start a new list.' }, 409)
    return json({ list, ...r })
  } catch (e) { return err(e) }
}

// PATCH { id, name } → rename. PATCH { id, remove: [ids] } → remove leads.
export async function PATCH(req: Request) {
  const g = await guard()
  if ('res' in g) return g.res
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>
  if (typeof b.id !== 'string' || !UUID.test(b.id)) return json({ error: 'not_found' }, 404)
  try {
    if (Array.isArray(b.remove)) return json({ ok: await removeFromList(g.user, b.id, ids(b.remove)) })
    const name = typeof b.name === 'string' ? b.name.trim().slice(0, 120) : ''
    if (!name) return json({ error: 'invalid_name', message: 'Give the list a name.' }, 400)
    const r = await renameList(g.user, b.id, name)
    if (r === 'duplicate') return json({ error: 'duplicate', message: 'You already have a list with that name.' }, 409)
    return json({ ok: r })
  } catch (e) { return err(e) }
}

export async function DELETE(req: Request) {
  const g = await guard()
  if ('res' in g) return g.res
  const id = new URL(req.url).searchParams.get('id')
  if (!id || !UUID.test(id)) return json({ error: 'not_found' }, 404)
  try { await deleteList(g.user, id); return json({ ok: true }) } catch (e) { return err(e) }
}
