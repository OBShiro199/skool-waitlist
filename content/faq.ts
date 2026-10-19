import { offer, usd } from './offer'

export const faq = [
  {
    id: 'what',
    q: 'What do I get when doors open?',
    a: 'Everything at once: the live $10K build, daily calls Monday to Friday, unlimited Q&A, private DMs for your first 30 days, the 40-lesson course, 10M+ verified leads, 20 clone-ready apps, 7 tool guides and the founding bonuses.',
  },
  {
    id: 'when',
    q: 'When do doors open, and for how long?',
    a: `Soon. Waitlist members get the date first, by email. Once doors open, the founding price is available for ${offer.foundingDays} days or until ${offer.foundingSeats} people have joined, whichever comes first.`,
  },
  {
    id: 'after',
    q: 'What happens after I join the waitlist?',
    a: 'You get a confirmation email now, an email with the date before doors open, and another the moment they do. Waitlist members hear first, so founding spots go to them first.',
  },
  {
    id: 'code',
    q: 'Do I need to know how to code?',
    a: 'No. You build with Claude Code. If you can describe what you want, Claude can build it, and week 2 shows you exactly how.',
  },
  {
    id: 'calls',
    q: 'How do the daily calls work?',
    a: `A live group call Monday to Friday at ${offer.callTime}, for an hour. Bring your product and your questions. Every call is recorded for anyone who can't make it.`,
  },
  {
    id: 'qa',
    q: 'How quickly are questions answered?',
    a: 'Every post in the community gets an answer within 24 hours, weekends included. Founding members can also message me directly for their first 30 days.',
  },
  {
    id: 'leads',
    q: 'Are the leads actually usable?',
    a: `Yes. They're verified B2B contacts you can filter by industry, job title and location and export to CSV for cold email or calling, up to ${offer.leadExportsPerMonth.toLocaleString('en-US')} verified records a month. Week 3 shows you how to use them.`,
  },
  {
    id: 'price',
    q: 'What does it cost after launch?',
    a: `${usd(offer.monthlyPrice)}/month or ${usd(offer.annualPrice)}/year. Founding members pay ${usd(offer.foundingMonthly)}/month or ${usd(offer.foundingAnnual)}/year and keep that price for as long as they stay.`,
  },
  {
    id: 'cancel',
    q: "Can I cancel? What's the guarantee?",
    a: "Cancel your renewal in one click inside Skool. If it isn't worth far more than you paid, message me within 30 days for a full refund.",
  },
  {
    id: 'beginner',
    q: "Is this for people who haven't started yet?",
    a: 'Yes. Week 1 takes you from no idea to a validated one, and week 2 to a live product that takes payments.',
  },
  {
    id: 'new',
    q: 'How often is new material added?',
    a: 'The live build updates every week, and new lessons, apps and guides are added as I make them.',
  },
  {
    id: 'where',
    q: 'Where does it happen?',
    a: "In a private Skool community. You'll get your invite link by email when you join.",
  },
] as const
