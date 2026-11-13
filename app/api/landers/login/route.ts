import { headers } from 'next/headers'
import { checkLandersPassword, landersOpen, startLandersSession } from '@/lib/landers/session'
import { limited } from '@/lib/rate-limit'

const json = (b: unknown, status = 200) => Response.json(b, { status, headers: { 'Cache-Control': 'no-store' } })

export async function POST(req: Request) {
  if (!landersOpen()) return json({ error: 'not_configured', message: 'The library is not open yet.' }, 503)
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (limited(`landers-login:${ip}`, 15, 10 * 60_000)) return json({ error: 'rate_limited', message: 'Too many tries. Wait 10 minutes.' }, 429)
  const b = (await req.json().catch(() => ({}))) as { password?: unknown }
  if (typeof b.password !== 'string' || !checkLandersPassword(b.password)) {
    await new Promise((r) => setTimeout(r, 500))
    return json({ error: 'wrong_password', message: "That's not the password. Check the post you got it from and try again." }, 401)
  }
  await startLandersSession()
  return json({ ok: true })
}
