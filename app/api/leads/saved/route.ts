import { guard, json } from '@/lib/leads/guard'
import { isDataset } from '@/lib/leads/datasets'
import { deleteSaved, listSaved, saveSearch } from '@/lib/leads/account'

export const dynamic = 'force-dynamic'

export async function GET() {
  const g = await guard()
  if ('res' in g) return g.res
  try {
    return json({ searches: await listSaved(g.user) })
  } catch {
    return json({ error: 'saved_failed' }, 502)
  }
}

// Create ({ name, dataset, search }) or update ({ id, dataset, search, name? }) a saved search.
export async function POST(req: Request) {
  const g = await guard()
  if ('res' in g) return g.res
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>
  if (!isDataset(b.dataset)) return json({ error: 'invalid_dataset' }, 400)
  const search = b.search && typeof b.search === 'object' && !Array.isArray(b.search) ? (b.search as Record<string, unknown>) : null
  if (!search || JSON.stringify(search).length >= 20_000) return json({ error: 'invalid_search' }, 400)
  const name = typeof b.name === 'string' ? b.name.trim().slice(0, 120) : ''
  const id = typeof b.id === 'string' ? b.id : undefined
  if (!id && !name) return json({ error: 'invalid_name', message: 'Give the search a name.' }, 400)
  try {
    const r = await saveSearch(g.user, { id, name: name || undefined, dataset: b.dataset, search })
    if (r === 'duplicate') return json({ error: 'duplicate', message: 'You already have a saved search with that name. Choose another.' }, 409)
    return json({ search: r })
  } catch (e) {
    console.error('save search', e instanceof Error ? e.message : e)
    return json({ error: 'saved_failed', message: 'That did not save. Try again.' }, 502)
  }
}

export async function DELETE(req: Request) {
  const g = await guard()
  if ('res' in g) return g.res
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return json({ error: 'invalid_id' }, 400)
  try {
    await deleteSaved(g.user, id)
    return json({ ok: true })
  } catch {
    return json({ error: 'saved_failed' }, 502)
  }
}
