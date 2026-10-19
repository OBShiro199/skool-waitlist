import { isAdmin } from '@/lib/admin'
import { listSignups } from '@/lib/store'

export const dynamic = 'force-dynamic'

const cols = ['email', 'first_name', 'stage', 'form_location', 'ref', 'utm_source', 'utm_medium', 'utm_campaign', 'country', 'created_at'] as const

// quote every cell, and neutralise leading = + - @ so spreadsheets never run it as a formula
const cell = (v: unknown) => {
  let s = v == null ? '' : String(v)
  if (/^[=+\-@]/.test(s)) s = `'${s}`
  return `"${s.replace(/"/g, '""')}"`
}

export async function GET() {
  if (!(await isAdmin())) return new Response('Not found', { status: 404 })
  const rows = await listSignups(100000)
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\n')
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
