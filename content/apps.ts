export type App = {
  slug: string
  name: string
  category: 'Business Tools' | 'Sales & Outreach' | 'Content & Social' | 'Productivity & Booking' | 'AI Agents'
  from: number
  tagline: string
  description: string
  buildHours: number
  difficulty: 'Intermediate' | 'Advanced'
  stack: string[]
}

/** Thumbnails live in public/apps/<slug>.webp. Apps without one show a typeset card. */
export const appThumbs = new Set(['etcher', 'factorie', 'ethereel', 'conversate', 'outbounder'])

export const apps: App[] = [
  { slug: 'etcher', name: 'Etcher', category: 'Business Tools', from: 149, tagline: 'The CRM your team calls from', description: 'A fast B2B CRM for sales teams of 2 to 20 with pipelines, CSV import and click-to-call from the browser, at one flat price for unlimited seats.', buildHours: 40, difficulty: 'Advanced', stack: ['Twilio Voice'] },
  { slug: 'factorie', name: 'Factorie', category: 'AI Agents', from: 99, tagline: 'See where AI recommends you', description: 'Tracks whether ChatGPT, Perplexity, Gemini, Claude, DeepSeek and Grok recommend your brand for the questions buyers ask, who they name instead, and what to fix.', buildHours: 30, difficulty: 'Advanced', stack: ['OpenRouter', 'Claude API', 'Firecrawl'] },
  { slug: 'ethereel', name: 'Ethereel', category: 'Content & Social', from: 89, tagline: 'Raw clips in, edited reels out', description: 'Upload a raw talking-head clip and get back a captioned reel with zooms, hand-drawn diagrams and music, posted to TikTok and Instagram after you press Pass.', buildHours: 45, difficulty: 'Advanced', stack: ['Trigger.dev', 'Remotion Lambda', 'Groq', 'Claude', 'Zernio'] },
  { slug: 'conversate', name: 'Conversate', category: 'AI Agents', from: 49, tagline: 'Your website, turned into support', description: "An AI help desk that drafts a help centre from a company's website, answers visitors with sources and a confidence score, and hands the rest to a shared inbox.", buildHours: 38, difficulty: 'Advanced', stack: ['Firecrawl', 'Voyage AI', 'Claude API'] },
  { slug: 'outbounder', name: 'Outbounder', category: 'Sales & Outreach', from: 79, tagline: 'Cold email that reads human', description: "Describe your buyer and Outbounder finds verified leads, writes a first line from each company's website and sends from safe inboxes on your own outreach domain.", buildHours: 30, difficulty: 'Advanced', stack: ['Prospeo', 'MillionVerifier', 'Firecrawl', 'Claude', 'AgentMail'] },
  { slug: 'signet', name: 'Signet', category: 'Business Tools', from: 49, tagline: 'Proposals from a sales call', description: 'Upload a discovery call and get a branded proposal with three priced options, view tracking, e-signature and a deposit paid to your own Stripe.', buildHours: 25, difficulty: 'Intermediate', stack: ['AssemblyAI', 'Claude API', 'Stripe Connect', 'Zoom API', 'Google Meet'] },
  { slug: 'folio', name: 'Folio', category: 'Content & Social', from: 39, tagline: 'On-brand carousels in minutes', description: 'Turns blog posts, YouTube videos, ideas and voice notes into on-brand LinkedIn and Instagram carousels, then schedules them.', buildHours: 22, difficulty: 'Intermediate', stack: ['Claude API', 'Firecrawl', 'Supadata', 'Deepgram', 'Zernio'] },
  { slug: 'bookwell', name: 'Bookwell', category: 'Productivity & Booking', from: 19, tagline: 'Bookings, deposits, no no-shows', description: 'Booking pages for barbers, trainers and tutors with Google Calendar sync, deposits and SMS reminders.', buildHours: 20, difficulty: 'Intermediate', stack: ['Google Calendar API', 'Twilio SMS', 'Stripe Connect'] },
  { slug: 'helpdeck', name: 'Helpdeck', category: 'AI Agents', from: 49, tagline: 'AI support trained on your docs', description: "A chat widget that learns a company's website, answers customers with sources, and emails a human when unsure.", buildHours: 18, difficulty: 'Intermediate', stack: ['Firecrawl', 'Claude API', 'Voyage AI'] },
  { slug: 'sparring', name: 'Sparring', category: 'Sales & Outreach', from: 49, tagline: 'Cold call practice that hits back', description: 'Reps cold call a realistic AI prospect in the browser, get scored out of 100 with coaching notes on the exact second, and managers assign drills and watch the leaderboard.', buildHours: 35, difficulty: 'Advanced', stack: ['ElevenLabs Agents', 'Claude API'] },
  { slug: 'marquee', name: 'Marquee', category: 'Content & Social', from: 29, tagline: 'Thumbnails that prove themselves', description: 'Type a video title and get six YouTube thumbnail concepts with your real face cut out, polish one in a canvas editor, then A/B test them on your live video until a winner is proven.', buildHours: 33, difficulty: 'Advanced', stack: ['fal.ai', 'Claude API', 'YouTube APIs'] },
  { slug: 'harvest', name: 'Harvest', category: 'Sales & Outreach', from: 59, tagline: 'Warm leads from LinkedIn posts', description: 'Track the LinkedIn posts and creators you choose, and every morning get the people who engaged who fit your buyer, with role, company, a verified email and an opener about what they reacted to.', buildHours: 32, difficulty: 'Advanced', stack: ['Apify', 'Prospeo', 'MillionVerifier', 'Claude API', 'HubSpot'] },
  { slug: 'echo', name: 'Echo', category: 'Content & Social', from: 29, tagline: 'Every episode, written up and clipped', description: "Upload a podcast episode or connect an RSS feed and get show notes, chapters, quotes, a newsletter, social posts, an SEO blog post and captioned audiograms in the host's own voice.", buildHours: 28, difficulty: 'Advanced', stack: ['AssemblyAI', 'Claude API', 'Remotion Lambda'] },
  { slug: 'halo', name: 'Halo', category: 'AI Agents', from: 49, tagline: 'More Google reviews, fewer surprises', description: 'Texts every customer after their visit with a two-tap way to rate you and post a Google review, alerts you to unhappy customers privately, and drafts replies to new reviews in your voice.', buildHours: 32, difficulty: 'Advanced', stack: ['Twilio SMS', 'Google Business Profile', 'Claude API'] },
  { slug: 'tally', name: 'Tally', category: 'Business Tools', from: 19, tagline: 'Invoices that chase themselves', description: 'Branded invoices sent from your own email domain, with polite, escalating reminders that stop the moment the client pays or replies, and payments straight into your own Stripe.', buildHours: 30, difficulty: 'Advanced', stack: ['Stripe Connect', 'Resend', 'Claude API'] },
  { slug: 'shortlist', name: 'Shortlist', category: 'Business Tools', from: 29, tagline: 'Hiring for teams of ten', description: 'A careers page, an applicant board and quoted AI summaries of every CV against your own criteria, with self-booked interviews and GDPR deletion on autopilot. A person makes every decision.', buildHours: 34, difficulty: 'Advanced', stack: ['Claude API', 'Google Calendar API'] },
  { slug: 'rota', name: 'Rota', category: 'Productivity & Booking', from: 39, tagline: 'Staff rotas built in minutes', description: 'Drag-and-drop weekly rotas with clash and overtime warnings, a Claude-drafted week, shift texts and reminders, swaps on staff phones, geofenced clock-in and a payroll CSV.', buildHours: 38, difficulty: 'Advanced', stack: ['Twilio Messaging', 'Claude API'] },
  { slug: 'dossier', name: 'Dossier', category: 'AI Agents', from: 249, tagline: 'Security questionnaires answered with sources', description: "Upload a buyer's security questionnaire or RFP and get every answer drafted from your own policies, with the source paragraph, a confidence score, a team review flow and the original file exported back filled in.", buildHours: 45, difficulty: 'Advanced', stack: ['Claude API', 'Voyage AI', 'LlamaParse'] },
  { slug: 'quotient', name: 'Quotient', category: 'Productivity & Booking', from: 39, tagline: 'Instant quotes that book the job', description: 'Trades businesses build a quote calculator for their website; customers see an instant price range, add photos and book a survey or the job with a deposit, while Quotient follows up by text and email.', buildHours: 30, difficulty: 'Advanced', stack: ['Claude API', 'Twilio SMS', 'Stripe Connect'] },
  { slug: 'retain', name: 'Retain', category: 'Business Tools', from: 49, tagline: 'Save customers before they cancel', description: 'Connect Stripe and Retain scores every customer for churn risk in plain words, recovers failed payments, runs a cancel flow with save offers, and drafts win-back emails with Claude.', buildHours: 32, difficulty: 'Advanced', stack: ['Stripe Apps', 'Claude API'] },
]

export const categoryHue: Record<App['category'], 'blue' | 'teal' | 'amber' | 'green' | 'rose'> = {
  'Business Tools': 'blue',
  'Sales & Outreach': 'green',
  'Content & Social': 'rose',
  'Productivity & Booking': 'amber',
  'AI Agents': 'teal',
}
