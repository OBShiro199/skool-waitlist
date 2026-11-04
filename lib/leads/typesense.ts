import 'server-only'
import { toTypesense, type Filters } from './filters'

const url = () => process.env.TYPESENSE_URL?.replace(/\/$/, '')
const key = () => process.env.TYPESENSE_SEARCH_KEY

export const searchConfigured = () => !!url() && !!key()

/** Matching ids (in Typesense order) and the exact count. Steps 250 hits at a time (PRD 7.5). */
export async function searchIds(alias: string, f: Filters, offset: number, limit: number) {
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
      prefix: 'true',
      drop_tokens_threshold: '0',
      typo_tokens_threshold: '0',
      exhaustive_search: 'true',
    })
    if (p.query_by) params.set('query_by', p.query_by)
    if (!p.filter_by) params.delete('filter_by')
    const res = await fetch(`${url()}/collections/${alias}/documents/search?${params}`, {
      headers: { 'X-TYPESENSE-API-KEY': key()! },
      cache: 'no-store',
    })
    if (!res.ok) {
      console.error('typesense', res.status, (await res.text()).slice(0, 300), alias, p.filter_by)
      throw new Error('search_failed')
    }
    const body = (await res.json()) as { found: number; hits?: { document: { id: string } }[] }
    found = body.found
    const hits = body.hits ?? []
    for (const h of hits) ids.push(h.document.id)
    if (step === 0 || hits.length < step || ids.length >= limit) break
  }
  return { ids, count: found }
}
