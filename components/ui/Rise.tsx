'use client'

import { useEffect, useRef, useState } from 'react'

/** Children rise once, the first time this region enters view in a session. */
export function Rise({ id, className = '', children, as: Tag = 'div' }: { id: string; className?: string; children: React.ReactNode; as?: 'div' | 'ul' }) {
  const ref = useRef<HTMLElement>(null)
  const [state, setState] = useState<'' | 'in' | 'seen'>('')

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(`rise:${id}`) === '1'
    } catch {}
    if (seen || !('IntersectionObserver' in window)) return setState('seen')
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        setState('in')
        try {
          sessionStorage.setItem(`rise:${id}`, '1')
        } catch {}
        io.disconnect()
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [id])

  return (
    // @ts-expect-error polymorphic ref
    <Tag ref={ref} className={`rise ${state} ${className}`}>
      {children}
    </Tag>
  )
}
