import 'server-only'

// Fixed-window limiter per key. Per server instance, which is enough to stop runaway clients;
// swap for a shared store if the site ever runs many instances under heavy load.
const windows = new Map<string, { start: number; n: number }>()

export function limited(key: string, max: number, windowMs: number) {
  const now = Date.now()
  const w = windows.get(key)
  if (!w || now - w.start >= windowMs) {
    windows.set(key, { start: now, n: 1 })
    if (windows.size > 10_000) for (const [k, v] of windows) if (now - v.start >= windowMs) windows.delete(k)
    return false
  }
  w.n++
  return w.n > max
}
