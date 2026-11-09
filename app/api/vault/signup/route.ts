import { checkMemberCode, normEmail, normUsername, signupOpen, startSession, validEmail, validUsername } from '@/lib/vault-auth'
import { applyOp, createMember } from '@/lib/vault-members'
import { limited } from '@/lib/rate-limit'
import { json } from '@/lib/leads/guard'
import { body, clientIp, handle, str } from '@/lib/vault-route'

// Create an account: Skool handle, name, email, password, and the member code from the Skool DM.
export async function POST(req: Request) {
  return handle(async () => {
    if (!signupOpen()) return json({ error: 'not_configured', message: 'Sign-up is not open yet.' }, 503)
    if (limited(`vault-signup:${await clientIp()}`, 8, 60 * 60_000)) return json({ error: 'rate_limited', message: 'Too many sign-ups from here. Try again in an hour.' }, 429)
    const b = await body(req)
    const handleName = normUsername(str(b.handle, 120))
    const email = normEmail(str(b.email, 254))
    const password = str(b.password, 200)
    const name = str(b.name, 80).trim() || handleName
    if (!validUsername(handleName)) return json({ error: 'invalid_handle', message: 'Enter your Skool handle, the part after skool.com/@.' }, 400)
    if (!validEmail(email)) return json({ error: 'invalid_email', message: 'Enter a valid email address.' }, 400)
    if (password.length < 8) return json({ error: 'weak_password', message: 'Choose a password of at least 8 characters.' }, 400)
    if (!checkMemberCode(str(b.code, 200))) {
      await new Promise((r) => setTimeout(r, 600))
      return json({ error: 'wrong_code', message: 'That member code does not match the one in your Skool DM.' }, 401)
    }
    const user = await createMember({ handle: handleName, email, password, name })
    await startSession(user)
    // progress this browser kept before accounts existed
    if (b.import && typeof b.import === 'object') await applyOp(user, { op: 'import', data: b.import as Record<string, unknown> }).catch(() => {})
    return json({ handle: user.handle })
  })
}
