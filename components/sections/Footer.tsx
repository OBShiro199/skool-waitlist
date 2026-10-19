import { offer } from '@/content/offer'
import { Logo } from '@/components/ui/Logo'

export function Footer() {
  const col = 'flex flex-col gap-2 text-13'
  const a = 'text-muted hover:text-ink'
  return (
    <footer className="border-t border-hairline px-4 py-12 md:px-8">
      <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-2 text-14 font-medium text-ink">
            <Logo /> {offer.name}
          </p>
          <p className="mt-3 max-w-[44ch] text-13 text-muted">
            A private community where you watch a SaaS get built to $10K/month and build your own alongside it. Run by {offer.host}.
          </p>
        </div>
        <nav aria-label="Community" className={col}>
          <p className="text-faint">Community</p>
          <a className={a} href="#inside">What&apos;s inside</a>
          <a className={a} href="#curriculum">Curriculum</a>
          <a className={a} href="#pricing">Pricing</a>
          <a className={a} href="#faq">FAQ</a>
        </nav>
        <nav aria-label="Channel" className={col}>
          <p className="text-faint">Channel</p>
          <a className={a} href={offer.youtubeUrl}>YouTube</a>
          <a className={a} href={offer.skoolUrl}>Skool</a>
          <a className={a} href="#reviews">Reviews</a>
        </nav>
        <div className={col}>
          <p className="text-faint">Contact</p>
          <a className={a} href={`mailto:${offer.contactEmail}`}>{offer.contactEmail}</a>
          <a className={a} href={`mailto:${offer.contactEmail}?subject=Support`}>Support</a>
        </div>
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6 text-13 text-faint">
        <p>© 2026 Build Software Solo. All rights reserved.</p>
        <div className="flex gap-4">
          <a className={a} href="/privacy">Privacy</a>
          <a className={a} href="/terms">Terms</a>
        </div>
      </div>
    </footer>
  )
}
