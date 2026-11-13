import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

// Lander Library gate: one shared password (LANDERS_PASSWORD) checked on the server, then a signed
// httpOnly cookie. A simple demo gate, not account security.
export const LANDERS_COOKIE = 'landers_session'
const MAX_AGE = 60 * 60 * 24 * 30

const secret = () => `landers:${process.env.TOKEN_SECRET ?? 'dev-secret'}`
const sign = (v: string) => createHmac('sha256', secret()).update(v).digest('base64url')
const same = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export const landersOpen = () => (process.env.LANDERS_PASSWORD ?? '').length >= 6
export const checkLandersPassword = (attempt: string) => landersOpen() && same(attempt.trim(), process.env.LANDERS_PASSWORD!)

/** Cookie value: issue time + signature. Used by proxy.ts too, so it must not depend on Node-only APIs there. */
export function sessionValue() {
  const t = String(Date.now())
  return `${t}.${sign(t)}`
}

export function validSession(raw: string | undefined) {
  if (!raw) return false
  const [t, mac] = raw.split('.')
  if (!t || !mac || !same(mac, sign(t))) return false
  return Date.now() - Number(t) < MAX_AGE * 1000
}

export async function hasLandersSession() {
  return validSession((await cookies()).get(LANDERS_COOKIE)?.value)
}

export async function startLandersSession() {
  ;(await cookies()).set(LANDERS_COOKIE, sessionValue(), {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: MAX_AGE,
  })
}

export async function endLandersSession() {
  ;(await cookies()).delete({ name: LANDERS_COOKIE, path: '/' })
}
