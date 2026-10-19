'use client'

import { useEffect, useState } from 'react'
import { offer, usd } from '@/content/offer'
import { useSite } from '@/components/ui/SiteProvider'

/** Under 768px: floats once the hero form is gone, hides when the final form is in view or an input is focused. */
export function MobileBar() {
  const { phase, joined } = useSite()
  const [heroGone, setHeroGone] = useState(false)
  const [finalIn, setFinalIn] = useState(false)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('join')
    const final = document.getElementById('final')
    if (!hero || !final) return
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setHeroGone(!e.isIntersecting && e.boundingClientRect.top < 0)
        if (e.target === final) setFinalIn(e.isIntersecting)
      }
    })
    io.observe(hero)
    io.observe(final)
    const onFocus = (e: FocusEvent) => setTyping((e.target as HTMLElement)?.tagName === 'INPUT')
    document.addEventListener('focusin', onFocus)
    document.addEventListener('focusout', () => setTyping(false))
    return () => {
      io.disconnect()
      document.removeEventListener('focusin', onFocus)
    }
  }, [])

  const show = heroGone && !finalIn && !typing && !joined
  function go() {
    if (phase !== 'waitlist') return void (location.href = offer.skoolUrl)
    const forms = [...document.querySelectorAll<HTMLInputElement>('input[type=email]')]
    const next = forms.find((f) => f.getBoundingClientRect().top > 0) ?? forms[forms.length - 1]
    next?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    next?.focus({ preventScroll: true })
  }

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-[95] flex h-14 items-center justify-between gap-3 rounded-box bg-surface px-4 shadow-float transition-[opacity,transform] duration-200 md:hidden ${
        show ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
      }`}
      aria-hidden={!show}
    >
      <span className="text-13 text-ink">Founding price {usd(offer.foundingPrice)}/year</span>
      <button type="button" className="btn btn-primary btn-sm" onClick={go} tabIndex={show ? 0 : -1}>
        {phase === 'waitlist' ? 'Join' : 'Join now'}
      </button>
    </div>
  )
}
