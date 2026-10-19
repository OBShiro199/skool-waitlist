import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { GeistSans } from 'geist/font/sans'
import { Analytics } from '@vercel/analytics/next'
import { SiteProvider } from '@/components/ui/SiteProvider'
import { serverPhase } from '@/lib/phase'
import { offer } from '@/content/offer'
import './globals.css'

const description =
  'Watch a SaaS get built live to $10K/month, then build your own with AI. 40 lessons, daily calls, 10M+ leads. Founding price $49/month for the first 100.'

export const metadata: Metadata = {
  metadataBase: new URL('https://buildsoftwaresolo.com'),
  title: `${offer.name} · Waitlist`,
  description,
  alternates: { canonical: '/' },
  openGraph: { title: offer.name, description, url: '/', siteName: offer.name, type: 'website' },
  twitter: { card: 'summary_large_image', title: offer.name, description },
}

export const viewport: Viewport = { themeColor: '#ffffff', width: 'device-width', initialScale: 1 }

const allowOverride = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ALLOW_PHASE_OVERRIDE === '1'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={GeistSans.variable}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-surface focus:p-2">
          Skip to content
        </a>
        <SiteProvider phase={serverPhase()} allowOverride={allowOverride}>
          {children}
        </SiteProvider>
        <Analytics />
        <Script
          src="https://datafa.st/js/script.js"
          data-website-id="dfid_fFdHARFOxn0u70FcFtZv7"
          data-domain="buildsoftwaresolo.com"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
