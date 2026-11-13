'use client'
import { useEffect, useRef, useState } from 'react'
import s from './shared.module.css'

/**
 * Full-bleed hero background. Autoplays muted and looping; with prefers-reduced-motion it shows the
 * poster and a play button instead. Children (headline, copy, button) sit on top of it.
 */
export function HeroVideo({ src, poster, className, scrim, children }: { src: string; poster: string; className?: string; scrim?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [reduced, setReduced] = useState(false)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    const m = matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      setReduced(m.matches)
      const v = ref.current
      if (!v) return
      if (m.matches) { v.pause(); setPlaying(false) } else v.play().then(() => setPlaying(true)).catch(() => {})
    }
    apply()
    m.addEventListener('change', apply)
    return () => m.removeEventListener('change', apply)
  }, [])
  return (
    <section className={`${s.hero} ${className ?? ''}`}>
      <video
        ref={ref}
        className={s.heroVideo}
        poster={poster}
        autoPlay={!reduced}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={src} type="video/mp4" />
        <source src={src.replace(/\.mp4$/, '.webm')} type="video/webm" />
      </video>
      {scrim && <div className={s.scrim} style={{ background: scrim }} aria-hidden />}
      <div className={s.heroContent}>{children}</div>
      {reduced && !playing && (
        <button type="button" className={s.play} onClick={() => ref.current?.play()} aria-label="Play the background video">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="M3 1.5v11l9.5-5.5z" fill="currentColor" /></svg>
          Play
        </button>
      )}
    </section>
  )
}
