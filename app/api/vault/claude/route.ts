import { vaultUser } from '@/lib/vault-auth'
import { revokeConnections } from '@/lib/mcp/members'

export const dynamic = 'force-dynamic'

// DELETE → disconnect Claude (and any other MCP client) from this member's account.
export async function DELETE() {
  const user = await vaultUser()
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 })
  try {
    await revokeConnections(user.id)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'failed', message: 'Could not disconnect. Try again.' }, { status: 502 })
  }
}
