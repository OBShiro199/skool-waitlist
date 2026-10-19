'use client'

import { useState } from 'react'
import { offer, usd } from '@/content/offer'

type Period = 'month' | 'year'

export function PriceToggle() {
  const [period, setPeriod] = useState<Period>('month')
  const monthly = period === 'month'
  const yearlyVsMonthly = offer.foundingMonthly * 12 - offer.foundingAnnual

  return (
    <div>
      <div role="radiogroup" aria-label="Billing period" className="mt-5 inline-flex rounded-box border border-hairline p-0.5">
        {(['month', 'year'] as const).map((p) => (
          <button
            key={p}
            type="button"
            role="radio"
            aria-checked={period === p}
            onClick={() => setPeriod(p)}
            className={`h-8 min-w-[88px] cursor-pointer rounded-[5px] px-3 text-13 font-medium transition-colors ${
              period === p ? 'bg-blue-soft text-ink shadow-[inset_0_0_0_1px_var(--color-blue-edge)]' : 'text-muted hover:text-ink'
            }`}
          >
            {p === 'month' ? 'Monthly' : 'Yearly'}
          </button>
        ))}
      </div>
      <p className="mt-4 flex items-baseline gap-2">
        <span className="num text-48 font-medium text-ink">{usd(monthly ? offer.foundingMonthly : offer.foundingAnnual)}</span>
        <span className="text-16 text-muted">/ {period}</span>
      </p>
      {/* both lines always reserve space so switching never moves the layout */}
      <p className="num mt-2 min-h-[18px] text-13 text-faint">
        {monthly ? (
          <>
            <s aria-label={`was ${usd(offer.monthlyPrice)} per month`}>{usd(offer.monthlyPrice)}/month</s> · save{' '}
            {usd(offer.monthlyPrice - offer.foundingMonthly)} a month
          </>
        ) : (
          <>
            <s aria-label={`was ${usd(offer.annualPrice)} per year`}>{usd(offer.annualPrice)}/year</s> · about{' '}
            {usd(Math.round(offer.foundingAnnual / 12))}/month · {usd(yearlyVsMonthly)} less than monthly
          </>
        )}
      </p>
      <p className="num mt-1 text-13 text-faint">
        After launch: {usd(offer.monthlyPrice)}/month or {usd(offer.annualPrice)}/year.
      </p>
    </div>
  )
}
