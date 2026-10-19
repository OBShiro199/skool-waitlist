export type Phase = 'waitlist' | 'open' | 'closed'

/** Every price, date and count on the page comes from here. */
export const offer = {
  name: 'Build a Profitable $10K p/m App',
  shortName: '$10K p/m App',
  host: 'Olly',
  skoolUrl: 'https://www.skool.com/build-profitable-software',
  youtubeUrl: 'https://www.youtube.com/@OBRosewell',
  contactEmail: 'olly@buildsoftwaresolo.com',
  /** Not announced yet. While null, no date or countdown appears anywhere. */
  doorsOpenAt: null as string | null,
  foundingDays: 7,
  foundingSeats: 100,
  foundingPrice: 397,
  monthlyPrice: 97,
  annualPrice: 776,
  leadExportsPerMonth: 5000,
  callTime: '5pm UK',
  callLength: '1 hour',
  products: 5,
  clients: 500,
} as const

export const foundingSaving = offer.annualPrice - offer.foundingPrice
export const foundingPerMonth = Math.round(offer.foundingPrice / 12)

export const usd = (n: number) => `$${n.toLocaleString('en-US')}`

export const included = [
  { title: 'Watch me build a SaaS to $10K/month', detail: 'every cold email, call, sales call, ad and churn save, as it happens' },
  { title: 'Daily live calls with me', detail: `Monday to Friday, ${offer.callTime}, ${offer.callLength}, recorded` },
  { title: 'Unlimited Q&A', detail: 'every post answered within 24 hours, 7 days a week' },
  { title: 'Private DM support with me', detail: 'your first 30 days' },
  { title: '40-lesson course', detail: 'from idea to first customers to exit' },
  { title: '10M+ verified B2B leads', detail: `export up to ${offer.leadExportsPerMonth.toLocaleString('en-US')} records a month` },
  { title: '20 profitable apps ready to clone', detail: 'each with a launch template' },
  { title: '7 deep-dive tool guides', detail: 'Claude Code, Stripe, Supabase and more' },
  { title: 'Founding bonuses', detail: 'my real codebases, Claude skills and script packs', founding: true },
] as const
