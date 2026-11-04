import { clampInt, guard, json } from '@/lib/leads/guard'
import { DATASETS, isDataset } from '@/lib/leads/datasets'
import { asksForMobiles, type Filters } from '@/lib/leads/filters'
import { searchConfigured, searchIds } from '@/lib/leads/typesense'
import { rowsByIds, rowsConfigured } from '@/lib/leads/rows'
import { mockEnabled, mockSearch } from '@/lib/leads/mock'

export const dynamic = 'force-dynamic'

// PRD 7: { dataset, filters, offset?, limit?, ids_only? } → rows (or ids) and the exact count.
export async function POST(req: Request) {
  const g = await guard()
  if ('res' in g) return g.res
  const started = Date.now()
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
  if (!isDataset(body.dataset)) return json({ error: 'invalid_dataset' }, 400)
  const dataset = body.dataset
  const filters: Filters = body.filters && typeof body.filters === 'object' && !Array.isArray(body.filters) ? (body.filters as Filters) : {}
  const idsOnly = body.ids_only === true
  const limit = clampInt(body.limit, 0, idsOnly ? 1000 : 500, 100)
  const offset = clampInt(body.offset, 0, 1_000_000, 0)

  if (!DATASETS[dataset].hasMobiles && asksForMobiles(filters)) {
    return json(idsOnly ? { ids: [], count: { n: 0, exact: true }, took_ms: 0 } : { rows: [], count: { n: 0, exact: true }, took_ms: 0, notice: 'no_mobiles' })
  }

  if (mockEnabled()) {
    const all = mockSearch(dataset, filters)
    const page = all.slice(offset, offset + limit)
    const count = { n: all.length, exact: true }
    return json(idsOnly ? { ids: page.map((r) => r.lead_id), count, took_ms: Date.now() - started } : { rows: page, count, took_ms: Date.now() - started })
  }

  if (!searchConfigured() || !rowsConfigured()) return json({ error: 'search_not_configured' }, 503)
  try {
    const { ids, count } = await searchIds(DATASETS[dataset].alias, filters, offset, limit)
    const n = { n: count, exact: true }
    if (idsOnly) return json({ ids, count: n, took_ms: Date.now() - started })
    const rows = ids.length ? await rowsByIds(dataset, ids) : []
    return json({ rows, count: n, took_ms: Date.now() - started })
  } catch (e) {
    console.error('leads search failed', dataset, e instanceof Error ? e.message : e)
    return json({ error: 'search_failed', message: 'Search is unavailable right now. Try again in a moment.' }, 502)
  }
}

export function GET() {
  return json({ error: 'method_not_allowed' }, 405)
}
