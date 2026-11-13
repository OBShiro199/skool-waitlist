import { hasLandersSession } from '@/lib/landers/session'
import { LANDERS } from '@/lib/landers/data'
import { LandersLogin } from './LandersLogin'
import { LandersLibrary } from './LandersLibrary'
import { instrumentSerif } from './_fonts/fonts'

export const dynamic = 'force-dynamic'

export default async function LandersPage() {
  if (!(await hasLandersSession())) return <LandersLogin />
  const cards = LANDERS.map(({ slug, name, style, what, video, poster, fonts }) => ({ slug, name, style, what, video, poster, fonts }))
  return <div className={instrumentSerif.variable}><LandersLibrary landers={cards} /></div>
}
