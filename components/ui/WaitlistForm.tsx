'use client'

import { useEffect, useId, useRef, useState, useTransition } from 'react'
import { Check } from 'lucide-react'
import { join, saveProfile, type JoinStatus } from '@/app/actions/join'
import { offer, usd } from '@/content/offer'
import { track } from '@/lib/track'
import { useSite } from './SiteProvider'

type State = 'idle' | JoinStatus
type Stage = 'idea' | 'building' | 'launched'

const messages: Partial<Record<State, string>> = {
  invalid: 'Enter a full email address, like you@example.com.',
  rate_limited: 'Too many tries from this connection. Wait a few minutes and try again.',
  error: 'Could not join the waitlist. Check your connection and try again.',
}

const stages: { id: Stage; label: string }[] = [
  { id: 'idea', label: 'No idea yet' },
  { id: 'building', label: 'Building' },
  { id: 'launched', label: 'Launched' },
]

export function WaitlistForm({ location, inputId }: { location: string; inputId?: string }) {
  const { phase, joined, markJoined, attribution } = useSite()
  const autoId = useId()
  const id = inputId ?? `email-${autoId}`
  const [state, setState] = useState<State>('idle')
  const [token, setToken] = useState<string>()
  const [pending, startTransition] = useTransition()
  const renderedAt = useRef(0)
  useEffect(() => {
    renderedAt.current = Date.now()
  }, [])

  if (phase !== 'waitlist') {
    const open = phase === 'open'
    return (
      <div className="flex flex-col items-start gap-2">
        <a
          href={offer.skoolUrl}
          className="btn btn-primary btn-lg min-w-60"
          onClick={() => track('cta_click', { location, phase })}
        >
          <span className="btn-label">{open ? `Join now: ${usd(offer.foundingPrice)}/year` : 'Join the community'}</span>
        </a>
        <p className="text-13 text-faint">
          {open
            ? `Founding price for ${offer.foundingDays} days · first ${offer.foundingSeats} only`
            : `${usd(offer.monthlyPrice)}/month or ${usd(offer.annualPrice)}/year · cancel anytime`}
        </p>
      </div>
    )
  }

  const done = state === 'ok' || state === 'exists'

  // another form on the page was used: just confirm, same footprint as the microcopy
  if (joined && !done) {
    return (
      <p className="flex h-[46px] items-center gap-2 text-14 text-ink" role="status">
        <Check size={16} strokeWidth={1.5} className="text-success" aria-hidden /> You&apos;re on the list
      </p>
    )
  }

  function submit(form: HTMLFormElement) {
    const data = new FormData(form)
    track('waitlist_submit', { location })
    startTransition(async () => {
      const res = await join({
        email: String(data.get('email') ?? ''),
        company: String(data.get('company') ?? ''),
        location,
        renderedAt: renderedAt.current,
        ...attribution,
      })
      setState(res.status)
      setToken(res.token)
      if (res.status === 'ok' || res.status === 'exists') {
        track('waitlist_success', { location, status: res.status, ref: attribution.ref ?? null, utm_campaign: attribution.utm_campaign ?? null })
        markJoined()
      } else {
        track('waitlist_error', { location, status: res.status })
      }
    })
  }

  return (
    <div aria-live="polite">
      {done ? (
        <Success exists={state === 'exists'} token={token} />
      ) : (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            if (!pending) submit(e.currentTarget)
          }}
        >
          <div className="flex flex-col gap-2 min-[480px]:flex-row">
            <label htmlFor={id} className="sr-only">
              Email address
            </label>
            <input
              id={id}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="input"
              readOnly={pending}
              aria-invalid={state === 'invalid'}
              aria-describedby={`${id}-msg`}
              onChange={() => state !== 'idle' && setState('idle')}
            />
            {/* honeypot */}
            <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <button type="submit" className="btn btn-primary btn-lg flex-none min-[480px]:min-w-[190px]" aria-busy={pending}>
              <span className="btn-label">Join the waitlist</span>
              {pending && <span className="spinner" aria-hidden />}
            </button>
          </div>
          <p id={`${id}-msg`} className="mt-2 min-h-[18px] text-13 text-faint" role={messages[state] ? 'alert' : undefined}>
            {messages[state] ? (
              <span className="text-danger">{messages[state]}</span>
            ) : (
              <>
                No payment now · founding price locked in · no coding needed ·{' '}
                <a href="/privacy" className="underline decoration-hairline underline-offset-2 hover:text-ink">
                  Privacy
                </a>
              </>
            )}
          </p>
        </form>
      )}
    </div>
  )
}

function Success({ exists, token }: { exists: boolean; token?: string }) {
  const [stage, setStage] = useState<Stage | null>(null)
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const [pending, startTransition] = useTransition()

  function save(next: Stage) {
    setStage(next)
    if (!token) return
    track('waitlist_profile', { stage: next })
    startTransition(async () => {
      const r = await saveProfile({ token, stage: next, first_name: name })
      setSaved(r.ok)
    })
  }

  return (
    <div className="fade-up">
      <p className="flex items-center gap-2 text-16 font-medium text-ink">
        <Check size={18} strokeWidth={2} className="text-success" aria-hidden />
        {exists ? "You're already on the list." : "You're on the list."}
      </p>
      <p className="mt-1 text-14 text-muted">
        {exists
          ? "I'll email you the moment doors open."
          : "Check your inbox for a confirmation from Olly. You'll hear first when doors open."}
      </p>
      {!exists && token && (
        <div className="mt-4 border-t border-divider pt-4">
          <p className="text-13 text-faint">Optional · where are you right now?</p>
          <div className="mt-2 flex flex-wrap gap-2">
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
            {saved ? 'Thanks, that helps me plan the calls.' : ''}
          </p>
        </div>
      )}
    </div>
  )
}
