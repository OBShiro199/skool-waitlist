import 'server-only'
import { unstable_cache } from 'next/cache'
import { toTypesense, type Filters } from './filters'
import { stableKey } from './cache'

const url = () => process.env.TYPESENSE_URL?.replace(/\/$/, '')
const key = () => process.env.TYPESENSE_SEARCH_KEY

export const searchConfigured = () => !!url() && !!key()

// Lazy filtering walks big filter matches instead of building them in full first. It makes broad
// filters (an employee range, a size bucket) far cheaper on millions of leads. Older Typesense
// servers reject the parameter; then we stop sending it.
let lazyFilter = true

type Result = { ids: string[]; count: number; missingMobileFields: boolean }

// Ids and counts (never contact details) kept in Vercel's shared data cache for an hour and then
// refreshed in the background, so a search anyone has run before answers at once on any server,
// even after a quiet night. The big US collection takes 2 to 4 seconds per new search on the
// search server; repeats cost nothing.
const cachedSearch = unstable_cache(
  async (alias: string, f: Filters, offset: number, limit: number): Promise<Result> => searchIdsLive(alias, f, offset, limit),
  ['leads-search-v1'],
  { revalidate: 3600, tags: ['leads-search'] },
)

/** Matching ids (in Typesense order) and the exact count. */
export async function searchIds(alias: string, f: Filters, offset: number, limit: number): Promise<Result> {
  // unstable_cache keys on its arguments; normalise the filters so key order doesn't matter
  return cachedSearch(alias, JSON.parse(stableKey(f)) as Filters, offset, limit)
}

/** Straight to Typesense. Steps 250 hits at a time (PRD 7.5). */
async function searchIdsLive(alias: string, f: Filters, offset: number, limit: number): Promise<Result> {
  const p = toTypesense(f)
  const ids: string[] = []
  let found = 0
  for (;;) {
    const step = Math.min(250, limit - ids.length)
    const params = new URLSearchParams({
      q: p.q,
      filter_by: p.filter_by,
      sort_by: p.sort_by,
      offset: String(offset + ids.length),
      limit: String(step),
      include_fields: 'id',
      num_typos: '0',
      drop_tokens_threshold: '0',
      typo_tokens_threshold: '0',
      // Typesense keeps identical searches in memory for 30 minutes, shared by every member.
      use_cache: 'true',
      cache_ttl: '1800',
    })
    if (lazyFilter && p.filter_by) params.set('enable_lazy_filter', 'true')
    // Prefix and exhaustive matching only matter when there is text to match; on filter-only
    // searches across millions of leads they cost seconds and change nothing.
    if (p.query_by) {
      params.set('prefix', 'true')
      params.set('exhaustive_search', 'true')
    }
    if (p.query_by) params.set('query_by', p.query_by)
    if (!p.filter_by) params.delete('filter_by')
    const res = await fetch(`${url()}/collections/${alias}/documents/search?${params}`, {
      headers: { 'X-TYPESENSE-API-KEY': key()! },
      cache: 'no-store',
    })
    if (!res.ok) {
      const text = await res.text()
      if (lazyFilter && res.status === 400 && /lazy/i.test(text)) {
        lazyFilter = false
        continue // same page again, without the parameter
      }
      // An index loaded before the mobile fields existed: answer "no matches, with a reason" rather than an error.
      if (res.status < 500 && /field named `?(has_mobile|mobile_codes_h)/.test(text)) return { ids: [], count: 0, missingMobileFields: true }
      console.error('typesense', res.status, text.slice(0, 300), alias, p.filter_by)
      throw new Error('search_failed')
    }
    const body = (await res.json()) as { found: number; hits?: { document: { id: string } }[] }
    found = body.found
    const hits = body.hits ?? []
    for (const h of hits) ids.push(h.document.id)
    if (step === 0 || hits.length < step || ids.length >= limit) break
  }
  return { ids, count: found, missingMobileFields: false }
}
