import { offer, usd } from '@/content/offer'
import { WaitlistForm } from '@/components/ui/WaitlistForm'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { AsciiField } from '@/components/ui/AsciiField'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pt-14 md:px-8 md:pt-20">
      <AsciiField className="absolute inset-x-0 top-0 h-[640px] w-full" />
      <div className="relative mx-auto flex max-w-[720px] flex-col items-center text-center">
        <div className="laser laser-slow w-full max-w-[440px] rounded-box border border-blue-edge bg-blue-soft px-4 py-3 text-left">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-13">
            <span className="flex items-center gap-1.5 text-muted">
              A private
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/skool.png" alt="Skool" width={50} height={16} className="h-4 w-auto" />
              community
            </span>
            <span className="num text-muted">
              <span className="text-ink">{offer.earlySlotsTaken}</span>/{offer.earlySlots} taken
            </span>
          </div>
          <div
            className="mt-2.5 h-[3px] overflow-hidden rounded-full bg-white"
            role="progressbar"
            aria-label={`${offer.earlySlotsTaken} of ${offer.earlySlots} slots taken`}
            aria-valuemin={0}
            aria-valuemax={offer.earlySlots}
            aria-valuenow={offer.earlySlotsTaken}
          >
            <div className="h-full rounded-full bg-blue" style={{ width: `${(offer.earlySlotsTaken / offer.earlySlots) * 100}%` }} />
          </div>
          <p className="num mt-2.5 flex items-center gap-2 text-13 text-muted">
            <span className="live-dot" aria-hidden />
            <span>
              <span className="font-medium text-ink">First {offer.earlySlots} early birds:</span> {usd(offer.foundingMonthly)}/month instead of{' '}
              <s>{usd(offer.monthlyPrice)}</s>
            </span>
          </p>
        </div>
        <h1 className="mt-7 text-32 md:text-48">Build and sell a profitable SaaS with AI. Watch me do it live.</h1>
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
        <div id="join" className="laser mt-8 w-full max-w-[520px] border border-hairline bg-surface p-5 text-left md:p-6">
          <div className="mb-3 flex items-center justify-between text-13">
            <span className="font-medium text-ink">Join the waitlist</span>
            <span className="text-faint">{offer.foundingSeats} founding spots</span>
          </div>
          <WaitlistForm location="hero" inputId="email-hero" />
        </div>
      </div>
      <figure className="hero-scene relative mx-auto mt-14 max-w-[1040px] overflow-hidden rounded-t-box px-4 pt-4 sm:px-8 sm:pt-8 md:px-12 md:pt-12">
        {/* the image runs off the bottom edge: its lower part is cropped */}
        <div className="aspect-[2000/960] overflow-hidden rounded-t-box shadow-[0_24px_60px_rgba(8,9,10,0.35),0_8px_20px_rgba(8,9,10,0.18),0_0_0_1px_rgba(8,9,10,0.06)]">
        <Image
          src="/hero.webp"
          alt="Start a profitable app and get 10 paying customers: from idea to paying customers in 5 weeks, no coding needed. Olly, with a rising revenue chart."
          width={2000}
          height={1062}
          priority
          sizes="(min-width: 1104px) 1040px, calc(100vw - 32px)"
          className="block h-auto w-full"
        />
        </div>
      </figure>
    </section>
  )
}
