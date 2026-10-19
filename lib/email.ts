import 'server-only'
import { Resend } from 'resend'
import { offer, usd } from '@/content/offer'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const from = process.env.EMAIL_FROM ?? `Olly <${offer.contactEmail}>`

const text = `You're on the waitlist for ${offer.name}.

Founding members pay ${usd(offer.foundingMonthly)}/month (or ${usd(offer.foundingAnnual)}/year) instead of ${usd(offer.monthlyPrice)}/month, and keep that price for as long as they stay. There are only ${offer.foundingSeats} founding spots, for ${offer.foundingDays} days. I'll email you before doors open and again the moment they do.

Until then, hit reply and tell me what you're building (or want to build). I read every one.

${offer.host}`

const html = text
  .split('\n\n')
  .map((p) => `<p style="margin:0 0 16px;font:15px/24px -apple-system,Segoe UI,sans-serif;color:#3c4149">${p}</p>`)
  .join('')

export async function sendConfirmation(email: string) {
  if (!resend) {
    console.log(`\n[email:dev] to ${email}\nSubject: You're on the list\n\n${text}\n`)
    return
  }
  const { error } = await resend.emails.send({ from, to: email, replyTo: offer.contactEmail, subject: "You're on the list", text, html })
  if (error) throw new Error(error.message)
  if (process.env.RESEND_AUDIENCE_ID) {
    await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID, unsubscribed: false })
  }
}
