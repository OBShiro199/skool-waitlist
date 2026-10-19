'use client'

import { useEffect, useState } from 'react'
import { offer, usd } from '@/content/offer'
import { Logo } from '@/components/ui/Logo'
import { useSite } from '@/components/ui/SiteProvider'

const links = [
  ['Reviews', '/#reviews'],
  ['Curriculum', '/#curriculum'],
  ['What’s inside', '/#inside'],
  ['Pricing', '/#pricing'],
  ['FAQ', '/#faq'],
] as const

export function focusJoin() {
  const input = document.getElementById('email-hero') as HTMLInputElement | null
  const target = input ?? document.getElementById('join')
  if (!target) return void (location.href = '/#join')
  target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' })
  input?.focus({ preventScroll: true })
}

export function Header() {
  const { phase } = useSite()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <>
      {phase !== 'closed' && (
        <div className="flex h-9 items-center justify-center gap-2 border-b border-hairline px-4 text-13 text-muted">
          <span className="truncate">
            {phase === 'open' ? (
              <>Doors are open. Founding price {usd(offer.foundingMonthly)}/month for the first {offer.foundingSeats} members.</>
            ) : (
              <>
                <span className="max-sm:hidden">Founding price: </span>
                {usd(offer.foundingMonthly)}/month for the first {offer.foundingSeats} members
                <span className="max-sm:hidden">. Waitlist gets in first</span>.
              </>
            )}
          </span>
          {phase === 'open' ? (
            <a href={offer.skoolUrl} className="flex-none font-medium text-ink hover:underline">
              Join now →
            </a>
          ) : (
            <button type="button" onClick={focusJoin} className="flex-none cursor-pointer font-medium text-ink hover:underline">
              Join the waitlist →
            </button>
          )}
        </div>
      )}
      <header
        className={`sticky top-0 z-[90] bg-surface/95 backdrop-blur transition-[border-color] duration-200 ${
          scrolled ? 'border-b border-hairline' : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-12 max-w-[var(--rail)] items-center justify-between gap-4 px-4 md:px-8">
          <a href="/" className="flex min-w-0 items-center gap-2 text-14 font-medium text-ink">
            <Logo />
            <span className="truncate max-[640px]:hidden">{offer.name}</span>
            <span className="min-[641px]:hidden">{offer.shortName}</span>
          </a>
          <nav aria-label="Sections" className="hidden items-center gap-6 min-[900px]:flex">
            {links.map(([label, href]) => (
              <a key={href} href={href} className="text-13 text-muted transition-colors hover:text-ink">
                {label}
              </a>
            ))}
          </nav>
          {phase === 'waitlist' ? (
            <button type="button" className="btn btn-primary btn-sm flex-none" onClick={focusJoin}>
              Join the waitlist
            </button>
          ) : (
            <a href={offer.skoolUrl} className="btn btn-primary btn-sm flex-none">
              Join now
            </a>
          )}
        </div>
      </header>
    </>
  )
}
