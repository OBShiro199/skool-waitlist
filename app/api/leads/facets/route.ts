import { after } from 'next/server'
import { guard, json } from '@/lib/leads/guard'
import { isDataset } from '@/lib/leads/datasets'
import { facetsFor } from '@/lib/leads/facets'
import { searchConfigured } from '@/lib/leads/typesense'
import { mockEnabled } from '@/lib/leads/mock'
import { warmStarts } from '@/lib/leads/warm'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const g = await guard()
  if ('res' in g) return g.res
  const dataset = new URL(req.url).searchParams.get('dataset')
  if (!isDataset(dataset)) return json({ error: 'invalid_dataset' }, 400)
  // the page asks for its filter options first, so this is the moment to warm the common searches
  if (searchConfigured() && !mockEnabled()) after(() => warmStarts(dataset))
  return json(await facetsFor(dataset))
}
