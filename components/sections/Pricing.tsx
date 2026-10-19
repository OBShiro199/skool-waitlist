import { Check } from 'lucide-react'
import { foundingBothLabel, included, offer } from '@/content/offer'
import { PriceToggle } from '@/components/ui/PriceToggle'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { WaitlistForm } from '@/components/ui/WaitlistForm'

export function Pricing() {
  return (
    <section id="pricing" className="section">
      <div className="text-center">
        <div className="flex justify-center">
          <Eyebrow idx="03">Pricing</Eyebrow>
        </div>
        <h2 className="mt-3 text-24 md:text-32">One membership. Everything included.</h2>
        <p className="mt-3 text-16 text-muted">
          Founding members pay {foundingBothLabel}, locked for as long as they stay.
        </p>
      </div>
      <div className="mx-auto mt-10 grid max-w-[960px] border border-hairline md:grid-cols-2">
        <div className="border-hairline p-5 max-md:border-b md:border-r md:p-8">
          <div className="flex items-center justify-between gap-2">
            <span className="text-13 font-medium text-ink">Founding membership</span>
            <span className="tag tag-blue">First {offer.foundingSeats} only</span>
          </div>
          <PriceToggle />
          <p className="mt-5 text-14">The build, the calls, the course, the leads, the apps and the guides. One price, no tiers.</p>
          <div className="mt-6">
            <WaitlistForm location="pricing" />
          </div>
        </div>
        <div className="p-5 md:p-8">
          <p className="text-13 text-faint">What&apos;s included</p>
          <ul className="mt-4 flex flex-col gap-3">
            {included.map((it) => (
              <li key={it.title} className="flex gap-3 text-14">
                <Check size={16} strokeWidth={1.75} className="mt-[3px] flex-none text-success" aria-hidden />
                <span>
                  <span className="font-medium text-ink">{it.title}</span>
                  <span className="text-muted">: {it.detail}</span>
                  {'founding' in it && it.founding && <span className="tag tag-blue ml-2 align-middle">Founding only</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
