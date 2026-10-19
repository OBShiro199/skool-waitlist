import { LegalPage } from '@/components/sections/LegalPage'
import { offer } from '@/content/offer'

export const metadata = { title: `Privacy · ${offer.name}` }

export default function Privacy() {
  return (
    <LegalPage title="Privacy">
      <p>This page explains what happens to your details when you join the waitlist for {offer.name}.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Your email address, and your first name and stage if you choose to give them.</li>
        <li>Where you came from (for example which video linked you here) and your approximate country.</li>
        <li>A one-way hash of your IP address, used only to stop spam signups. We never store the address itself.</li>
      </ul>
      <h2>Why</h2>
      <p>To email you about the launch of the community. Nothing else. We never sell or share your details.</p>
      <h2>Who processes it</h2>
      <p>Supabase (database), Resend (email) and Vercel (hosting and cookieless analytics). This site sets no cookies.</p>
      <h2>How long we keep it</h2>
      <p>Until you ask us to delete it, or 12 months after launch if you never join.</p>
      <h2>Your rights</h2>
      <p>
        Under UK GDPR you can ask for a copy of your data, ask us to correct or delete it, or unsubscribe at any time using the link in
        any email. Email <a className="underline" href={`mailto:${offer.contactEmail}`}>{offer.contactEmail}</a>.
      </p>
    </LegalPage>
  )
}
