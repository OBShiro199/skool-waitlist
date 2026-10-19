import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'waitlist_admin'

const password = () => process.env.WAITLIST_ADMIN_PASSWORD ?? ''
export const adminConfigured = () => password().length > 0

/** Cookie value tied to the current password, so changing the password signs everyone out. */
const sessionValue = () =>
  createHmac('sha256', `${password()}:${process.env.TOKEN_SECRET ?? 'dev-secret'}`).update('waitlist-admin').digest('hex')

function same(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export const checkPassword = (attempt: string) => adminConfigured() && same(attempt, password())

export async function isAdmin() {
  if (!adminConfigured()) return false
  const c = (await cookies()).get(ADMIN_COOKIE)?.value
  return !!c && same(c, sessionValue())
}

export async function signIn() {
  ;(await cookies()).set(ADMIN_COOKIE, sessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/waitlist',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function signOut() {
  ;(await cookies()).delete({ name: ADMIN_COOKIE, path: '/waitlist' })
}
