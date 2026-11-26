import { CORS, oauthJson, originOf, protectedResourceMetadata } from '@/lib/mcp/oauth'

// RFC 9728 protected resource metadata for /api/mcp. Served at the root and at
// /.well-known/oauth-protected-resource/api/mcp, the path-specific address clients probe.
export function GET(req: Request) {
  return oauthJson(protectedResourceMetadata(originOf(req)))
}
export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}
