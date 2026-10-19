import type { Metadata } from 'next'
import { Download, LogOut, Mail } from 'lucide-react'
import { adminConfigured, isAdmin } from '@/lib/admin'
import { listSignups, usingLocalStore } from '@/lib/store'
import { Logo } from '@/components/ui/Logo'
import { offer } from '@/content/offer'
import { LoginForm } from './LoginForm'
import { logout } from './actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Waitlisters', robots: { index: false, follow: false } }

const stageLabel = { idea: 'No idea yet', building: 'Building', launched: 'Launched' } as const
const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' })

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="rail min-h-screen">
      <div className="flex h-12 items-center justify-between border-b border-hairline px-4 md:px-8">
        <a href="/" className="flex items-center gap-2 text-14 font-medium text-ink">
          <Logo /> {offer.name}
        </a>
        <span className="text-13 text-faint">Private</span>
      </div>
      {children}
    </main>
  )
}

export default async function WaitlistAdmin() {
  if (!adminConfigured()) {
    return (
      <Shell>
        <div className="mx-auto max-w-[420px] px-4 py-20">
          <h1 className="text-24">Not set up yet</h1>
          <p className="mt-2 text-14 text-muted">
            Add a <code>WAITLIST_ADMIN_PASSWORD</code> environment variable in Vercel, then redeploy.
          </p>
        </div>
      </Shell>
    )
  }

  if (!(await isAdmin())) {
    return (
      <Shell>
        <div className="mx-auto max-w-[420px] px-4 py-20">
          <h1 className="text-24">Waitlisters</h1>
          <p className="mt-2 text-14 text-muted">Enter the password to see everyone on the waitlist.</p>
          <LoginForm />
        </div>
      </Shell>
    )
  }

  let rows: Awaited<ReturnType<typeof listSignups>> = []
  let failed = false
  try {
    rows = await listSignups()
  } catch (e) {
    console.error('listSignups failed', e)
    failed = true
  }
  const today = new Date().toISOString().slice(0, 10)
  const todayCount = rows.filter((r) => r.created_at.slice(0, 10) === today).length
  const sources = Object.entries(
    rows.reduce<Record<string, number>>((acc, r) => {
      const k = r.ref || r.utm_source || 'direct'
      acc[k] = (acc[k] ?? 0) + 1
      return acc
    }, {}),
  ).sort((a, b) => b[1] - a[1])

  return (
    <Shell>
      <div className="px-4 py-10 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-24 md:text-32">Waitlisters</h1>
            {usingLocalStore && <p className="mt-1 text-13 text-warning">Local test data. Connect Supabase to see live signups.</p>}
          </div>
          <div className="flex gap-2">
            <a href="/waitlist/email" className="btn" target="_blank" rel="noreferrer">
              <Mail size={14} strokeWidth={1.5} aria-hidden /> Preview email
            </a>
            <a href="/waitlist/export" className="btn">
              <Download size={14} strokeWidth={1.5} aria-hidden /> Export CSV
            </a>
            <form action={logout}>
              <button type="submit" className="btn">
                <LogOut size={14} strokeWidth={1.5} aria-hidden /> Sign out
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 border border-hairline md:grid-cols-4">
          {[
            ['Total', rows.length.toLocaleString('en-GB')],
            ['Today', todayCount.toLocaleString('en-GB')],
            ['Top source', sources[0] ? `${sources[0][0]} (${sources[0][1]})` : '–'],
            ['Answered stage', rows.filter((r) => r.stage).length.toLocaleString('en-GB')],
          ].map(([label, value], i) => (
            <div key={label} className={`p-4 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'max-md:border-b' : ''} ${i === 1 ? 'md:border-r' : ''} border-hairline`}>
              <p className="text-13 text-faint">{label}</p>
              <p className="num mt-1 truncate text-20 font-medium text-ink">{value}</p>
            </div>
          ))}
        </div>

        {failed ? (
          <p className="mt-8 text-14 text-danger">Could not load signups. Check the Supabase settings in Vercel, then reload.</p>
        ) : rows.length === 0 ? (
          <p className="mt-8 text-14 text-muted">No signups yet. They&apos;ll appear here as people join.</p>
        ) : (
          <div className="mt-8 overflow-x-auto border border-hairline">
            <table className="w-full min-w-[980px] text-left text-13">
              <thead className="text-faint">
                <tr className="h-9 border-b border-hairline">
                  {['#', 'Email', 'Name', 'Stage', 'Form', 'Source', 'Campaign', 'Country', 'Confirmation', 'Joined'].map((h) => (
                    <th key={h} className="px-3 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id} className="h-11 border-b border-divider last:border-b-0 hover:bg-row-hover">
                    <td className="num px-3 text-faint">{rows.length - i}</td>
                    <td className="px-3 text-ink">{r.email}</td>
                    <td className="px-3">{r.first_name || <span className="text-ghost">–</span>}</td>
                    <td className="px-3">{r.stage ? <span className="tag tag-blue">{stageLabel[r.stage]}</span> : <span className="text-ghost">–</span>}</td>
                    <td className="px-3 text-muted">{r.form_location}</td>
                    <td className="px-3 text-muted">{r.ref || r.utm_source || <span className="text-ghost">direct</span>}</td>
                    <td className="px-3 text-muted">{r.utm_campaign || <span className="text-ghost">–</span>}</td>
                    <td className="px-3 text-muted">{r.country || <span className="text-ghost">–</span>}</td>
                    <td className="px-3">
                      {r.confirmation_sent_at ? <span className="tag tag-green">Sent</span> : <span className="tag tag-rose">Not sent</span>}
                    </td>
                    <td className="num whitespace-nowrap px-3 text-muted">{fmt.format(new Date(r.created_at))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Shell>
  )
}
