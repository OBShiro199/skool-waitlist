'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Phase } from '@/content/offer'

type Attribution = Record<string, string | null>
type Site = {
  phase: Phase
  joined: boolean
  markJoined: () => void
  attribution: Attribution
}

const SiteContext = createContext<Site | null>(null)
export const useSite = () => {
  const s = useContext(SiteContext)
  if (!s) throw new Error('useSite outside SiteProvider')
  return s
}

const KEYS = ['ref', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

function safeGet(store: 'local' | 'session', key: string) {
  try {
    return (store === 'local' ? localStorage : sessionStorage).getItem(key)
  } catch {
    return null
  }
}
function safeSet(store: 'local' | 'session', key: string, value: string) {
  try {
    ;(store === 'local' ? localStorage : sessionStorage).setItem(key, value)
  } catch {}
}

export function SiteProvider({ phase: initial, allowOverride, children }: { phase: Phase; allowOverride: boolean; children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>(initial)
  const [joined, setJoined] = useState(false)
  const [attribution, setAttribution] = useState<Attribution>({})

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const override = params.get('phase')
    if (allowOverride && (override === 'waitlist' || override === 'open' || override === 'closed')) setPhase(override)

    // first-touch attribution, kept for the session
    let stored: Attribution = {}
    try {
      stored = JSON.parse(safeGet('session', 'attribution') ?? '{}')
    } catch {}
    if (!Object.keys(stored).length) {
      for (const k of KEYS) stored[k] = params.get(k)
      stored.referrer = document.referrer || null
      safeSet('session', 'attribution', JSON.stringify(stored))
    }
    setAttribution(stored)
    if (safeGet('local', 'waitlist-joined') === '1') setJoined(true)
  }, [allowOverride])

  const markJoined = useCallback(() => {
    setJoined(true)
    safeSet('local', 'waitlist-joined', '1')
  }, [])

  return <SiteContext.Provider value={{ phase, joined, markJoined, attribution }}>{children}</SiteContext.Provider>
}
