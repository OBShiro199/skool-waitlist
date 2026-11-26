import { checkAuthRequest, authorizeQuery, codeRedirect, deniedRedirect, formTokenValid } from '@/lib/mcp/authorize'
import { originOf } from '@/lib/mcp/oauth'
import { normEmail, startSession, vaultUser, validEmail } from '@/lib/vault-auth'
import { memberById, verifyPassword } from '@/lib/vault-members'
import { limited } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

// The consent page's form posts here: sign in, allow, or cancel. Every answer is a 303 redirect,
// either back to the page (with a message) or to the client with a code or an error.
export async function POST(req: Request) {
  const origin = originOf(req)
  const form = await req.formData()
  const get = (k: string) => (typeof form.get(k) === 'string' ? (form.get(k) as string) : '')
  const input: Record<string, string> = {}
  for (const k of ['response_type', 'client_id', 'redirect_uri', 'state', 'code_challenge', 'code_challenge_method', 'scope', 'resource']) {
    if (form.has(k)) input[k] = get(k)
  }
  const checked = await checkAuthRequest(input, origin)
  if (!checked.ok) {
    if ('redirect' in checked) return Response.redirect(checked.redirect, 303)
    return Response.redirect(`${origin}/oauth/authorize?${new URLSearchParams({ ...input, error: 'invalid' })}`, 303)
  }
  const r = checked.req
  const page = (extra: Record<string, string> = {}) => Response.redirect(`${origin}/oauth/authorize?${authorizeQuery({ ...r.raw, ...extra })}`, 303)
  const action = get('action')

  if (action === 'login') {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
    const email = normEmail(get('email'))
    if (limited(`oauth-login:${ip}`, 10, 10 * 60_000) || limited(`oauth-login:${email}`, 10, 10 * 60_000)) return page({ error: 'slow' })
    if (!validEmail(email) || !get('password')) return page({ error: 'login', email })
    const id = await verifyPassword(email, get('password')).catch(() => null)
    const member = id ? await memberById(id).catch(() => null) : null
    if (!member) return page({ error: 'login', email })
    await startSession({ id: member.id, handle: member.handle })
    return page()
  }

  const user = await vaultUser()
  if (!user) return page({ error: 'signin' })
  if (!formTokenValid(get('token'), r.raw, user.id)) return page({ error: 'expired' })
  if (action === 'deny') return Response.redirect(deniedRedirect(r, origin), 303)
  if (action === 'allow') return Response.redirect(codeRedirect(r, user, origin), 303)
  return page()
}
