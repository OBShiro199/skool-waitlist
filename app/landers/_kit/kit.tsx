import k from './kit.module.css'
import { HeroVideo } from '../_components/HeroVideo'
import { Reveal } from './client'

export { Nav, Reveal, CountUp, Spotlight } from './client'

/** Headline whose words rise in one after another. Lines split on "|"; wrap words in *stars* for the accent style. */
export function Headline({ text, className = '' }: { text: string; className?: string }) {
  let i = 0
  return (
    <h1 className={`${k.h1} ${className}`}>
      {text.split('|').map((line, li) => (
        <span key={li} className={k.line}>
          {line.trim().split(' ').map((w, wi) => {
            const accent = w.startsWith('*')
            const word = w.replace(/\*/g, '')
            return <span key={wi} className={`${k.word} ${accent ? k.accentWord : ''}`} style={{ animationDelay: `${120 + i++ * 70}ms` }}>{word}&nbsp;</span>
          })}
        </span>
      ))}
    </h1>
  )
}

export function Pill({ children }: { children: React.ReactNode }) {
  return <span className={k.pill}><i />{children}</span>
}

export function Buttons({ primary, secondary }: { primary: string; secondary?: string }) {
  return (
    <div className={k.buttons}>
      <button type="button" className={k.btnPrimary}>{primary}<span aria-hidden>→</span></button>
      {secondary && <button type="button" className={k.btnGhost}>{secondary}</button>}
    </div>
  )
}

export function SectionHead({ eyebrow, title, sub, align = 'center', id }: { eyebrow: string; title: React.ReactNode; sub?: string; align?: 'center' | 'left'; id?: string }) {
  return (
    <Reveal className={`${k.head} ${align === 'left' ? k.headLeft : ''}`}>
      <span id={id} className={k.eyebrow}>{eyebrow}</span>
      <h2 className={k.h2}>{title}</h2>
      {sub && <p className={k.sub}>{sub}</p>}
    </Reveal>
  )
}

export function Marquee({ label, names }: { label: string; names: string[] }) {
  const row = [...names, ...names]
  return (
    <div className={k.marquee}>
      <span className={k.marqueeLabel}>{label}</span>
      <div className={k.marqueeTrack} aria-label={names.join(', ')}>
        <div className={k.marqueeRow}>{row.map((n, i) => <span key={i} className={k.logo} data-v={i % 4}>{n}</span>)}</div>
      </div>
    </div>
  )
}

export function Window({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`${k.window} ${className}`}>
      <div className={k.windowBar}><i /><i /><i /><span>{title}</span></div>
      <div className={k.windowBody}>{children}</div>
    </div>
  )
}

export type Quote = { text: string; name: string; role: string }
export function Quotes({ items }: { items: Quote[] }) {
  return (
    <div className={k.quotes}>
      {items.map((q, i) => (
        <Reveal key={q.name} delay={i * 60} as="article" className={k.quote}>
          <p>“{q.text}”</p>
          <footer>
            <span className={k.avatar} data-v={i % 5}>{q.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}</span>
            <span><b>{q.name}</b><small>{q.role}</small></span>
          </footer>
        </Reveal>
      ))}
    </div>
  )
}

export type Plan = { name: string; price: string; per?: string; blurb: string; features: string[]; featured?: boolean; cta: string }
export function Pricing({ plans }: { plans: Plan[] }) {
  return (
    <div className={k.plans}>
      {plans.map((p, i) => (
        <Reveal key={p.name} delay={i * 80} className={`${k.plan} ${p.featured ? k.planFeatured : ''}`}>
          {p.featured && <span className={k.planBadge}>Most popular</span>}
          <h3>{p.name}</h3>
          <p className={k.planBlurb}>{p.blurb}</p>
          <p className={k.planPrice}><b>{p.price}</b>{p.per && <span>{p.per}</span>}</p>
          <button type="button" className={p.featured ? k.btnPrimary : k.btnGhost}>{p.cta}</button>
          <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
        </Reveal>
      ))}
    </div>
  )
}

export function Faq({ items }: { items: [string, string][] }) {
  return (
    <div className={k.faq}>
      {items.map(([q, a]) => <details key={q}><summary>{q}<i aria-hidden /></summary><p>{a}</p></details>)}
    </div>
  )
}

export function Closing({ video, poster, title, sub, cta }: { video: string; poster: string; title: React.ReactNode; sub: string; cta: string }) {
  return (
    <HeroVideo src={video} poster={poster} className={k.closing} scrim="var(--closing-scrim)">
      <Reveal className={k.closingInner}>
        <h2 className={k.closingTitle}>{title}</h2>
        <p>{sub}</p>
        <Buttons primary={cta} />
      </Reveal>
    </HeroVideo>
  )
}

export function Footer({ brand, cols }: { brand: React.ReactNode; cols: [string, string[]][] }) {
  return (
    <footer className={k.footer}>
      <div className={k.footerTop}>
        <div className={k.footerBrand}><span className={k.brand}>{brand}</span><p>A fictional startup from Lander Library. Every button here is a demo.</p></div>
        {cols.map(([h, items]) => <div key={h} className={k.footerCol}><b>{h}</b>{items.map((x) => <span key={x}>{x}</span>)}</div>)}
      </div>
      <div className={k.footerBottom}><span>© 2026 · Demo lander</span><span>Made with Claude Code + Higgsfield</span></div>
    </footer>
  )
}
