import 'server-only'

// A small in-memory cache shared by every member on a warm server. Lead data changes nightly at
// most, so a few minutes of reuse is invisible to members and turns repeat searches (going back a
// page, switching tabs, two members running the same search) into instant answers.
type Entry<T> = { at: number; value: T }

export function memo<T>(max: number, ttlMs: number) {
  const map = new Map<string, Entry<T>>()
  return {
    get(key: string): T | undefined {
      const e = map.get(key)
      if (!e) return undefined
      if (Date.now() - e.at > ttlMs) {
        map.delete(key)
        return undefined
      }
      map.delete(key) // refresh its place as most recently used
      map.set(key, e)
      return e.value
    },
    set(key: string, value: T) {
      map.delete(key)
      map.set(key, { at: Date.now(), value })
      while (map.size > max) map.delete(map.keys().next().value as string)
    },
  }
}

/** Same filters in any key order give the same cache key. */
export function stableKey(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stableKey).join(',')}]`
  if (v && typeof v === 'object') {
    return `{${Object.keys(v as object)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stableKey((v as Record<string, unknown>)[k])}`)
      .join(',')}}`
  }
  return JSON.stringify(v)
}
