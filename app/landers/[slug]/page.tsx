import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { hasLandersSession } from '@/lib/landers/session'
import { getLander, LANDERS, rebuildPrompt } from '@/lib/landers/data'
import { ClonePanel } from '../_components/ClonePanel'
import Perihelion from './landers/Perihelion'
import Proofbox from './landers/Proofbox'
import Saltmarsh from './landers/Saltmarsh'
import Foldwell from './landers/Foldwell'
import Paperwing from './landers/Paperwing'
import Smallport from './landers/Smallport'

export const dynamic = 'force-dynamic'

const PAGES = { perihelion: Perihelion, proofbox: Proofbox, saltmarsh: Saltmarsh, foldwell: Foldwell, paperwing: Paperwing, smallport: Smallport } as const

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const l = getLander((await params).slug)
  return { title: l ? `${l.name} · Lander Library` : 'Lander Library', robots: { index: false, follow: false } }
}

export function generateStaticParams() {
  return LANDERS.map((l) => ({ slug: l.slug }))
}

export default async function LanderPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ preview?: string }> }) {
  if (!(await hasLandersSession())) redirect('/landers')
  const { slug } = await params
  const l = getLander(slug)
  const Page = PAGES[slug as keyof typeof PAGES]
  if (!l || !Page) notFound()
  // ?preview=1: the library card shows the real hero in a scaled-down frame, without the clone controls
  if ((await searchParams).preview === '1') return <Page />
  return (
    <>
      <Page />
      <ClonePanel name={l.name} slug={l.slug} rebuild={rebuildPrompt(l)} still={l.stillPrompt} motion={l.motionPrompt} video={l.video} poster={l.poster} sprites={l.sprites} />
    </>
  )
}
