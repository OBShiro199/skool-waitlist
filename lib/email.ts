import 'server-only'
import { Resend } from 'resend'
import { offer } from '@/content/offer'
import { confirmationHtml, confirmationSubject, confirmationText } from '@/emails/confirmation'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const from = process.env.EMAIL_FROM ?? `Olly <${offer.contactEmail}>`

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
