'use client'

import { useEffect, useState, useTransition } from 'react'
import { Check } from 'lucide-react'
import { saveProfile } from '@/app/actions/join'
import { confetti } from '@/lib/confetti'
import { track } from '@/lib/track'

type Stage = 'idea' | 'building' | 'launched'
const stages: { id: Stage; label: string }[] = [
  { id: 'idea', label: 'No idea yet' },
  { id: 'building', label: 'Building' },
  { id: 'launched', label: 'Launched' },
]

export function ThanksHero() {
  const [joined, setJoined] = useState<{ token: string | null; exists: boolean } | null>(null)
  const [stage, setStage] = useState<Stage | null>(null)
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const [pending, startTransition] = useTransition()

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
      try {
        sessionStorage.setItem('joined', JSON.stringify({ ...j, at: 0 }))
      } catch {}
    }
  }, [])

  function save(next: Stage) {
    setStage(next)
    if (!joined?.token) return
    track('waitlist_profile', { stage: next })
    startTransition(async () => {
      const r = await saveProfile({ token: joined.token!, stage: next, first_name: name })
      setSaved(r.ok)
    })
  }

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

      {joined?.token && (
        <div className="laser laser-slow mx-auto mt-10 max-w-[460px] border border-hairline bg-surface p-5 text-left">
          <p className="text-14 font-medium text-ink">Where are you right now?</p>
          <p className="text-13 text-faint">Optional. It helps me plan the calls.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {stages.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`btn ${stage === s.id ? 'border-blue-edge bg-blue-soft text-ink' : ''}`}
                aria-pressed={stage === s.id}
                onClick={() => save(s.id)}
                disabled={pending}
              >
                {s.label}
              </button>
            ))}
          </div>
          <label className="mt-3 block">
            <span className="sr-only">First name (optional)</span>
            <input
              className="input h-9 text-14"
              placeholder="First name (optional)"
              autoComplete="given-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => stage && name && save(stage)}
            />
          </label>
          <p className="mt-2 min-h-[18px] text-13 text-faint" role="status">
            {saved ? 'Thanks, saved.' : ''}
          </p>
        </div>
      )}
    </section>
  )
}
