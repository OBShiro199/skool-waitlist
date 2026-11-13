'use client'
import { useState } from 'react'

/** Every call to action on a lander: a fictional startup, so it only says so. */
export function DemoButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const [said, setSaid] = useState(false)
  return (
    <button type="button" className={className} onClick={() => { setSaid(true); setTimeout(() => setSaid(false), 1800) }}>
      {said ? 'Demo lander' : children}
    </button>
  )
}
