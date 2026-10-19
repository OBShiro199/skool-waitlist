'use client'

import { useState } from 'react'
import { offer } from '@/content/offer'
import { reviews, tagHue } from '@/content/reviews'
import { Eyebrow } from '@/components/ui/Eyebrow'

export function Wall() {
  const [all, setAll] = useState(false)
  return (
    <section id="reviews" className="section">
      <Eyebrow idx="05">Reviews</Eyebrow>
      <h2 className="mt-3 text-24 md:text-32">What people say after watching, then doing.</h2>
      <p className="mt-3 text-16 text-muted">
        Unedited comments from my{' '}
        <a href={offer.youtubeUrl} className="text-ink underline decoration-hairline underline-offset-2 hover:decoration-ink">
          YouTube channel
        </a>
        .
      </p>
      <div className="mt-10 gap-4 sm:columns-2 lg:columns-3">
        {reviews.map((r, i) => (
          <figure
            key={i}
            className={`mb-4 break-inside-avoid border border-hairline p-5 ${!all && i >= 8 ? 'max-sm:hidden' : ''}`}
          >
            <figcaption className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-hover text-12 font-medium text-body" aria-hidden>
                {r.handle[0].toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 truncate text-13 font-medium text-ink">@{r.handle}</span>
              <span className={`tag tag-${tagHue[r.tag]}`}>{r.tag}</span>
            </figcaption>
            <blockquote className="mt-3 text-14">{r.text}</blockquote>
          </figure>
        ))}
      </div>
      {!all && (
        <button type="button" className="btn mt-2 w-full sm:hidden" onClick={() => setAll(true)}>
          Show all {reviews.length}
        </button>
      )}
    </section>
  )
}
