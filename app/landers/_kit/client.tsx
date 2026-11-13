'use client'
import { useEffect, useRef, useState } from 'react'
import k from './kit.module.css'

/** Sticky nav: transparent over the hero, solid once you scroll. */
export function Nav({ brand, links, cta }: { brand: React.ReactNode; links: string[]; cta: string }) {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const on = () => setSolid(scrollY > 40)
    on(); addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  return (
    <header className={`${k.nav} ${solid ? k.navSolid : ''}`}>
      <div className={k.navInner}>
        <span className={k.brand}>{brand}</span>
        <nav className={k.navLinks}>{links.map((l) => <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}>{l}</a>)}</nav>
        <button type="button" className={k.navCta}>{cta}</button>
      </div>
    </header>
  )
}

/** Fades and rises its children in when they scroll into view. */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }: { children: React.ReactNode; delay?: number; className?: string; as?: 'div' | 'section' | 'li' | 'article' }) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setIn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIn(true); io.disconnect() } }, { rootMargin: '0px 0px -10% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <Tag ref={ref as never} className={`${k.reveal} ${inView ? k.in : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</Tag>
}

/** Counts up to a number once it scrolls into view. */
export function CountUp({ to, decimals = 0, prefix = '', suffix = '' }: { to: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [v, setV] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setV(to)
      const t0 = performance.now(), dur = 1400
      const tick = (t: number) => { const p = Math.min(1, (t - t0) / dur); setV(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick) }
      requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => io.disconnect()
  }, [to])
  return <span ref={ref}>{prefix}{v.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>
}

/** A card whose border and surface light up under the cursor. */
export function Spotlight({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={ref}
      className={`${k.spot} ${className}`}
      onMouseMove={(e) => { const r = ref.current!.getBoundingClientRect(); ref.current!.style.setProperty('--mx', `${e.clientX - r.left}px`); ref.current!.style.setProperty('--my', `${e.clientY - r.top}px`) }}
    >
      {children}
    </div>
  )
}
