import 'server-only'
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

// The OAuth 2.1 authorization server behind the Claude connector (MCP authorization spec,
// RFC 8414 metadata, RFC 9728 protected resource metadata, RFC 7591 registration, PKCE S256).
//
// Everything is stateless and signed with TOKEN_SECRET, so it needs no new database tables:
// - clients: Claude's Client ID Metadata Document (an https URL we fetch), or a client id we
//   sign at dynamic registration that carries its own redirect URIs
// - authorization codes: 2 minutes, bound to the client, redirect URI and PKCE challenge
// - access tokens: 1 hour; refresh tokens: 60 days, rotated on every use
// A member cuts access with "Disconnect Claude" (or a password change), which stamps a time on
// their account; tokens issued before it stop working (see revokedAfter in lib/mcp/members.ts).

export const SCOPE = 'leads'
export const ACCESS_TTL = 60 * 60 // seconds
export const REFRESH_TTL = 60 * 60 * 24 * 60
export const CODE_TTL = 120

const key = () => createHash('sha256').update(`mcp-oauth-v1:${process.env.TOKEN_SECRET ?? 'dev-secret'}`).digest()

const b64 = (v: unknown) => Buffer.from(JSON.stringify(v)).toString('base64url')
const mac = (kind: string, body: string) => createHmac('sha256', key()).update(`${kind}.${body}`).digest('base64url')

function same(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

/** `<kind>.<payload>.<mac>` with a JSON payload. */
export function seal(kind: string, payload: Record<string, unknown>): string {
  const body = b64(payload)
  return `${kind}.${body}.${mac(kind, body)}`
}

export function open<T>(kind: string, token: string | null | undefined): T | null {
  if (!token || token.length > 8000) return null
  const parts = token.split('.')
  if (parts.length !== 3 || parts[0] !== kind) return null
  if (!same(parts[2], mac(kind, parts[1]))) return null
  try {
    const v = JSON.parse(Buffer.from(parts[1], 'base64url').toString()) as T & { exp?: number }
    if (typeof v.exp === 'number' && v.exp < Math.floor(Date.now() / 1000)) return null
    return v
  } catch {
    return null
  }
}

export const now = () => Math.floor(Date.now() / 1000)
export const nonce = () => randomBytes(12).toString('base64url')
export const s256 = (verifier: string) => createHash('sha256').update(verifier).digest('base64url')

// ───────────────────────────── tokens ─────────────────────────────

export type AccessClaims = { sub: string; h: string; cid: string; cn: string; iat: number; exp: number; scope: string }
export type RefreshClaims = { sub: string; h: string; cid: string; cn: string; iat: number; exp: number; scope: string; j: string }
export type CodeClaims = { sub: string; h: string; cid: string; cn: string; ru: string; cc: string; res: string | null; scope: string; exp: number; j: string }

export function issueTokens(user: { id: string; handle: string }, client: { id: string; name: string }, scope = SCOPE) {
  const t = now()
  const access = seal('bssat', { sub: user.id, h: user.handle, cid: client.id, cn: client.name, iat: t, exp: t + ACCESS_TTL, scope } satisfies AccessClaims)
  const refresh = seal('bssrt', { sub: user.id, h: user.handle, cid: client.id, cn: client.name, iat: t, exp: t + REFRESH_TTL, scope, j: nonce() } satisfies RefreshClaims)
  return { access_token: access, token_type: 'Bearer', expires_in: ACCESS_TTL, refresh_token: refresh, scope }
}

// Codes and refresh tokens are single-use. A signed token can't be "spent" on its own, so each
// server remembers the ones it has seen; codes also live only two minutes and need the PKCE verifier.
const spent = new Map<string, number>()
export function spend(id: string, ttlSeconds: number): boolean {
  const t = now()
  if (spent.size > 20_000) for (const [k, exp] of spent) if (exp < t) spent.delete(k)
  if (spent.has(id)) return false
  spent.set(id, t + ttlSeconds)
  return true
}

// ───────────────────────────── clients ─────────────────────────────

export type Client = { id: string; name: string; redirectUris: string[]; logo?: string }

const LOOPBACK = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?(\/.*)?$/

/** Redirect URIs a client may register: https anywhere, or http on the loopback address (RFC 8252). */
export function allowedRedirect(uri: string) {
  try {
    const u = new URL(uri)
    if (u.hash) return false
    if (u.protocol === 'https:') return true
    return LOOPBACK.test(uri)
  } catch {
    return false
  }
}

/** Exact match, except loopback redirects may use any port (RFC 8252 section 7.3). */
export function redirectMatches(registered: string[], uri: string) {
  if (registered.includes(uri)) return true
  if (!LOOPBACK.test(uri)) return false
  const strip = (s: string) => {
    try {
      const u = new URL(s)
      return `${u.protocol}//${u.hostname}${u.pathname}${u.search}`
    } catch {
      return s
    }
  }
  return registered.some((r) => LOOPBACK.test(r) && strip(r) === strip(uri))
}

/** Dynamic Client Registration: the client id itself carries the (signed) registration. */
export function registerClient(name: string, redirectUris: string[]): Client {
  const id = seal('bssc', { n: name.slice(0, 80), r: redirectUris.slice(0, 10), t: now() })
  return { id, name, redirectUris }
}

const cimdCache = new Map<string, { at: number; client: Client | null }>()

/** A client by id: a signed DCR id, or an https URL to its Client ID Metadata Document. */
export async function getClient(id: string): Promise<Client | null> {
  if (id.startsWith('bssc.')) {
    const v = open<{ n: string; r: string[] }>('bssc', id)
    return v ? { id, name: v.n || 'MCP client', redirectUris: v.r } : null
  }
  if (!/^https:\/\//.test(id) || id.length > 500) return null
  const hit = cimdCache.get(id)
  if (hit && Date.now() - hit.at < 10 * 60_000) return hit.client
  const client = await fetchCimd(id)
  cimdCache.set(id, { at: Date.now(), client })
  return client
}

async function fetchCimd(url: string): Promise<Client | null> {
  let u: URL
  try {
    u = new URL(url)
  } catch {
    return null
  }
  // no IP-literal or internal hosts: metadata documents live on public domains
  if (/^\d+\.\d+\.\d+\.\d+$/.test(u.hostname) || u.hostname.includes(':') || !u.hostname.includes('.') || /(^|\.)(local|internal|localhost)$/.test(u.hostname)) return null
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' }, redirect: 'error', signal: AbortSignal.timeout(4000), cache: 'no-store' })
    if (!res.ok) return null
    const text = await res.text()
    if (text.length > 20_000) return null
    const doc = JSON.parse(text) as { client_id?: string; client_name?: string; redirect_uris?: unknown; logo_uri?: string }
    // the document must name itself as the client id, so nobody can host a copy of another client's
    if (doc.client_id !== url) return null
    const uris = Array.isArray(doc.redirect_uris) ? doc.redirect_uris.filter((x): x is string => typeof x === 'string' && allowedRedirect(x)) : []
    if (!uris.length) return null
    return { id: url, name: (doc.client_name ?? u.hostname).slice(0, 80), redirectUris: uris, logo: typeof doc.logo_uri === 'string' ? doc.logo_uri : undefined }
  } catch {
    return null
  }
}

/** A friendly name for the consent screen. */
export function clientLabel(c: Client) {
  if (/claude\.ai|anthropic\.com|claude\.com/.test(c.id) || /claude/i.test(c.name)) return c.name.toLowerCase().includes('claude') ? c.name : 'Claude'
  return c.name
}

// ───────────────────────────── metadata ─────────────────────────────

/** The public origin of this request (Vercel sets x-forwarded-host), so metadata always matches the URL Claude used. */
export function originOf(req: Request) {
  const h = req.headers
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? new URL(req.url).host
  const proto = h.get('x-forwarded-proto') ?? new URL(req.url).protocol.replace(':', '')
  return `${proto.split(',')[0].trim()}://${host.split(',')[0].trim()}`
}

export const MCP_PATH = '/api/mcp'

export function authServerMetadata(origin: string) {
  return {
    issuer: origin,
    authorization_endpoint: `${origin}/oauth/authorize`,
    token_endpoint: `${origin}/api/oauth/token`,
    registration_endpoint: `${origin}/api/oauth/register`,
    revocation_endpoint: `${origin}/api/oauth/revoke`,
    response_types_supported: ['code'],
    response_modes_supported: ['query'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['none'],
    revocation_endpoint_auth_methods_supported: ['none'],
    client_id_metadata_document_supported: true,
    scopes_supported: [SCOPE],
    authorization_response_iss_parameter_supported: true,
    service_documentation: `${origin}/vault/app/leads`,
  }
}

export function protectedResourceMetadata(origin: string) {
  return {
    resource: `${origin}${MCP_PATH}`,
    authorization_servers: [origin],
    scopes_supported: [SCOPE],
    bearer_methods_supported: ['header'],
    resource_name: 'Build Software Solo Leads',
    resource_documentation: `${origin}/vault/app/leads`,
  }
}

export const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, MCP-Protocol-Version',
  'Access-Control-Max-Age': '86400',
}

export const oauthJson = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store', Pragma: 'no-cache', ...CORS } })

export const oauthError = (error: string, description: string, status = 400) => oauthJson({ error, error_description: description }, status)
