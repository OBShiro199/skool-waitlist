'use client'

import { useEffect, useRef, useState } from 'react'

const GLYPHS = '#$%*+=-:./<>[]01'

/** Section label that decodes from random ASCII the first time it scrolls into view. */
export function Eyebrow({ idx, children }: { idx: string; children: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [text, setText] = useState(children)

  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (t: number) => {
          const done = Math.floor(((t - start) / 700) * children.length)
          setText(
            [...children]
              .map((c, i) => (i < done || c === ' ' ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
              .join(''),
          )
          if (done < children.length) raf = requestAnimationFrame(tick)
          else setText(children)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [children])

  return (
    <p ref={ref} className="eyebrow">
      <span className="idx">{idx}</span>
      <span aria-hidden>·</span>
      <span aria-label={children}>
        <span aria-hidden>{text}</span>
      </span>
    </p>
  )
}
