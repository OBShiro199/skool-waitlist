import 'server-only'
import { now, seal } from './oauth'

// Signed links to the CSV of an export made from Claude (app/api/mcp/download/[token]).
export type DownloadClaims = { u: string; h: string; e: number[]; r: string; f: string; iat: number; exp: number }
export const DOWNLOAD_TTL = 60 * 60 * 24

export function downloadUrl(origin: string, c: Omit<DownloadClaims, 'iat' | 'exp'>) {
  const t = now()
  return `${origin}/api/mcp/download/${seal('bssdl', { ...c, iat: t, exp: t + DOWNLOAD_TTL } satisfies DownloadClaims)}.csv`
}
