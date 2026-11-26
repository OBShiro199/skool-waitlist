import { open } from '@/lib/mcp/oauth'
import { exportIds } from '@/lib/leads/account'
import { isDataset } from '@/lib/leads/datasets'
import { toCsv } from '@/lib/leads/csv'
import { rowsFor } from '@/lib/mcp/leads'
import { tokenAllowed } from '@/lib/mcp/members'
import type { DownloadClaims } from '@/lib/mcp/download'

export const dynamic = 'force-dynamic'

// The CSV for an export made from Claude. The link is signed, tied to the member and the export
// batches, and lasts 24 hours; downloading again is free (the export was already counted).

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const raw = (await params).token.replace(/\.csv$/, '')
  const t = open<DownloadClaims>('bssdl', raw)
  if (!t || !isDataset(t.r)) return new Response('This download link has expired. Ask Claude to export again, or download it from Exports in the Vault.', { status: 410 })
  if (!(await tokenAllowed(t.u, t.iat))) return new Response('Access was removed. Download it from Exports in the Vault.', { status: 403 })
  const user = { id: t.u, handle: t.h }
  const ids: string[] = []
  for (const id of t.e) {
    const e = await exportIds(user, id).catch(() => null)
    if (e) ids.push(...e.ids)
  }
  if (!ids.length) return new Response('That export was not found.', { status: 404 })
  const rows = (await Promise.all(Array.from({ length: Math.ceil(ids.length / 1000) }, (_, i) => rowsFor(t.r as 'uk-eu' | 'us', ids.slice(i * 1000, i * 1000 + 1000))))).flat()
  return new Response(toCsv(rows, t.r), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${t.f.replace(/[^a-z0-9._-]/gi, '-')}"`,
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
