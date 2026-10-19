'use client'

import { useEffect, useId, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { join, type JoinStatus } from '@/app/actions/join'
import { offer, usd } from '@/content/offer'
import { track } from '@/lib/track'
import { useSite } from './SiteProvider'

type State = 'idle' | JoinStatus

const messages: Partial<Record<State, string>> = {
  invalid: 'Enter a full email address, like you@example.com.',
  rate_limited: 'Too many tries from this connection. Wait a few minutes and try again.',
  error: 'Could not join the waitlist. Check your connection and try again.',
}


export function WaitlistForm({ location, inputId }: { location: string; inputId?: string }) {
  const { phase, joined, markJoined, attribution } = useSite()
  const autoId = useId()
  const id = inputId ?? `email-${autoId}`
  const [state, setState] = useState<State>('idle')
  const [redirecting, setRedirecting] = useState(false)
  const [pending, startTransition] = useTransition()
  const router = useRouter()
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
          <span className="btn-label">{open ? `Join now: ${usd(offer.foundingMonthly)}/month` : 'Join the community'}</span>
        </a>
        <p className="text-13 text-faint">
          {open
            ? `Founding price for ${offer.foundingDays} days · first ${offer.foundingSeats} only`
            : `${usd(offer.monthlyPrice)}/month or ${usd(offer.annualPrice)}/year · cancel anytime`}
        </p>
      </div>
    )
  }

  // another form on the page was used: just confirm, same footprint as the microcopy
  if (joined && !redirecting) {
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
      if (res.status === 'ok' || res.status === 'exists') {
        track('waitlist_success', { location, status: res.status, ref: attribution.ref ?? null, utm_campaign: attribution.utm_campaign ?? null })
        // keep the button busy and go straight to /thanks; that page does the celebrating
        setRedirecting(true)
        markJoined()
        try {
          sessionStorage.setItem('joined', JSON.stringify({ token: res.token ?? null, exists: res.status === 'exists', at: Date.now() }))
        } catch {}
        router.push('/thanks')
      } else {
        setState(res.status)
        track('waitlist_error', { location, status: res.status })
      }
    })
  }

  return (
    <div aria-live="polite">
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            if (!pending && !redirecting) submit(e.currentTarget)
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
              readOnly={pending || redirecting}
              aria-invalid={state === 'invalid'}
              aria-describedby={`${id}-msg`}
              onChange={() => state !== 'idle' && setState('idle')}
            />
            {/* honeypot */}
            <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <button type="submit" className="btn btn-primary btn-lg flex-none min-[480px]:min-w-[190px]" aria-busy={pending || redirecting}>
              <span className="btn-label">Join the waitlist</span>
              {(pending || redirecting) && <span className="spinner" aria-hidden />}
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
    </div>
  )
}
