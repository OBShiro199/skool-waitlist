import { apps, appThumbs, categoryHue, type App } from '@/content/apps'
import { Eyebrow } from '@/components/ui/Eyebrow'

function Thumb({ app }: { app: App }) {
  return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/apps/${app.slug}.webp`}
        alt={`${app.name}: ${app.tagline}`}
        width={800}
        height={500}
        loading="lazy"
        className="aspect-[8/5] w-full border-b border-hairline object-cover"
      />
  )
}

const shown = apps.filter((a) => appThumbs.has(a.slug))
const rest = apps.filter((a) => !appThumbs.has(a.slug))

function MoreCard({ hidden }: { hidden?: boolean }) {
  return (
    <article
      aria-hidden={hidden || undefined}
      className="flex w-[300px] flex-none flex-col justify-between rounded-box border border-blue-edge bg-blue-soft p-6 sm:w-[340px]"
    >
      <div>
        <p className="num text-48 font-medium tracking-[-0.045em] text-ink">+{rest.length}</p>
        <p className="mt-1 text-16 font-medium text-ink">more apps, unlocked instantly</p>
        <p className="mt-2 text-13 text-muted">The moment you join, every build and launch template is yours.</p>
      </div>
      <ul className="mt-5 flex flex-wrap gap-1.5">
        {rest.map((a) => (
          <li key={a.slug} className="tag tag-blue bg-surface">
            {a.name}
          </li>
        ))}
      </ul>
    </article>
  )
}

function Card({ app, hidden }: { app: App; hidden?: boolean }) {
  const extra = app.stack.length - 3
  return (
    <article aria-hidden={hidden || undefined} className="flex w-[300px] flex-none flex-col overflow-hidden rounded-box border border-hairline bg-surface sm:w-[340px]">
      <Thumb app={app} />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-16">{app.name}</h3>
          <span className={`tag tag-${categoryHue[app.category]}`}>{app.category}</span>
        </div>
        <p className="mt-1 text-13 font-medium text-ink">{app.tagline}</p>
        <p className="mt-2 line-clamp-3 text-13 text-muted">{app.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {app.stack.slice(0, 3).map((s) => (
            <span key={s} className="tag tag-grey">
              {s}
            </span>
          ))}
          {extra > 0 && <span className="tag tag-grey">+{extra}</span>}
        </div>
        <div className="num mt-auto flex items-center justify-between border-t border-divider pt-3 text-13 text-faint">
          <span>
            {app.buildHours}h build · {app.difficulty}
          </span>
          <span>
            You could charge <span className="font-medium text-ink">${app.from}+/mo</span>
          </span>
        </div>
      </div>
    </article>
  )
}

/** The apps with thumbnails drift slowly left, then a card for the rest; a still, swipeable row with reduced motion. */
export function Apps() {
  return (
    <section id="apps" className="border-t border-hairline py-14 md:py-20">
      <div className="px-4 md:px-8">
        <Eyebrow idx="03">Apps to clone</Eyebrow>
        <h2 className="mt-3 text-24 md:text-32">20 profitable apps, ready to clone.</h2>
        <p className="mt-3 max-w-[60ch] text-16 text-muted">
          Each comes with the full build, the stack and a launch template. Pick one and ship it as your own.
        </p>
      </div>
      <div className="marquee-wrap mt-10 overflow-hidden" role="region" aria-label="Apps you can clone">
        <div className="marquee items-stretch" style={{ animationDuration: '110s' }}>
          {shown.map((a) => (
            <Card key={a.slug} app={a} />
          ))}
          <MoreCard />
          {shown.map((a) => (
            <Card key={`copy-${a.slug}`} app={a} hidden />
          ))}
          <MoreCard hidden />
        </div>
      </div>
    </section>
  )
}
