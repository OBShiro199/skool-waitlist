import { offer } from '@/content/offer'
import { WaitlistForm } from '@/components/ui/WaitlistForm'
import { HeroMock } from './HeroMock'

export function Hero() {
  return (
    <section id="top" className="px-4 pb-14 pt-14 md:px-8 md:pb-20 md:pt-20">
      <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
        <span className="tag tag-blue h-7 gap-2 px-2.5 text-13">
          <span className="live-dot" aria-hidden />
          Waitlist open · founding spots limited to {offer.foundingSeats}
        </span>
        <h1 className="mt-6 text-32 md:text-48">Build and sell a profitable SaaS with AI. Watch me do it live.</h1>
        <p className="mt-5 max-w-[60ch] text-16 text-body">
          I&apos;ve built and sold {offer.products} software products, with {offer.clients}+ paying clients across them. Now I&apos;m
          building my next SaaS to $10K/month, in private, and you get to watch every move.
        </p>
        <div id="join" className="mt-8 w-full max-w-[520px] border border-hairline bg-surface p-5 text-left md:p-6">
          <div className="mb-3 flex items-center justify-between text-13">
            <span className="font-medium text-ink">Join the waitlist</span>
            <span className="text-faint">{offer.foundingSeats} founding spots</span>
          </div>
          <WaitlistForm location="hero" inputId="email-hero" />
        </div>
      </div>
      <HeroMock />
    </section>
  )
}
