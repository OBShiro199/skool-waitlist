import { offer } from '@/content/offer'
import { WaitlistForm } from '@/components/ui/WaitlistForm'
import Image from 'next/image'
import { Check } from 'lucide-react'

export function Hero() {
  return (
    <section id="top" className="px-4 pb-14 pt-14 md:px-8 md:pb-20 md:pt-20">
      <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
        <div className="w-full max-w-[320px] rounded-box border border-blue-edge bg-blue-soft px-3 py-2.5 text-left">
          <div className="flex items-center justify-between text-13">
            <span className="flex items-center gap-2 font-medium text-ink">
              <span className="live-dot" aria-hidden />
              First {offer.earlySlots}
            </span>
            <span className="num text-muted">
              <span className="text-ink">{offer.earlySlotsTaken}</span>/{offer.earlySlots} slots taken
            </span>
          </div>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-white"
            role="progressbar"
            aria-label={`${offer.earlySlotsTaken} of ${offer.earlySlots} slots taken`}
            aria-valuemin={0}
            aria-valuemax={offer.earlySlots}
            aria-valuenow={offer.earlySlotsTaken}
          >
            <div className="h-full rounded-full bg-blue" style={{ width: `${(offer.earlySlotsTaken / offer.earlySlots) * 100}%` }} />
          </div>
        </div>
        <h1 className="mt-6 text-32 md:text-48">Build and sell a profitable SaaS with AI. Watch me do it live.</h1>
        <p className="mt-5 max-w-[60ch] text-16 text-body">
          Get your first 10 paying customers or your money back. You get {offer.leadsLabel} verified B2B leads, a 40-lesson course
          from idea to exit, daily live calls, and a front-row seat while I build my next SaaS to $10K/month.
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-14 text-ink">
          {['First 10 customers or a full refund', `${offer.leadsLabel} verified leads`, '40 lessons + daily calls'].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <Check size={16} strokeWidth={2} className="text-success" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-13 text-faint">
          From {offer.host}: {offer.products} software products built and sold, {offer.clients}+ paying clients.
        </p>
        <div id="join" className="mt-8 w-full max-w-[520px] border border-hairline bg-surface p-5 text-left md:p-6">
          <div className="mb-3 flex items-center justify-between text-13">
            <span className="font-medium text-ink">Join the waitlist</span>
            <span className="text-faint">{offer.foundingSeats} founding spots</span>
          </div>
          <WaitlistForm location="hero" inputId="email-hero" />
        </div>
      </div>
      <figure className="hero-scene mx-auto mt-14 max-w-[1040px] overflow-hidden rounded-box p-4 sm:p-8 md:p-12">
        <Image
          src="/hero.webp"
          alt="Start a profitable app and get 10 paying customers: from idea to paying customers in 5 weeks, no coding needed. Olly, with a rising revenue chart."
          width={2000}
          height={1062}
          priority
          sizes="(min-width: 1104px) 1040px, calc(100vw - 32px)"
          className="block h-auto w-full rounded-box shadow-[0_24px_60px_rgba(8,9,10,0.35),0_8px_20px_rgba(8,9,10,0.18),0_0_0_1px_rgba(8,9,10,0.06)]"
        />
      </figure>
    </section>
  )
}
