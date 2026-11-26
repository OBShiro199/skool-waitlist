import 'server-only'
import { siteDb } from '@/lib/store'
import { memberById } from '@/lib/vault-members'

// Who may use the connector, checked on every MCP request (cached briefly per server):
// the member must still exist and be active, and the token must be newer than their last
// "Disconnect Claude" / password change. The disconnect time lives in the member's Supabase Auth
// user metadata (mcp_revoked_after, unix seconds), so no new tables are needed.

type Standing = { ok: boolean; handle: string; revokedAfter: number }
const cache = new Map<string, { at: number; v: Standing }>()
const memRevoked = new Map<string, number>() // local development without a database

export async function standing(userId: string): Promise<Standing> {
  const hit = cache.get(userId)
  if (hit && Date.now() - hit.at < 60_000) return hit.v
  const m = await memberById(userId).catch(() => null)
  let revokedAfter = memRevoked.get(userId) ?? 0
  const db = siteDb()
  if (db && m) {
    const { data } = await db.auth.admin.getUserById(userId)
    const v = Number((data?.user?.user_metadata as Record<string, unknown> | undefined)?.mcp_revoked_after ?? 0)
    if (Number.isFinite(v)) revokedAfter = v
  }
  const v: Standing = { ok: !!m && m.status !== 'suspended' && m.status !== 'deleted', handle: m?.handle ?? '', revokedAfter }
  cache.set(userId, { at: Date.now(), v })
  return v
}

/** Signs Claude (and any other connected MCP client) out of this member's account. */
export async function revokeConnections(userId: string) {
  const t = Math.floor(Date.now() / 1000)
  cache.delete(userId)
  const db = siteDb()
  if (!db) {
    memRevoked.set(userId, t)
    return
  }
  const { data } = await db.auth.admin.getUserById(userId)
  const meta = (data?.user?.user_metadata as Record<string, unknown> | undefined) ?? {}
  const { error } = await db.auth.admin.updateUserById(userId, { user_metadata: { ...meta, mcp_revoked_after: t } })
  if (error) throw new Error(error.message)
}

/** True when a token issued at `iat` (unix seconds) is still allowed for this member. */
export async function tokenAllowed(userId: string, iat: number) {
  const s = await standing(userId)
  return s.ok && iat > s.revokedAfter
}
