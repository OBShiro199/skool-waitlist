import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lander Library',
  description: 'Cloneable landing pages with Higgsfield hero videos, for Build Software Solo members.',
  robots: { index: false, follow: false },
}

export default function LandersLayout({ children }: { children: React.ReactNode }) {
  return <main id="main">{children}</main>
}
