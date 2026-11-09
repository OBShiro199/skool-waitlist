import { normEmail, startSession, validEmail } from '@/lib/vault-auth'
import { memberById, verifyPassword } from '@/lib/vault-members'
import { limited } from '@/lib/rate-limit'
import { json } from '@/lib/leads/guard'
import { body, clientIp, handle, str } from '@/lib/vault-route'

// Sign in with email and password.
export async function POST(req: Request) {
  return handle(async () => {
    const b = await body(req)
    const email = normEmail(str(b.email, 254))
    const ip = await clientIp()
    if (limited(`vault-login:${ip}`, 20, 10 * 60_000) || limited(`vault-login:${email}`, 8, 10 * 60_000)) {
      return json({ error: 'rate_limited', message: 'Too many tries. Wait 10 minutes and try again.' }, 429)
    }
    if (!validEmail(email)) return json({ error: 'invalid_email', message: 'Enter the email you signed up with.' }, 400)
    const id = await verifyPassword(email, str(b.password, 200))
    if (!id) {
      await new Promise((r) => setTimeout(r, 500))
      return json({ error: 'wrong_password', message: 'That email and password do not match an account.' }, 401)
    }
    const m = await memberById(id)
    if (!m) return json({ error: 'no_member', message: 'This login has no Vault account. Create one with your Skool handle.' }, 404)
    if (m.status !== 'active') return json({ error: 'suspended', message: 'This account is paused. Message Olly on Skool.' }, 403)
    await startSession({ id: m.id, handle: m.handle })
    return json({ handle: m.handle })
  })
}
