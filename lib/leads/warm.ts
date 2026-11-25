import 'server-only'
import { DATASETS, type DatasetId } from './datasets'
import type { Filters } from './filters'
import { searchIds } from './typesense'

// The searches members start from (the page's default view, then the quick filters and range
// presets on top of it). Broad filters over millions of leads take seconds the first time, so
// when someone opens Find Leads we run these once in the background. Typesense then answers them
// from its shared cache for 30 minutes, for every member.
const DEFAULTS: Record<DatasetId, Filters> = { 'uk-eu': { hasMobile: true }, us: {} }
const STARTS: Filters[] = [
  {},
  { sizes: ['1 to 10'] }, { sizes: ['11 to 50'] }, { sizes: ['51 to 200'] }, { sizes: ['201 to 500'] },
  { employeesMin: 7, employeesMax: 15 }, { employeesMin: 20, employeesMax: 100 }, { employeesMin: 100, employeesMax: 500 },
  { seniorities: ['c-level'] }, { seniorities: ['director'] },
  { hasEmail: true }, { hasLinkedin: true },
]

const lastWarm = new Map<DatasetId, number>()

export async function warmStarts(dataset: DatasetId) {
  const at = lastWarm.get(dataset) ?? 0
  if (Date.now() - at < 8 * 60_000) return
  lastWarm.set(dataset, Date.now())
  const alias = DATASETS[dataset].alias
  // two at a time: light on the shared search server
  const queue = STARTS.map((f) => ({ ...DEFAULTS[dataset], ...f }))
  const worker = async () => {
    for (let f = queue.shift(); f; f = queue.shift()) await searchIds(alias, f, 0, 20).catch(() => {})
  }
  await Promise.all([worker(), worker()])
}
