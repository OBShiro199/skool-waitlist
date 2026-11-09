import { clampInt, guard, json } from '@/lib/leads/guard'
import { DATASETS, isDataset } from '@/lib/leads/datasets'
import { asksForMobiles, type Filters } from '@/lib/leads/filters'
import { searchConfigured, searchIds } from '@/lib/leads/typesense'
import { rowsByIds, rowsConfigured } from '@/lib/leads/rows'
import { mockEnabled, mockSearch } from '@/lib/leads/mock'
import { exportedThisMonth, logExport, MONTHLY_EXPORTS, nextReset } from '@/lib/leads/account'

export const dynamic = 'force-dynamic'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// One export batch (PRD 14): either the selected ids, or the next 1,000 matches from `offset`.
// Counts against the member's 5,000 a month and writes one audit row per batch.
export async function POST(req: Request) {
  const g = await guard()
  if ('res' in g) return g.res
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
  if (!isDataset(body.dataset)) return json({ error: 'invalid_dataset' }, 400)
  const dataset = body.dataset

  let used: number
  try {
    used = await exportedThisMonth(g.user)
  } catch (e) {
    console.error('export allowance', e instanceof Error ? e.message : e)
    return json({ error: 'export_failed', message: 'Export is unavailable right now. Try again in a moment.' }, 502)
  }
  const remaining = Math.max(0, MONTHLY_EXPORTS - used)
  const resets = nextReset().toISOString()
  if (remaining === 0) {
    return json({ error: 'export_limit', message: `You've used your ${MONTHLY_EXPORTS.toLocaleString('en-GB')} exports this month.`, remaining, resets }, 403)
  }

  try {
    let ids: string[]
    let kind: 'selected' | 'all' | 'list'
    let filters: Filters | undefined
    if (Array.isArray(body.ids)) {
      kind = body.kind === 'list' ? 'list' : 'selected'
      ids = body.ids.filter((x): x is string => typeof x === 'string' && UUID.test(x)).slice(0, 500)
    } else {
      kind = 'all'
      filters = body.filters && typeof body.filters === 'object' && !Array.isArray(body.filters) ? (body.filters as Filters) : {}
      const offset = clampInt(body.offset, 0, 1_000_000, 0)
      const limit = Math.min(1000, remaining)
      if (!DATASETS[dataset].hasMobiles && asksForMobiles(filters)) ids = []
      else if (mockEnabled()) ids = mockSearch(dataset, filters).slice(offset, offset + limit).map((r) => r.lead_id)
      else {
        if (!searchConfigured() || !rowsConfigured()) return json({ error: 'search_not_configured' }, 503)
        ids = (await searchIds(DATASETS[dataset].alias, filters, offset, limit)).ids
      }
    }
    ids = ids.slice(0, remaining)
    const rows = mockEnabled()
      ? mockSearch(dataset, {}).filter((r) => ids.includes(r.lead_id))
      : await rowsByIds(dataset, ids)
    const label = typeof body.label === 'string' ? body.label.slice(0, 160) : undefined
    if (rows.length) await logExport(g.user, { dataset, leadIds: rows.map((r) => r.lead_id), kind, filters, label })
    return json({ rows, fetched: ids.length, remaining: remaining - rows.length, resets })
  } catch (e) {
    console.error('leads export failed', dataset, e instanceof Error ? e.message : e)
    return json({ error: 'export_failed', message: 'Export is unavailable right now. Try again in a moment.' }, 502)
  }
}

/** The member's export allowance for this month. */
export async function GET() {
  const g = await guard()
  if ('res' in g) return g.res
  try {
    const used = await exportedThisMonth(g.user)
    return json({ used, limit: MONTHLY_EXPORTS, remaining: Math.max(0, MONTHLY_EXPORTS - used), resets: nextReset().toISOString() })
  } catch {
    return json({ error: 'export_failed' }, 502)
  }
}
