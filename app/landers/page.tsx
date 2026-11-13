import { hasLandersSession } from '@/lib/landers/session'
import { LANDERS } from '@/lib/landers/data'
import { LandersLogin } from './LandersLogin'
import { LandersLibrary } from './LandersLibrary'

export const dynamic = 'force-dynamic'

export default async function LandersPage() {
  if (!(await hasLandersSession())) return <LandersLogin />
  const cards = LANDERS.map(({ slug, name, style, what, video, poster }) => ({ slug, name, style, what, video, poster }))
  return <LandersLibrary landers={cards} />
}
