import 'server-only'
import { Resend } from 'resend'
import { offer } from '@/content/offer'
import { confirmationHtml, confirmationSubject, confirmationText } from '@/emails/confirmation'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
// Sent from the subdomain verified in Resend; replies go to the main address.
const from = process.env.EMAIL_FROM ?? 'Olly <olly@waitlist.buildsoftwaresolo.com>'

export async function sendConfirmation(email: string) {
  const text = confirmationText()
  if (!resend) {
    console.log(`\n[email:dev] to ${email}\nSubject: ${confirmationSubject}\n\n${text}\n`)
    return
  }
  const { error } = await resend.emails.send({
    from,
    to: email,
    replyTo: offer.contactEmail,
    subject: confirmationSubject,
    text,
    html: confirmationHtml(),
  })
  if (error) throw new Error(error.message)
  if (process.env.RESEND_AUDIENCE_ID) {
    await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID, unsubscribed: false })
  }
}

const notifyTo = process.env.NOTIFY_EMAIL ?? 'oburt5669@gmail.com'

/** Tells Olly about each new signup. */
export async function notifyOwner(s: { email: string; location: string; ref?: string | null; source?: string | null; campaign?: string | null; country?: string | null; total: number | null }) {
  const lines = [
    `Email: ${s.email}`,
    `Form: ${s.location}`,
    `Source: ${s.ref || s.source || 'direct'}${s.campaign ? ` (${s.campaign})` : ''}`,
    s.country ? `Country: ${s.country}` : null,
    s.total ? `Total on the waitlist: ${s.total}` : null,
    '',
    'See everyone: https://buildsoftwaresolo.com/waitlist',
  ].filter((l) => l !== null)
  const text = lines.join('\n')
  if (!resend) {
    console.log(`\n[email:dev] to ${notifyTo}\nSubject: New waitlist signup\n\n${text}\n`)
    return
  }
  const { error } = await resend.emails.send({
    from,
    to: notifyTo,
    subject: `New waitlist signup${s.total ? ` (#${s.total})` : ''}: ${s.email}`,
    text,
  })
  if (error) throw new Error(error.message)
}
