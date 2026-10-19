import { offer } from '@/content/offer'
import { avatars, reviews, tagHue } from '@/content/reviews'
import { Eyebrow } from '@/components/ui/Eyebrow'

function Avatar({ handle }: { handle: string }) {
  const src = avatars[handle]
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" width={32} height={32} className="h-8 w-8 flex-none rounded-full object-cover" />
  }
  return (
    <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-hover text-13 font-medium text-body" aria-hidden>
      {handle[0].toUpperCase()}
    </span>
  )
}

function Card({ r, hidden }: { r: (typeof reviews)[number]; hidden?: boolean }) {
  return (
    <figure aria-hidden={hidden || undefined} className="flex w-[300px] flex-none flex-col border border-hairline bg-surface p-5 sm:w-[340px]">
      <blockquote className="flex-1 text-14">{r.text}</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <Avatar handle={r.handle} />
        <span className="min-w-0 flex-1 truncate text-13 font-medium text-ink">@{r.handle}</span>
        <span className={`tag tag-${tagHue[r.tag]}`}>{r.tag}</span>
      </figcaption>
    </figure>
  )
}

/** Scrolls on its own; pauses on hover or focus; a still, swipeable row with reduced motion. */
export function Wall() {
  return (
    <section id="reviews" className="border-t border-hairline py-14 md:py-20">
      <div className="px-4 md:px-8">
        <Eyebrow idx="01">Reviews</Eyebrow>
        <h2 className="mt-3 text-24 md:text-32">What people say after watching, then doing.</h2>
        <p className="mt-3 text-16 text-muted">
          Unedited comments from my{' '}
          <a href={offer.youtubeUrl} className="text-ink underline decoration-hairline underline-offset-2 hover:decoration-ink">
            YouTube channel
          </a>
          .
        </p>
      </div>
      <div className="marquee-wrap mt-10 overflow-hidden" role="region" aria-label="Viewer comments" tabIndex={0}>
        <div className="marquee">
          {reviews.map((r, i) => (
            <Card key={i} r={r} />
          ))}
          {reviews.map((r, i) => (
            <Card key={`copy-${i}`} r={r} hidden />
          ))}
        </div>
      </div>
    </section>
  )
}
