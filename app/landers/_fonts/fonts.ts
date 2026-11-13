import localFont from 'next/font/local'

// Lander fonts, kept in the repo so the build never has to fetch them from Google
// (a failed fetch on Vercel broke a deploy). All are SIL Open Font License Google Fonts, latin subset.

export const newsreader = localFont({
  src: [
    { path: './newsreader-300-italic.woff2', weight: '300', style: 'italic' },
    { path: './newsreader-400-italic.woff2', weight: '400', style: 'italic' },
    { path: './newsreader-300.woff2', weight: '300', style: 'normal' },
    { path: './newsreader-400.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--ph-display',
  display: 'swap',
})

export const ibmPlexSans = localFont({
  src: [
    { path: './ibm-plex-sans-300.woff2', weight: '300', style: 'normal' },
    { path: './ibm-plex-sans-400.woff2', weight: '400', style: 'normal' },
    { path: './ibm-plex-sans-500.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--ph-body',
  display: 'swap',
})

export const youngSerif = localFont({
  src: [
    { path: './young-serif-400.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--pb-display',
  display: 'swap',
})

export const figtree = localFont({
  src: [
    { path: './figtree-400.woff2', weight: '400', style: 'normal' },
    { path: './figtree-500.woff2', weight: '500', style: 'normal' },
    { path: './figtree-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--pb-body',
  display: 'swap',
})

export const cormorant = localFont({
  src: [
    { path: './cormorant-garamond-400-italic.woff2', weight: '400', style: 'italic' },
    { path: './cormorant-garamond-500-italic.woff2', weight: '500', style: 'italic' },
    { path: './cormorant-garamond-400.woff2', weight: '400', style: 'normal' },
    { path: './cormorant-garamond-500.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--sm-display',
  display: 'swap',
})

export const karla = localFont({
  src: [
    { path: './karla-400.woff2', weight: '400', style: 'normal' },
    { path: './karla-500.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--sm-body',
  display: 'swap',
})

export const caslon = localFont({
  src: [
    { path: './libre-caslon-display-400.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--fw-display',
  display: 'swap',
})

export const hanken = localFont({
  src: [
    { path: './hanken-grotesk-400.woff2', weight: '400', style: 'normal' },
    { path: './hanken-grotesk-500.woff2', weight: '500', style: 'normal' },
    { path: './hanken-grotesk-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--fw-body',
  display: 'swap',
})

export const spectral = localFont({
  src: [
    { path: './spectral-300-italic.woff2', weight: '300', style: 'italic' },
    { path: './spectral-400-italic.woff2', weight: '400', style: 'italic' },
    { path: './spectral-300.woff2', weight: '300', style: 'normal' },
    { path: './spectral-400.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--pw-display',
  display: 'swap',
})

export const publicSans = localFont({
  src: [
    { path: './public-sans-400.woff2', weight: '400', style: 'normal' },
    { path: './public-sans-500.woff2', weight: '500', style: 'normal' },
    { path: './public-sans-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--pw-body',
  display: 'swap',
})

export const archivo = localFont({
  src: [
    { path: './archivo-500.woff2', weight: '500', style: 'normal' },
    { path: './archivo-800.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--sp-display',
  display: 'swap',
})

export const archivoNarrow = localFont({
  src: [
    { path: './archivo-narrow-400.woff2', weight: '400', style: 'normal' },
    { path: './archivo-narrow-500.woff2', weight: '500', style: 'normal' },
    { path: './archivo-narrow-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--sp-body',
  display: 'swap',
})

// Redesign: product-grade UI faces and display faces
export const inter = localFont({
  src: [
    { path: './inter-400.woff2', weight: '400', style: 'normal' },
    { path: './inter-500.woff2', weight: '500', style: 'normal' },
    { path: './inter-600.woff2', weight: '600', style: 'normal' },
    { path: './inter-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--f-inter',
  display: 'swap',
})

export const interTight = localFont({
  src: [
    { path: './inter-tight-500.woff2', weight: '500', style: 'normal' },
    { path: './inter-tight-600.woff2', weight: '600', style: 'normal' },
    { path: './inter-tight-700.woff2', weight: '700', style: 'normal' },
    { path: './inter-tight-500-italic.woff2', weight: '500', style: 'italic' },
  ],
  variable: '--f-inter-tight',
  display: 'swap',
})

export const instrumentSerif = localFont({
  src: [
    { path: './instrument-serif-400.woff2', weight: '400', style: 'normal' },
    { path: './instrument-serif-400-italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--f-instrument',
  display: 'swap',
})

export const fraunces = localFont({
  src: [
    { path: './fraunces-500.woff2', weight: '500', style: 'normal' },
    { path: './fraunces-600.woff2', weight: '600', style: 'normal' },
    { path: './fraunces-500-italic.woff2', weight: '500', style: 'italic' },
    { path: './fraunces-600-italic.woff2', weight: '600', style: 'italic' },
  ],
  variable: '--f-fraunces',
  display: 'swap',
})
