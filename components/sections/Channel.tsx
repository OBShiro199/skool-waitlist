'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { reviews, tagHue } from '@/content/reviews'
import { Eyebrow } from '@/components/ui/Eyebrow'

export function Channel() {
  const [i, setI] = useState(6)
  const total = reviews.length
  const go = (d: number) => setI((v) => (v + d + total) % total)
  const r = reviews[i]

  return (
    <section className="section grid gap-8 md:grid-cols-[1fr_2fr] md:gap-12">
      <div>
        <Eyebrow idx="01">From the channel</Eyebrow>
        <p className="mt-3 max-w-[40ch] text-14 text-muted">
          Real comments from my YouTube viewers. The community is the paid, private version of everything they&apos;re reacting to.
        </p>
      </div>
      <div
        aria-roledescription="carousel"
        aria-label="Viewer comments"
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') go(-1)
          if (e.key === 'ArrowRight') go(1)
        }}
      >
        {/* every slide is stacked in one grid cell, so the box is always as tall as the longest quote */}
        <div className="grid" aria-live="polite">
          {reviews.map((rv, idx) => (
            <figure
              key={idx}
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${total}`}
              aria-hidden={idx !== i}
              className={`col-start-1 row-start-1 transition-opacity duration-200 ${idx === i ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            >
              <span className={`tag tag-${tagHue[rv.tag]}`}>{rv.tag}</span>
              <blockquote className="mt-4 text-20 font-medium text-ink">&ldquo;{rv.text}&rdquo;</blockquote>
              <figcaption className="mt-4 flex items-center gap-2 text-13 text-muted">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-hover text-12 font-medium text-body" aria-hidden>
                  {rv.handle[0].toUpperCase()}
                </span>
                @{rv.handle}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-2">
          <button type="button" className="btn btn-icon" aria-label="Previous comment" onClick={() => go(-1)}>
            <ArrowLeft size={16} strokeWidth={1.5} />
          </button>
          <button type="button" className="btn btn-icon" aria-label="Next comment" onClick={() => go(1)}>
            <ArrowRight size={16} strokeWidth={1.5} />
          </button>
          <span className="num ml-2 text-13 text-faint">
            <span className="text-ink">{String(i + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
          </span>
          <span className="sr-only">Showing comment by @{r.handle}</span>
        </div>
      </div>
    </section>
  )
}
