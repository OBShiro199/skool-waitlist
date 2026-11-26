import { allowedRedirect, CORS, oauthError, oauthJson, registerClient } from '@/lib/mcp/oauth'
import { limited } from '@/lib/rate-limit'

// RFC 7591 Dynamic Client Registration (public clients, PKCE). Claude prefers its Client ID
// Metadata Document; this is the fallback for clients without one.
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (limited(`oauth-register:${ip}`, 30, 60 * 60_000)) return oauthError('too_many_requests', 'Too many registrations. Try again later.', 429)
  const body = (await req.json().catch(() => null)) as { redirect_uris?: unknown; client_name?: unknown; token_endpoint_auth_method?: unknown } | null
  if (!body) return oauthError('invalid_client_metadata', 'Send the client metadata as JSON.')
  const uris = Array.isArray(body.redirect_uris) ? body.redirect_uris.filter((x): x is string => typeof x === 'string') : []
  if (!uris.length || uris.length > 10 || !uris.every(allowedRedirect)) {
    return oauthError('invalid_redirect_uri', 'Redirect URIs must be https, or http on localhost / 127.0.0.1.')
  }
  if (body.token_endpoint_auth_method && body.token_endpoint_auth_method !== 'none') {
    return oauthError('invalid_client_metadata', 'Only public clients (token_endpoint_auth_method "none") with PKCE are supported.')
  }
  const name = typeof body.client_name === 'string' && body.client_name.trim() ? body.client_name.trim() : 'MCP client'
  const c = registerClient(name, uris)
  return oauthJson(
    {
      client_id: c.id,
      client_id_issued_at: Math.floor(Date.now() / 1000),
      client_name: c.name,
      redirect_uris: c.redirectUris,
      token_endpoint_auth_method: 'none',
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
    },
    201,
  )
}
export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}
