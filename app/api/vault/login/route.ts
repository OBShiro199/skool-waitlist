import { headers } from 'next/headers'
import { checkVaultPassword, normUsername, startSession, validUsername, vaultConfigured } from '@/lib/vault-auth'
import { limited } from '@/lib/rate-limit'
import { json } from '@/lib/leads/guard'

export async function POST(req: Request) {
  if (!vaultConfigured()) return json({ error: 'not_configured', message: 'Sign-in is not set up yet.' }, 503)
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (limited(`vault-login:${ip}`, 10, 10 * 60_000)) {
    return json({ error: 'rate_limited', message: 'Too many tries. Wait 10 minutes and try again.' }, 429)
  }
  const body = (await req.json().catch(() => ({}))) as { username?: unknown; password?: unknown }
  const username = normUsername(typeof body.username === 'string' ? body.username : '')
  if (!validUsername(username)) return json({ error: 'invalid_username', message: 'Enter your Skool username, like olly-rosewell.' }, 400)
  if (typeof body.password !== 'string' || !checkVaultPassword(body.password)) {
    await new Promise((r) => setTimeout(r, 600))
    return json({ error: 'wrong_password', message: 'That password does not match the one in your Skool DM.' }, 401)
  }
  await startSession(username)
  return json({ username })
}
