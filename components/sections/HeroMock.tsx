import { Rise } from '@/components/ui/Rise'

const feed = [
  { tag: 'Cold email', hue: 'blue', text: 'Sent 400 emails to dental clinics', meta: 'Mon' },
  { tag: 'Call', hue: 'teal', text: 'Discovery call booked with Halden & Rowe', meta: 'Tue' },
  { tag: 'Ad', hue: 'amber', text: 'First Meta ad live at $20/day', meta: 'Wed' },
  { tag: 'Churn save', hue: 'rose', text: 'Saved a cancelling customer with an annual offer', meta: 'Thu' },
  { tag: 'Lesson', hue: 'grey', text: '2.4 Auth, Data & Payments', meta: 'Fri' },
] as const

/** Target path from $0 to $10K, in 10 steps over 12 months. */
function MrrChart() {
  const W = 520
  const H = 220
  const pad = { l: 44, r: 12, t: 12, b: 24 }
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b
  const steps = [0, 300, 900, 1600, 2400, 3500, 4600, 5800, 7000, 8300, 9200, 10000]
  const x = (i: number) => pad.l + (i / (steps.length - 1)) * iw
  const y = (v: number) => pad.t + ih - (v / 10000) * ih
  let d = `M ${x(0)} ${y(0)}`
  steps.forEach((v, i) => {
    if (i === 0) return
    d += ` H ${x(i)} V ${y(v)}`
  })
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden>
      {[0, 2500, 5000, 7500, 10000].map((v) => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="var(--color-divider)" />
          <text x={pad.l - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--color-faint)" className="num">
            {v === 0 ? '$0' : `$${v / 1000}K`}
          </text>
        </g>
      ))}
      <path d={d} fill="none" stroke="var(--color-ghost)" strokeDasharray="3 4" strokeWidth="1.25" />
      <circle cx={x(0)} cy={y(0)} r="4" fill="var(--color-blue)" />
      <circle cx={x(0)} cy={y(0)} r="8" fill="var(--color-blue)" opacity="0.15" />
      <text x={W - pad.r} y={H - 6} textAnchor="end" fontSize="11" fill="var(--color-faint)">
        month 12
      </text>
      <text x={pad.l} y={H - 6} fontSize="11" fill="var(--color-faint)">
        day 1
      </text>
    </svg>
  )
}

export function HeroMock() {
  return (
    <figure className="mx-auto mt-14 max-w-[1040px]">
      <div className="overflow-hidden rounded-box border border-hairline bg-surface text-13">
        <div className="flex h-10 items-center justify-between border-b border-hairline px-4">
          <span className="flex items-center gap-2 text-ink">
            <span className="live-dot" aria-hidden />
            Live build · day 1
          </span>
          <span className="text-faint">Members only</span>
        </div>
        <div className="grid md:grid-cols-[1.3fr_1fr]">
          <div className="border-hairline p-4 md:border-r md:p-5">
            <div className="flex items-baseline justify-between">
              <span className="text-faint">Monthly recurring revenue</span>
              <span className="num text-ink">
                <span className="text-20 font-medium">$0</span> <span className="text-faint">/ $10,000</span>
              </span>
            </div>
            <div className="mt-3">
              <MrrChart />
            </div>
          </div>
          <div className="border-t border-hairline md:border-t-0">
            <div className="flex h-9 items-center border-b border-divider px-4 text-faint">This week</div>
            <Rise id="hero-feed" as="ul">
              {feed.map((f, i) => (
                <li
                  key={f.text}
                  style={{ '--i': i } as React.CSSProperties}
                  className="flex h-12 items-center gap-3 border-b border-divider px-4 last:border-b-0"
                >
                  <span className={`tag tag-${f.hue} w-[84px] justify-center`}>{f.tag}</span>
                  <span className="min-w-0 flex-1 truncate text-body">{f.text}</span>
                  <span className="text-faint">{f.meta}</span>
                </li>
              ))}
            </Rise>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">
        Illustration of the member area: the live build&apos;s revenue against the $10,000 target, and this week&apos;s activity.
      </figcaption>
    </figure>
  )
}
