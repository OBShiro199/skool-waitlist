import { BookOpen, Database, Gift, LayoutGrid, LifeBuoy, MessageSquare, MessagesSquare, TrendingUp, Video } from 'lucide-react'
import { offer } from '@/content/offer'
import { weeks } from '@/content/curriculum'
import { DotArt, stairRows } from '@/components/ui/DotArt'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Rise } from '@/components/ui/Rise'

function CardHead({ n, icon: Icon, title }: { n: string; icon: typeof Video; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="num text-13 text-ghost">{n}</span>
      <Icon size={16} strokeWidth={1.5} className="text-muted" aria-hidden />
      <h3 className="text-16 text-ink">{title}</h3>
    </div>
  )
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

const leads = [
  ['a.bello@p•••••.io', 'Founder', 'Valid'],
  ['m.hale@n••••••d.io', 'Director', 'Valid'],
  ['p.raman@l•••••t.co', 'C-level', 'Valid'],
  ['d.whit@b••••••••s.com', 'Director', 'Valid'],
  ['s.klein@v•••••l.io', 'Founder', 'Valid'],
] as const

export function Inside() {
  return (
    <section id="inside" className="border-t border-hairline">
      <div className="px-4 pb-10 pt-14 md:px-8 md:pt-20">
        <Eyebrow idx="02">What&apos;s inside</Eyebrow>
        <h2 className="mt-3 text-24 md:text-32">Everything unlocks the day doors open.</h2>
        <p className="mt-3 max-w-[60ch] text-16 text-muted">
          No drip-feed and no upsells. Everything below is there on day one, and the live build adds to it every week.
        </p>
      </div>

      <div className="grid border-t border-hairline md:grid-cols-2">
        {/* 01 */}
        <article className="flex flex-col gap-3 border-hairline p-5 max-md:border-b md:border-r md:p-8">
          <CardHead n="01" icon={TrendingUp} title="Watch me build to $10K/month" />
          <p className="max-w-[52ch] text-14">
            A brand new SaaS, built in private. Every cold email, call, sales call, ad and churn save, as it happens.
          </p>
          <div className="mt-auto pt-4">
            <DotArt rows={stairRows(56, 14, 10)} className="h-auto w-full" />
            <p className="num mt-2 text-13 text-faint">MRR $0 → $10,000</p>
          </div>
        </article>
        {/* 02 */}
        <article className="flex flex-col gap-3 border-hairline p-5 max-md:border-b md:p-8">
          <CardHead n="02" icon={Video} title="Daily live calls" />
          <p className="max-w-[52ch] text-14">
            Monday to Friday at {offer.callTime}, an hour live with me. Bring your product, your numbers and your questions. Every call is
            recorded.
          </p>
          <div className="mt-auto grid grid-cols-5 gap-2 pt-4">
            {days.map((d, i) => (
              <div
                key={d}
                className={`flex h-[72px] flex-col justify-between rounded-box border p-2.5 text-13 ${
                  i === 0 ? 'border-blue-edge bg-blue-soft text-ink' : 'border-hairline text-muted'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {i === 0 && <span className="live-dot" aria-hidden />}
                  {d}
                </span>
                <span className="text-12 text-faint">5pm · 1h</span>
              </div>
            ))}
          </div>
        </article>
        {/* 03 */}
        <article className="flex flex-col gap-3 border-t border-hairline p-5 max-md:border-b md:border-r md:p-8">
          <CardHead n="03" icon={BookOpen} title="The 40-lesson course" />
          <p className="max-w-[52ch] text-14">Five weeks from idea to first customers to exit. Eight lessons a week.</p>
          <div className="mt-auto pt-4">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-13">
              {weeks.map((w, i) => (
                <li key={w.n} className="flex items-center gap-2">
                  <span className="rounded-pill border border-hairline px-2 py-1 text-body">{w.name}</span>
                  {i < weeks.length - 1 && (
                    <span className="text-ghost" aria-hidden>
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
            <a href="#curriculum" className="mt-3 inline-block text-13 text-faint hover:text-ink">
              5 weeks · 40 lessons · 7 guides →
            </a>
          </div>
        </article>
        {/* 04 */}
        <article className="flex flex-col gap-3 border-t border-hairline p-5 max-md:border-b md:p-8">
          <CardHead n="04" icon={Database} title="10M+ verified B2B leads" />
          <p className="max-w-[52ch] text-14">
            Verified contact data, filtered by industry and job title. Export up to {offer.leadExportsPerMonth.toLocaleString('en-US')} records a
            month to CSV.
          </p>
          <div className="mt-auto pt-4" aria-hidden>
            <div className="overflow-hidden rounded-box border border-hairline text-13">
              <div className="flex flex-wrap items-center gap-2 border-b border-hairline px-3 py-2">
                <span className="tag tag-grey">Industry: SaaS</span>
                <span className="tag tag-grey">Title: Founder +1</span>
                <span className="num ml-auto text-faint">148,206 matching</span>
              </div>
              <Rise id="leads-rows">
                {leads.map(([email, title, status], i) => (
                  <div
                    key={email}
                    style={{ '--i': i } as React.CSSProperties}
                    className="flex h-9 items-center gap-3 border-b border-divider px-3 last:border-b-0"
                  >
                    <span className="min-w-0 flex-1 truncate text-body">{email}</span>
                    <span className="tag tag-blue">{title}</span>
                    <span className="tag tag-green">{status}</span>
                  </div>
                ))}
              </Rise>
            </div>
            <div className="mt-3 flex items-center gap-3 text-13 text-faint">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-hover">
                <div className="h-full w-[72%] rounded-full bg-blue" />
              </div>
              <span className="num">5,000 exports a month</span>
            </div>
          </div>
          <p className="text-12 text-faint">Sample view. Members see full records.</p>
        </article>
      </div>

      <div className="grid border-t border-hairline sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['05', MessagesSquare, 'Unlimited Q&A', 'Post any question in the community. Every post answered within 24 hours, 7 days a week.'],
          ['06', LayoutGrid, '20 apps ready to clone', 'Profitable app ideas with the build and a launch template for each. Pick one and ship.'],
          ['07', LifeBuoy, '7 tool guides', 'Claude Code, Stripe, Supabase, Vercel, Trigger.dev, Resend and your own data API, in depth.'],
          ['08', MessageSquare, 'Private DMs with me', 'Message me directly for your first 30 days.'],
        ].map(([n, Icon, title, body], i) => (
          <article
            key={n as string}
            className={`flex flex-col gap-3 border-hairline p-5 md:p-6 max-sm:border-b ${i < 3 ? 'lg:border-r' : ''} ${
              i % 2 === 0 ? 'sm:border-r' : ''
            } ${i < 2 ? 'sm:max-lg:border-b' : ''}`}
          >
            <CardHead n={n as string} icon={Icon as typeof Video} title={title as string} />
            <p className="text-14">{body as string}</p>
          </article>
        ))}
      </div>

      <article className="flex flex-col gap-3 border-t border-hairline p-5 md:flex-row md:items-center md:gap-6 md:p-8">
        <CardHead n="09" icon={Gift} title="Founding bonuses" />
        <p className="flex-1 text-14">
          My real codebases, my Claude skills and my script packs. Only for the first {offer.foundingSeats} members.
        </p>
        <span className="tag tag-blue self-start md:self-auto">Founding members only</span>
      </article>
    </section>
  )
}
