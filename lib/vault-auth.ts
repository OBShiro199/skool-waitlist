import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

// Members sign in with their Skool username and the one password Olly DMs to everyone
// (VAULT_PASSWORD). Changing the password signs everyone out.
export const VAULT_COOKIE = 'vault_session'
const MAX_AGE = 60 * 60 * 24 * 30

const password = () => process.env.VAULT_PASSWORD ?? ''
const secret = () => `${password()}:${process.env.TOKEN_SECRET ?? 'dev-secret'}`
const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url')

function same(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export const vaultConfigured = () => password().length >= 8
export const checkVaultPassword = (attempt: string) => vaultConfigured() && same(attempt, password())

export function normUsername(input: string) {
  return input.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^(www\.)?skool\.com\//, '').replace(/^@/, '').replace(/[/?#].*$/, '')
}
export const validUsername = (u: string) => /^[a-z0-9][a-z0-9._-]{1,59}$/.test(u)

export async function startSession(username: string) {
  const payload = Buffer.from(JSON.stringify({ u: username, t: Date.now() })).toString('base64url')
  ;(await cookies()).set(VAULT_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export async function endSession() {
  ;(await cookies()).delete({ name: VAULT_COOKIE, path: '/' })
}

/** The signed-in member's username, or null. */
export async function vaultUser(): Promise<string | null> {
  if (!vaultConfigured()) return null
  const raw = (await cookies()).get(VAULT_COOKIE)?.value
  if (!raw) return null
  const [payload, mac] = raw.split('.')
  if (!payload || !mac || !same(mac, sign(payload))) return null
  try {
    const { u, t } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (typeof u !== 'string' || typeof t !== 'number' || Date.now() - t > MAX_AGE * 1000) return null
    return u
  } catch {
    return null
  }
}
