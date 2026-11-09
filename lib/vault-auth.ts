import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

// Vault sessions. Members have real accounts (Supabase Auth, email + password, see lib/vault-members.ts).
// After a successful sign-in the server sets this signed, httpOnly cookie, which names the member's
// user id and Skool handle. Every API route reads the member from it.
//
// VAULT_PASSWORD is now the member code Olly DMs on Skool: it is only asked for once, at sign-up,
// so people outside the community can't create accounts. Changing it doesn't sign anyone out.
export const VAULT_COOKIE = 'vault_session'
const MAX_AGE = 60 * 60 * 24 * 30

const secret = () => `vault-v2:${process.env.TOKEN_SECRET ?? 'dev-secret'}`
const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url')

function same(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

const memberCode = () => process.env.VAULT_PASSWORD ?? ''
export const signupOpen = () => memberCode().length >= 8
export const checkMemberCode = (attempt: string) => signupOpen() && same(attempt.trim(), memberCode())

export function normUsername(input: string) {
  return input.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^(www\.)?skool\.com\//, '').replace(/^@/, '').replace(/[/?#].*$/, '')
}
export const validUsername = (u: string) => /^[a-z0-9][a-z0-9._-]{1,59}$/.test(u)
export const normEmail = (e: string) => e.trim().toLowerCase()
export const validEmail = (e: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e) && e.length <= 254

export type VaultUser = { id: string; handle: string }

export async function startSession(user: VaultUser) {
  const payload = Buffer.from(JSON.stringify({ u: user.id, h: user.handle, t: Date.now() })).toString('base64url')
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

/** The signed-in member, or null. Sessions from before accounts (no user id) count as signed out. */
export async function vaultUser(): Promise<VaultUser | null> {
  const raw = (await cookies()).get(VAULT_COOKIE)?.value
  if (!raw) return null
  const [payload, mac] = raw.split('.')
  if (!payload || !mac || !same(mac, sign(payload))) return null
  try {
    const { u, h, t } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (typeof u !== 'string' || typeof h !== 'string' || typeof t !== 'number' || Date.now() - t > MAX_AGE * 1000) return null
    return { id: u, handle: h }
  } catch {
    return null
  }
}
