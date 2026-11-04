import { endSession } from '@/lib/vault-auth'
import { json } from '@/lib/leads/guard'

export async function POST() {
  await endSession()
  return json({ ok: true })
}
