import { guard, json } from '@/lib/leads/guard'
import { exportIds, listExports } from '@/lib/leads/account'
import { isDataset } from '@/lib/leads/datasets'
import { rowsByIds } from '@/lib/leads/rows'
import { mockEnabled, mockSearch } from '@/lib/leads/mock'

export const dynamic = 'force-dynamic'

// GET → the member's export history. GET ?id=N → the rows of that past batch, to download again (free).
export async function GET(req: Request) {
  const g = await guard()
  if ('res' in g) return g.res
  const id = Number(new URL(req.url).searchParams.get('id'))
  try {
    if (!id) return json({ exports: await listExports(g.user) })
    const e = await exportIds(g.user, id)
    if (!e) return json({ error: 'not_found', message: 'That export was not found.' }, 404)
    if (!isDataset(e.dataset) || !e.ids.length) return json({ error: 'not_available', message: 'This export was made before re-downloads existed.' }, 410)
    const rows = mockEnabled() ? mockSearch(e.dataset, {}).filter((r) => e.ids.includes(r.lead_id)) : await rowsByIds(e.dataset, e.ids)
    return json({ dataset: e.dataset, rows })
  } catch (err) {
    console.error('exports history', err instanceof Error ? err.message : err)
    return json({ error: 'exports_failed', message: 'Could not load your exports. Try again.' }, 502)
  }
}
