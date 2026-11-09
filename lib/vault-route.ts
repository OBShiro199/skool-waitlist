import 'server-only'
import { headers } from 'next/headers'
import { json } from '@/lib/leads/guard'
import { MemberError } from '@/lib/vault-members'

export const clientIp = async () => (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

/** Runs a route body, turning MemberError into a JSON error with a member-friendly message. */
export async function handle(fn: () => Promise<Response>) {
  try {
    return await fn()
  } catch (e) {
    if (e instanceof MemberError) return json({ error: e.code, message: e.message }, e.status)
    console.error('vault route failed', e instanceof Error ? e.message : e)
    return json({ error: 'server_error', message: 'Something went wrong. Try again.' }, 500)
  }
}

export const body = async (req: Request) => (await req.json().catch(() => ({}))) as Record<string, unknown>
export const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.slice(0, max) : '')
