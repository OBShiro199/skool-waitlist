import { offer, usd } from '@/content/offer'

const cells = [
  ['40', 'lessons across 5 weeks'],
  ['10M+', 'verified B2B leads'],
  ['20', 'apps ready to clone'],
  [usd(offer.foundingMonthly), 'per month, founding members'],
] as const

export function Numbers() {
  return (
    <section aria-label="At a glance" className="grid grid-cols-2 border-t border-hairline md:grid-cols-4">
      {cells.map(([n, label], i) => (
        <div
          key={label}
          className={`px-4 py-6 md:px-8 md:py-8 ${i % 2 === 0 ? 'border-r border-hairline' : ''} ${i < 2 ? 'max-md:border-b' : ''} ${
            i === 1 ? 'md:border-r' : ''
          } border-hairline`}
        >
          <p className="num text-24 font-medium text-ink md:text-32">{n}</p>
          <p className="mt-1 text-13 text-faint">{label}</p>
        </div>
      ))}
    </section>
  )
}
