# skool-waitlist

The one-page waitlist for **Build a Profitable $10K p/m App**, served at [buildsoftwaresolo.com](https://buildsoftwaresolo.com).

- [docs/PRD.md](docs/PRD.md): what the page is, section by section
- [docs/quiet-precision-design-system.md](docs/quiet-precision-design-system.md): the design system it follows

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

No keys needed locally. Without Supabase and Resend settings, signups are saved to `.data/waitlist.json` and the confirmation email is printed in the terminal.

Preview the other launch phases with `http://localhost:3000/?phase=open` and `?phase=closed`.

## Change the offer

Every price, date and count lives in `content/offer.ts`. Lessons are in `content/curriculum.ts`, comments in `content/reviews.ts`, questions in `content/faq.ts`.

When the launch date is decided, set `doorsOpenAt` in `content/offer.ts`. To open the doors, set `SITE_PHASE=open` in Vercel (then `closed` after the founding week).

## Go live

1. Create a Supabase project and run `supabase/migrations/20261019000000_waitlist_signups.sql`.
2. Verify `buildsoftwaresolo.com` in Resend and create an audience.
3. Import the repo into Vercel, add the variables from `.env.example`, and point the domain at it.

Stack: Next.js, Tailwind CSS, Supabase, Resend, Vercel.
