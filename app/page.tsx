import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { Numbers } from '@/components/sections/Numbers'
import { Inside } from '@/components/sections/Inside'
import { CtaBand } from '@/components/sections/CtaBand'
import { Curriculum } from '@/components/sections/Curriculum'
import { Wall } from '@/components/sections/Wall'
import { Pricing } from '@/components/sections/Pricing'
import { Faq } from '@/components/sections/Faq'
import { FinalCta, StillDeciding } from '@/components/sections/Closing'
import { Footer } from '@/components/sections/Footer'
import { MobileBar } from '@/components/sections/MobileBar'
import { faq } from '@/content/faq'
import { offer, usd } from '@/content/offer'

export const dynamic = 'force-static'
export const revalidate = 3600

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'Organization', name: offer.name, url: 'https://buildsoftwaresolo.com', sameAs: [offer.youtubeUrl, offer.skoolUrl] },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  },
]

export default function Page() {
  return (
    <>
      <Header />
      <main id="main" className="rail">
        <Hero />
        <Numbers />
        <Inside />
        <CtaBand label="Don't miss the doors" title={`Waitlist members get in first, at ${usd(offer.foundingMonthly)}/month.`} location="inside" />
        <Curriculum />
        <Pricing />
        <Faq />
        <Wall />
        <StillDeciding />
        <FinalCta />
        <Footer />
      </main>
      <MobileBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}
