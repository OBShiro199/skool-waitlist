import { vaultUser } from '@/lib/vault-auth'
import { applyOp, type SyncOp } from '@/lib/vault-members'
import { limited } from '@/lib/rate-limit'
import { json } from '@/lib/leads/guard'
import { handle } from '@/lib/vault-route'

// Saves one change from the Vault (a tick, a pledge, the last tab, a saved design…), or a batch of them.
export async function POST(req: Request) {
  return handle(async () => {
    const user = await vaultUser()
    if (!user) return json({ error: 'unauthorized' }, 401)
    if (limited(`vault-sync:${user.id}`, 300, 60_000)) return json({ error: 'rate_limited', message: 'Saving too fast. Wait a moment.' }, 429)
    const b = (await req.json().catch(() => null)) as SyncOp | { ops: SyncOp[] } | null
    const ops = b && 'ops' in b && Array.isArray(b.ops) ? b.ops.slice(0, 50) : b ? [b as SyncOp] : []
    if (!ops.length) return json({ error: 'invalid', message: 'Nothing to save.' }, 400)
    for (const o of ops) await applyOp(user, o)
    return json({ ok: true })
  })
}
