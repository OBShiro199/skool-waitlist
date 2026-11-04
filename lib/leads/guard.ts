import 'server-only'
import { limited } from '@/lib/rate-limit'
import { vaultUser } from '@/lib/vault-auth'

export const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

/** Signed-in member, or the error response to send (401, 429). 240 requests per member per minute. */
export async function guard(): Promise<{ user: string } | { res: Response }> {
  const user = await vaultUser()
  if (!user) return { res: json({ error: 'unauthorized' }, 401) }
  if (limited(`leads:${user}`, 240, 60_000)) return { res: json({ error: 'rate_limited' }, 429) }
  return { user }
}

export const clampInt = (v: unknown, min: number, max: number, dflt: number) =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : dflt
