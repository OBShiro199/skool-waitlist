import type { Metadata } from 'next'
import { Header } from '@/components/sections/Header'
import { Wall } from '@/components/sections/Wall'
import { Curriculum } from '@/components/sections/Curriculum'
import { Footer } from '@/components/sections/Footer'
import { offer } from '@/content/offer'
import { ThanksHero } from './ThanksHero'

export const metadata: Metadata = { title: `You're in · ${offer.name}`, robots: { index: false, follow: false } }

export default function Thanks() {
  return (
    <>
      <Header />
      <main id="main" className="rail">
        <ThanksHero />
        <Wall />
        <Curriculum />
        <Footer />
      </main>
    </>
  )
}
