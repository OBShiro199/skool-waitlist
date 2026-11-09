import { vaultUser } from '@/lib/vault-auth'
import { changePassword } from '@/lib/vault-members'
import { limited } from '@/lib/rate-limit'
import { json } from '@/lib/leads/guard'
import { body, handle, str } from '@/lib/vault-route'

export async function POST(req: Request) {
  return handle(async () => {
    const user = await vaultUser()
    if (!user) return json({ error: 'unauthorized' }, 401)
    if (limited(`vault-pw:${user.id}`, 6, 10 * 60_000)) return json({ error: 'rate_limited', message: 'Too many tries. Wait 10 minutes.' }, 429)
    const b = await body(req)
    const next = str(b.next, 200)
    if (next.length < 8) return json({ error: 'weak_password', message: 'Choose a password of at least 8 characters.' }, 400)
    await changePassword(user, str(b.current, 200), next)
    return json({ ok: true })
  })
}
