import { CODE_TTL, CORS, getClient, issueTokens, oauthError, oauthJson, open, originOf, redirectMatches, s256, spend, MCP_PATH, type CodeClaims, type RefreshClaims } from '@/lib/mcp/oauth'
import { tokenAllowed } from '@/lib/mcp/members'
import { limited } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

// RFC 6749 token endpoint (OAuth 2.1 profile): authorization_code with PKCE S256, and
// refresh_token with rotation. Public clients only; the client is identified by client_id.
async function params(req: Request): Promise<URLSearchParams | null> {
  const type = req.headers.get('content-type') ?? ''
  if (type.includes('application/x-www-form-urlencoded')) return new URLSearchParams(await req.text())
  if (type.includes('application/json')) {
    const j = (await req.json().catch(() => null)) as Record<string, unknown> | null
    if (!j) return null
    const p = new URLSearchParams()
    for (const [k, v] of Object.entries(j)) if (typeof v === 'string') p.set(k, v)
    return p
  }
  return null
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (limited(`oauth-token:${ip}`, 120, 60_000)) return oauthError('too_many_requests', 'Slow down and try again in a minute.', 429)
  const p = await params(req)
  if (!p) return oauthError('invalid_request', 'Send the request as application/x-www-form-urlencoded.', 415)
  const grant = p.get('grant_type')
  const clientId = p.get('client_id') ?? ''

  if (grant === 'authorization_code') {
    const code = open<CodeClaims>('bsscode', p.get('code'))
    if (!code) return oauthError('invalid_grant', 'The authorization code is invalid or has expired.')
    if (clientId && clientId !== code.cid) return oauthError('invalid_grant', 'The code was issued to a different client.')
    const redirect = p.get('redirect_uri')
    if (redirect && redirect !== code.ru) return oauthError('invalid_grant', 'redirect_uri does not match the authorization request.')
    const verifier = p.get('code_verifier') ?? ''
    if (!/^[A-Za-z0-9._~-]{43,128}$/.test(verifier) || s256(verifier) !== code.cc) return oauthError('invalid_grant', 'PKCE verification failed.')
    const resource = p.get('resource')?.replace(/\/$/, '') ?? null
    if (resource && code.res && resource !== code.res.replace(/\/$/, '')) return oauthError('invalid_target', 'The resource does not match the authorization request.')
    if (resource && resource !== `${originOf(req)}${MCP_PATH}`) return oauthError('invalid_target', 'Unknown resource.')
    if (!spend(`code:${code.j}`, CODE_TTL + 60)) return oauthError('invalid_grant', 'The authorization code has already been used.')
    const client = await getClient(code.cid)
    if (!client || !redirectMatches(client.redirectUris, code.ru)) return oauthError('invalid_client', 'Unknown client.', 401)
    return oauthJson(issueTokens({ id: code.sub, handle: code.h }, { id: code.cid, name: code.cn }, code.scope))
  }

  if (grant === 'refresh_token') {
    const rt = open<RefreshClaims>('bssrt', p.get('refresh_token'))
    if (!rt) return oauthError('invalid_grant', 'The refresh token is invalid or has expired.')
    if (clientId && clientId !== rt.cid) return oauthError('invalid_grant', 'The refresh token was issued to a different client.')
    if (!(await tokenAllowed(rt.sub, rt.iat))) return oauthError('invalid_grant', 'Access was removed from the Vault. Connect again.')
    // rotation: each refresh token works once (per server); the new pair replaces it
    if (!spend(`rt:${rt.j}`, 60 * 60 * 24 * 61)) return oauthError('invalid_grant', 'This refresh token has already been used.')
    return oauthJson(issueTokens({ id: rt.sub, handle: rt.h }, { id: rt.cid, name: rt.cn }, rt.scope))
  }

  return oauthError('unsupported_grant_type', 'Use authorization_code or refresh_token.')
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}
