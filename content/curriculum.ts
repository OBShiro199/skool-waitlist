export const weeks = [
  {
    n: 1, name: 'Foundations', outcome: 'A validated idea worth building',
    lessons: ['Welcome', 'Founder Mindset', 'SaaS Money Maths', 'Business Models', 'Finding Ideas', 'Validation', 'Pre-Selling', 'Pick Your Idea'],
  },
  {
    n: 2, name: 'Build', outcome: 'A live, secure product that takes payments',
    lessons: ['AI Build Setup', 'Plan Before Prompting', 'Core Feature', 'Auth, Data & Payments', 'Expensive Design', 'Landing Page', 'Security Basics', 'Deploy & Launch'],
  },
  {
    n: 3, name: 'First Customers', outcome: 'Your first 10 paying customers',
    lessons: ['Ideal Customer', 'Lead Lists', 'Cold Email Setup', 'Cold Email Scripts', 'Social Outreach', 'Cold Calling', 'Demos & Closing', 'First 10 Playbook'],
  },
  {
    n: 4, name: 'Growth', outcome: 'Repeatable acquisition beyond manual outreach',
    lessons: ['Pricing', 'Trials & Freemium', 'Content Engine', 'Reel Farms', 'Paid Ads', 'SEO', 'Referrals & Affiliates', 'Metrics & Funnels'],
  },
  {
    n: 5, name: 'Retain & Scale', outcome: 'Keep customers, grow revenue, build an asset',
    lessons: ['Onboarding', 'Customer Support', 'Beating Churn', 'Expansion Revenue', 'Product-Market Fit', 'Solo Founder Finances', 'Automate & Hire', 'Exit Your SaaS'],
  },
] as const

export const guides = [
  'Claude Code in Depth',
  'Stripe for Payments',
  'Supabase for the Backend',
  'Running Your SaaS on Vercel',
  'Background Jobs with Trigger.dev',
  'Resend for Emails',
  'Build Your Own Data API',
] as const
