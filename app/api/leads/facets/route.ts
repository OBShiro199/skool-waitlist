import { guard, json } from '@/lib/leads/guard'
import { isDataset } from '@/lib/leads/datasets'
import { facetsFor } from '@/lib/leads/facets'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const g = await guard()
  if ('res' in g) return g.res
  const dataset = new URL(req.url).searchParams.get('dataset')
  if (!isDataset(dataset)) return json({ error: 'invalid_dataset' }, 400)
  return json(await facetsFor(dataset))
}
