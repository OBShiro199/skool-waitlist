import { RefreshCcw, ShieldCheck, Zap } from 'lucide-react'

const items = [
  [Zap, 'Everything on day one', 'The course, leads, apps, guides and the live build unlock the moment doors open. Nothing is drip-fed.'],
  [RefreshCcw, 'Cancel anytime', 'One click in Skool stops your renewal. No calls, no email chains, no “tell us why you’re leaving”.'],
  [ShieldCheck, '30-day guarantee', "Go through everything. If it isn't worth far more than you paid, message me within 30 days for a full refund."],
] as const

export function Reassurance() {
  return (
    <section aria-label="Guarantees" className="grid border-t border-hairline md:grid-cols-3">
      {items.map(([Icon, h, p], i) => (
        <div key={h} className={`p-5 md:p-8 ${i < 2 ? 'border-hairline max-md:border-b md:border-r' : ''}`}>
          <p className="flex items-center gap-2 text-13 font-medium text-ink">
            <Icon size={16} strokeWidth={1.5} className="text-muted" aria-hidden />
            {h}
          </p>
          <p className="mt-2 text-14 text-muted">{p}</p>
        </div>
      ))}
    </section>
  )
}
