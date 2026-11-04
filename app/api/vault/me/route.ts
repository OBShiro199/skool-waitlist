import { vaultUser } from '@/lib/vault-auth'
import { json } from '@/lib/leads/guard'

export async function GET() {
  const username = await vaultUser()
  return username ? json({ username }) : json({ error: 'unauthorized' }, 401)
}
