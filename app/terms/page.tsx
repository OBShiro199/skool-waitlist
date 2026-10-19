import { LegalPage } from '@/components/sections/LegalPage'
import { offer } from '@/content/offer'

export const metadata = { title: `Terms · ${offer.name}` }

export default function Terms() {
  return (
    <LegalPage title="Terms">
      <p>Joining the waitlist is free and doesn&apos;t commit you to anything. You can unsubscribe at any time.</p>
      <h2>Membership</h2>
      <p>
        The membership itself is sold and run on Skool, under Skool&apos;s terms. Founding members keep the founding price for as long as
        their membership stays active.
      </p>
      <h2>Refunds</h2>
      <p>
        If the community isn&apos;t worth far more than you paid, message {offer.host} within 30 days of joining for a full refund.
      </p>
      <h2>Contact</h2>
      <p>
        <a className="underline" href={`mailto:${offer.contactEmail}`}>{offer.contactEmail}</a>
      </p>
    </LegalPage>
  )
}
