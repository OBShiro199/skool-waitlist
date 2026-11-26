import 'server-only'
import { revalidateTag, unstable_cache } from 'next/cache'
import { siteDb } from '@/lib/store'
import { memberById } from '@/lib/vault-members'

// Who may use the connector, checked on every MCP request (kept in Vercel's shared data cache for
// five minutes, and cleared everywhere at once when the member disconnects):
// the member must still exist and be active, and the token must be newer than their last
// "Disconnect Claude" / password change. The disconnect time lives in the member's Supabase Auth
// user metadata (mcp_revoked_after, unix seconds), so no new tables are needed.

type Standing = { ok: boolean; handle: string; revokedAfter: number }
const memRevoked = new Map<string, number>() // local development without a database
const tag = (userId: string) => `mcp-standing:${userId}`

export const standing = (userId: string): Promise<Standing> =>
  unstable_cache(() => loadStanding(userId), ['mcp-standing-v1', userId], { revalidate: 300, tags: [tag(userId)] })()

// Throws on database errors so a hiccup is never cached as "not allowed" (that one request fails).
async function loadStanding(userId: string): Promise<Standing> {
  const m = await memberById(userId)
  let revokedAfter = memRevoked.get(userId) ?? 0
  const db = siteDb()
  if (db && m) {
    const { data, error } = await db.auth.admin.getUserById(userId)
    if (error) throw new Error(error.message)
    const v = Number((data?.user?.user_metadata as Record<string, unknown> | undefined)?.mcp_revoked_after ?? 0)
    if (Number.isFinite(v)) revokedAfter = v
  }
  return { ok: !!m && m.status !== 'suspended' && m.status !== 'deleted', handle: m?.handle ?? '', revokedAfter }
}

/** Signs Claude (and any other connected MCP client) out of this member's account. */
export async function revokeConnections(userId: string) {
  const t = Math.floor(Date.now() / 1000)
  const db = siteDb()
  if (!db) {
    memRevoked.set(userId, t)
    revalidateTag(tag(userId), { expire: 0 })
    return
  }
  const { data } = await db.auth.admin.getUserById(userId)
  const meta = (data?.user?.user_metadata as Record<string, unknown> | undefined) ?? {}
  const { error } = await db.auth.admin.updateUserById(userId, { user_metadata: { ...meta, mcp_revoked_after: t } })
  if (error) throw new Error(error.message)
  // every server sees the disconnect on its next request
  revalidateTag(tag(userId), { expire: 0 })
}

/** True when a token issued at `iat` (unix seconds) is still allowed for this member. */
export async function tokenAllowed(userId: string, iat: number) {
  const s = await standing(userId).catch(() => null)
  return !!s && s.ok && iat > s.revokedAfter
}
