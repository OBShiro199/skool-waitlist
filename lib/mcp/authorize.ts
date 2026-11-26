import 'server-only'
import { createHash } from 'node:crypto'
import { CODE_TTL, clientLabel, getClient, MCP_PATH, nonce, now, open, redirectMatches, SCOPE, seal, type Client, type CodeClaims } from './oauth'

// One authorization request (RFC 6749 4.1.1 + PKCE + RFC 8707 resource), checked the same way
// by the consent page and the form handler.
export type AuthRequest = {
  client: Client
  label: string
  redirectUri: string
  state: string | null
  challenge: string
  resource: string | null
  scope: string
  raw: Record<string, string>
}

export type Checked =
  | { ok: true; req: AuthRequest }
  // errors we must show on our page: the redirect URI can't be trusted
  | { ok: false; show: string }
  // errors we send back to the client's redirect URI
  | { ok: false; redirect: string }

const KEYS = ['response_type', 'client_id', 'redirect_uri', 'state', 'code_challenge', 'code_challenge_method', 'scope', 'resource'] as const

export async function checkAuthRequest(input: Record<string, string | string[] | undefined>, origin: string): Promise<Checked> {
  const raw: Record<string, string> = {}
  for (const k of KEYS) {
    const v = input[k]
    if (typeof v === 'string') raw[k] = v
  }
  const client = raw.client_id ? await getClient(raw.client_id) : null
  if (!client) return { ok: false, show: 'This connection request came from an app we could not identify. Start again from Claude.' }
  const redirectUri = raw.redirect_uri ?? (client.redirectUris.length === 1 ? client.redirectUris[0] : '')
  if (!redirectUri || !redirectMatches(client.redirectUris, redirectUri)) {
    return { ok: false, show: 'This connection request has a return address the app did not register. Start again from Claude.' }
  }
  const back = (error: string, description: string) => {
    const u = new URL(redirectUri)
    u.searchParams.set('error', error)
    u.searchParams.set('error_description', description)
    if (raw.state) u.searchParams.set('state', raw.state)
    u.searchParams.set('iss', origin)
    return { ok: false as const, redirect: u.toString() }
  }
  if (raw.response_type !== 'code') return back('unsupported_response_type', 'Only response_type=code is supported.')
  if (!raw.code_challenge || raw.code_challenge_method !== 'S256' || !/^[A-Za-z0-9_-]{43}$/.test(raw.code_challenge)) {
    return back('invalid_request', 'PKCE with code_challenge_method=S256 is required.')
  }
  const resource = raw.resource ?? null
  if (resource && resource.replace(/\/$/, '') !== `${origin}${MCP_PATH}`) return back('invalid_target', 'Unknown resource.')
  const scopes = (raw.scope ?? SCOPE).split(/\s+/).filter(Boolean)
  // we only have one scope; offline_access is implied by refresh tokens
  if (scopes.some((s) => s !== SCOPE && s !== 'offline_access')) return back('invalid_scope', `Supported scope: ${SCOPE}.`)
  return {
    ok: true,
    req: { client, label: clientLabel(client), redirectUri, state: raw.state ?? null, challenge: raw.code_challenge, resource, scope: SCOPE, raw },
  }
}

/** A short-lived token that ties the consent form to this exact request (CSRF protection). */
const fingerprint = (raw: Record<string, string>) => createHash('sha256').update(JSON.stringify(KEYS.map((k) => raw[k] ?? ''))).digest('base64url')
export const formToken = (raw: Record<string, string>, userId: string) => seal('bssreq', { f: fingerprint(raw), u: userId, exp: now() + 15 * 60 })
export function formTokenValid(token: string, raw: Record<string, string>, userId: string) {
  const v = open<{ f: string; u: string }>('bssreq', token)
  return !!v && v.f === fingerprint(raw) && v.u === userId
}

/** The redirect back to the client with a fresh authorization code. */
export function codeRedirect(r: AuthRequest, user: { id: string; handle: string }, origin: string) {
  const code = seal('bsscode', {
    sub: user.id, h: user.handle, cid: r.client.id, cn: r.label, ru: r.redirectUri, cc: r.challenge,
    res: r.resource, scope: r.scope, exp: now() + CODE_TTL, j: nonce(),
  } satisfies CodeClaims)
  const u = new URL(r.redirectUri)
  u.searchParams.set('code', code)
  if (r.state) u.searchParams.set('state', r.state)
  u.searchParams.set('iss', origin)
  return u.toString()
}

export function deniedRedirect(r: AuthRequest, origin: string) {
  const u = new URL(r.redirectUri)
  u.searchParams.set('error', 'access_denied')
  u.searchParams.set('error_description', 'The member did not allow access.')
  if (r.state) u.searchParams.set('state', r.state)
  u.searchParams.set('iss', origin)
  return u.toString()
}

export const authorizeQuery = (raw: Record<string, string>) => new URLSearchParams(raw).toString()
