import { authServerMetadata, CORS, oauthJson, originOf } from '@/lib/mcp/oauth'

// RFC 8414 authorization server metadata for the Claude connector.
export function GET(req: Request) {
  return oauthJson(authServerMetadata(originOf(req)))
}
export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}
