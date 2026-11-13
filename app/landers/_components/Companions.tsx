import s from './shared.module.css'

type Spot = { src: string; top: string; left?: string; right?: string; size: number; delay?: number; rotate?: number }

/** Decorative companion images floating in a section. Hidden from screen readers and on small screens. */
export function Companions({ spots }: { spots: Spot[] }) {
  return (
    <div className={s.companions} aria-hidden>
      {spots.map((p, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={p.src}
          alt=""
          className={s.companion}
          loading="lazy"
          style={{ top: p.top, left: p.left, right: p.right, width: p.size, animationDelay: `${p.delay ?? i * -2.3}s`, ['--r' as string]: `${p.rotate ?? 0}deg` }}
        />
      ))}
    </div>
  )
}
