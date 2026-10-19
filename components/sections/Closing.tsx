import { CircleHelp } from 'lucide-react'
import { offer, usd } from '@/content/offer'
import { DotArt, stairRows } from '@/components/ui/DotArt'
import { WaitlistForm } from '@/components/ui/WaitlistForm'

export function StillDeciding() {
  return (
    <section className="section grid items-center gap-6 md:grid-cols-2 md:gap-12">
      <div className="flex gap-3">
        <CircleHelp size={20} strokeWidth={1.5} className="mt-[3px] flex-none text-muted" aria-hidden />
        <div>
          <p className="text-16 font-medium text-ink">Still deciding?</p>
          <p className="text-14 text-muted">Join the waitlist. It costs nothing and gets you the founding price first.</p>
        </div>
      </div>
      <WaitlistForm location="still_deciding" />
    </section>
  )
}

export function FinalCta() {
  return (
    <section id="final" className="section grid items-center gap-10 md:grid-cols-2 md:gap-12">
      <div>
        <h2 className="text-24 md:text-32">Get on the waitlist. Leave whenever you want.</h2>
        <p className="mt-3 max-w-[50ch] text-16 text-muted">
          First in line when doors open, at {usd(offer.foundingPrice)}/year instead of {usd(offer.annualPrice)}, locked for as long as you
          stay. Cancel anytime, 30-day money-back guarantee.
        </p>
        <div className="mt-6">
          <WaitlistForm location="final" />
        </div>
      </div>
      <DotArt rows={stairRows(44, 22, 8)} cell={8} className="h-auto w-full max-md:hidden" />
    </section>
  )
}
