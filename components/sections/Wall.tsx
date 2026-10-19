'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { offer } from '@/content/offer'
import { avatars, reviews, tagHue } from '@/content/reviews'
import { Eyebrow } from '@/components/ui/Eyebrow'

function Avatar({ handle }: { handle: string }) {
  const src = avatars[handle]
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" width={32} height={32} loading="lazy" className="h-8 w-8 flex-none rounded-full object-cover" />
  }
  return (
    <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-hover text-13 font-medium text-body" aria-hidden>
      {handle[0].toUpperCase()}
    </span>
  )
}

export function Wall() {
  const track = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    const el = track.current
    if (!el) return
    const update = () => {
      setAtStart(el.scrollLeft < 4)
      setAtEnd(el.scrollLeft + el.clientWidth > el.scrollWidth - 4)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  function page(dir: 1 | -1) {
    const el = track.current
    if (!el) return
    const card = el.querySelector('figure')
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * step * Math.max(1, Math.floor(el.clientWidth / step)), behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="reviews" className="section">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow idx="05">Reviews</Eyebrow>
          <h2 className="mt-3 text-24 md:text-32">What people say after watching, then doing.</h2>
          <p className="mt-3 text-16 text-muted">
            Unedited comments from my{' '}
            <a href={offer.youtubeUrl} className="text-ink underline decoration-hairline underline-offset-2 hover:decoration-ink">
              YouTube channel
            </a>
            .
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn btn-icon disabled:opacity-40" aria-label="Previous reviews" disabled={atStart} onClick={() => page(-1)}>
            <ArrowLeft size={16} strokeWidth={1.5} />
          </button>
          <button type="button" className="btn btn-icon disabled:opacity-40" aria-label="Next reviews" disabled={atEnd} onClick={() => page(1)}>
            <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div
        ref={track}
        role="region"
        aria-roledescription="carousel"
        aria-label="Viewer comments"
        tabIndex={0}
        className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((r, i) => (
          <figure
            key={i}
            aria-label={`${i + 1} of ${reviews.length}`}
            className="flex w-[300px] flex-none snap-start flex-col border border-hairline p-5 sm:w-[340px]"
          >
            <blockquote className="flex-1 text-14">{r.text}</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <Avatar handle={r.handle} />
              <span className="min-w-0 flex-1 truncate text-13 font-medium text-ink">@{r.handle}</span>
              <span className={`tag tag-${tagHue[r.tag]}`}>{r.tag}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
