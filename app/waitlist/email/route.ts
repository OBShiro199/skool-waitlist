import { isAdmin } from '@/lib/admin'
import { confirmationHtml } from '@/emails/confirmation'

export const dynamic = 'force-dynamic'

/** Preview of the confirmation email, for the signed-in owner only. */
export async function GET() {
  if (!(await isAdmin())) return new Response('Not found', { status: 404 })
  return new Response(confirmationHtml(), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } })
}
