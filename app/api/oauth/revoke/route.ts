import { CORS, open, spend, type RefreshClaims } from '@/lib/mcp/oauth'

// RFC 7009 token revocation. Refresh tokens are marked spent; access tokens expire within the
// hour (members cut every connection at once with "Disconnect Claude" in the Vault).
export async function POST(req: Request) {
  const form = new URLSearchParams(await req.text().catch(() => ''))
  const rt = open<RefreshClaims>('bssrt', form.get('token'))
  if (rt) spend(`rt:${rt.j}`, 60 * 60 * 24 * 61)
  return new Response(null, { status: 200, headers: CORS })
}
export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}
