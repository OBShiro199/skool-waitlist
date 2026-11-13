'use client'
import { useEffect, useRef, useState } from 'react'
import s from './library.module.css'

const W = 1440
const H = 810

/** The lander's real hero, rendered at desktop size and scaled down to fit the card. */
export function HeroPreview({ slug, poster, name }: { slug: string; poster: string; name: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.25)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(() => setScale(el.clientWidth / W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={box} className={s.media}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" className={s.mediaPoster} style={{ opacity: ready ? 0 : 1 }} />
      <iframe
        src={`/landers/${slug}?preview=1`}
        title={`${name} hero preview`}
        loading="lazy"
        tabIndex={-1}
        aria-hidden
        scrolling="no"
        onLoad={() => setReady(true)}
        className={s.mediaFrame}
        style={{ width: W, height: H, transform: `scale(${scale})` }}
      />
    </div>
  )
}
