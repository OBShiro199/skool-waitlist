import { endLandersSession } from '@/lib/landers/session'

export async function POST() {
  await endLandersSession()
  return Response.json({ ok: true })
}
