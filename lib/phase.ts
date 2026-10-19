import type { Phase } from '@/content/offer'

export function serverPhase(): Phase {
  const p = process.env.SITE_PHASE
  return p === 'open' || p === 'closed' ? p : 'waitlist'
}
