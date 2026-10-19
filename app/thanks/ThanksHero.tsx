'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { confetti } from '@/lib/confetti'

export function ThanksHero() {
  const [joined, setJoined] = useState<{ token: string | null; exists: boolean } | null>(null)

  useEffect(() => {
    let j: { token: string | null; exists: boolean; at: number } | null = null
    try {
      j = JSON.parse(sessionStorage.getItem('joined') ?? 'null')
    } catch {}
    if (!j) return
    setJoined(j)
    // celebrate once, right after joining
    if (!j.exists && Date.now() - j.at < 15000) {
      setTimeout(() => confetti(innerWidth / 2, innerHeight * 0.35), 150)
      // DataFast conversion: once per signup, never on refresh or a return visit
      const w = window as unknown as { datafast?: (goal: string) => void }
      w.datafast?.('waitlist_signup')
      try {
        sessionStorage.setItem('joined', JSON.stringify({ ...j, at: 0 }))
      } catch {}
    }
  }, [])

  return (
    <section className="px-4 py-16 text-center md:px-8 md:py-24">
      <p className="inline-flex items-center gap-2 text-13 font-medium text-success">
        <Check size={16} strokeWidth={2} aria-hidden /> {joined?.exists ? 'Already on the list' : 'Confirmed'}
      </p>
      <h1 className="mt-4 text-32 md:text-48">You&apos;re in.</h1>
      <p className="mx-auto mt-4 max-w-[52ch] text-16 text-body">
        Check your emails: a confirmation from Olly is on its way. You&apos;ll hear first when doors open, at the founding price.
      </p>
      <p className="mt-2 text-13 text-faint">Not there in a minute? Check your promotions or spam folder.</p>
    </section>
  )
}
