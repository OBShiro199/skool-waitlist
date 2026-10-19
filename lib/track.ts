import { track as vercelTrack } from '@vercel/analytics'

type Props = Record<string, string | number | boolean | null>
export function track(event: string, props?: Props) {
  try {
    vercelTrack(event, props)
  } catch {}
}
