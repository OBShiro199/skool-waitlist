'use client'

import { useEffect, useRef } from 'react'

const RAMP = ' ..··::-=+'

/** Drifting ASCII revenue waves behind the hero. Decorative only. */
export function AsciiField({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const cell = 14
    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    let last = 0

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = `400 ${cell - 3}px ui-monospace, SFMono-Regular, Menlo, monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      const cols = Math.ceil(w / cell)
      const rows = Math.ceil(h / cell)
      const time = t / 1000
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const nx = x / cols
          const ny = y / rows
          const v =
            Math.sin(nx * 9 + time * 0.9) * 0.5 +
            Math.sin((nx + ny) * 6 - time * 0.6) * 0.35 +
            Math.cos(ny * 11 + time * 0.4) * 0.25
          const n = (v + 1.1) / 2.2
          // fade towards the centre so the headline stays clean
          const dx = nx - 0.5
          const dy = ny - 0.42
          const edge = Math.min(1, Math.sqrt(dx * dx * 2.2 + dy * dy * 3.2) * 1.6)
          const level = n * edge
          if (level < 0.36) continue
          const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(level * RAMP.length))]
          ctx.fillStyle = `rgba(138,143,152,${(level * 0.42).toFixed(2)})`
          ctx.fillText(ch, x * cell + cell / 2, y * cell + cell / 2)
        }
      }
    }

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      if (!visible || t - last < 50) return
      last = t
      draw(t)
    }

    resize()
    if (reduce) draw(0)
    else raf = requestAnimationFrame(loop)
    const ro = new ResizeObserver(() => {
      resize()
      if (reduce) draw(0)
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none ${className}`}
      // soft fade at the bottom and sides so the field never ends on a hard line
      style={{
        maskImage: 'linear-gradient(to bottom, #000 0%, #000 45%, transparent 92%), linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
        maskComposite: 'intersect',
        WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 45%, transparent 92%), linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
        WebkitMaskComposite: 'source-in',
      }}
    />
  )
}
