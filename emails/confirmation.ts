import { offer, usd } from '@/content/offer'

const SITE = 'https://buildsoftwaresolo.com'

// Quiet Precision, inlined for email clients: white surface, hairlines, ink text, one pastel blue.
const c = {
  ink: '#08090a',
  body: '#3c4149',
  muted: '#62666d',
  faint: '#8a8f98',
  hairline: '#e6e6e9',
  divider: '#efeff1',
  blue: '#5f86e0',
  blueSoft: '#f1f5fd',
  blueEdge: '#c4d4f5',
  success: '#27a644',
}
const font = "Geist, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

const bullets = [
  'Get your first 10 paying customers or your money back',
  `${offer.leadsLabel} verified B2B leads`,
  '40-lesson course, from idea to first customers to exit',
  `Daily live calls with me, Monday to Friday at ${offer.callTime}`,
  'Watch me build my next SaaS to $10K/month, live',
]

export const confirmationSubject = "You're on the list"

export function confirmationText() {
  return `You're on the waitlist for ${offer.name}.

Founding members pay ${usd(offer.foundingMonthly)}/month (or ${usd(offer.foundingAnnual)}/year) instead of ${usd(offer.monthlyPrice)}/month, and keep that price for as long as they stay. There are only ${offer.foundingSeats} founding spots. I'll email you before doors open and again the moment they do.

What you get:
${bullets.map((b) => `- ${b}`).join('\n')}

Until then, hit reply and tell me what you're building (or want to build). I read every one.

${offer.host}

You're getting this because you joined the waitlist at buildsoftwaresolo.com. Not for you? Reply "unsubscribe" and I'll take you off.`
}

export function confirmationHtml() {
  const check = `<span style="display:inline-block;width:16px;color:${c.success};font-weight:600">&#10003;</span>`
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>${confirmationSubject}</title>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#ffffff;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">Founding price ${usd(offer.foundingMonthly)}/month, locked for as long as you stay. I'll email you before doors open.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;font-family:${font};">

  <tr><td style="padding:0 0 20px;font-size:14px;font-weight:500;color:${c.ink};letter-spacing:-0.011em;">
    <span style="color:${c.blue};">&#9679;</span>&nbsp; ${offer.name}
  </td></tr>

  <tr><td style="border:1px solid ${c.hairline};padding:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="padding:28px 28px 8px;">
      <p style="margin:0;font-size:13px;line-height:18px;color:${c.success};font-weight:500;">&#10003;&nbsp; Confirmed</p>
      <h1 style="margin:8px 0 0;font-size:32px;line-height:1.12;letter-spacing:-0.035em;font-weight:500;color:${c.ink};">You&rsquo;re on the list.</h1>
      <p style="margin:14px 0 0;font-size:16px;line-height:26px;color:${c.body};">
        Thanks for joining the waitlist for ${offer.name}. I&rsquo;ll email you before doors open, and again the moment they do. Waitlist members get in first.
      </p>
    </td></tr>

    <tr><td style="padding:20px 28px 4px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.blueSoft};border:1px solid ${c.blueEdge};border-radius:6px;">
      <tr><td style="padding:16px 18px;">
        <p style="margin:0;font-size:13px;line-height:18px;color:${c.muted};">Your founding price</p>
        <p style="margin:4px 0 0;font-size:24px;line-height:32px;letter-spacing:-0.03em;font-weight:500;color:${c.ink};">
          ${usd(offer.foundingMonthly)}<span style="font-size:14px;color:${c.muted};font-weight:400;"> / month</span>
          <span style="font-size:14px;color:${c.faint};font-weight:400;">&nbsp;or ${usd(offer.foundingAnnual)}/year</span>
        </p>
        <p style="margin:4px 0 0;font-size:13px;line-height:18px;color:${c.muted};">
          <s>${usd(offer.monthlyPrice)}/month</s> after launch &middot; locked for as long as you stay &middot; first ${offer.foundingSeats} only
        </p>
      </td></tr>
      </table>
    </td></tr>

    <tr><td style="padding:24px 28px 0;">
      <p style="margin:0 0 10px;font-size:13px;line-height:18px;color:${c.faint};">What you get when doors open</p>
      ${bullets
        .map(
          (b) =>
            `<p style="margin:0;padding:9px 0;border-top:1px solid ${c.divider};font-size:14px;line-height:22px;color:${c.body};">${check}&nbsp; ${b}</p>`,
        )
        .join('\n      ')}
    </td></tr>

    <tr><td style="padding:24px 28px 28px;">
      <p style="margin:0;font-size:16px;line-height:26px;color:${c.body};">
        Until then, <strong style="color:${c.ink};font-weight:500;">hit reply and tell me what you&rsquo;re building</strong> (or want to build). I read every one.
      </p>
      <p style="margin:16px 0 0;font-size:16px;line-height:26px;color:${c.ink};">${offer.host}</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
      <tr><td style="border:1px solid ${c.ink};border-radius:6px;">
        <a href="${offer.youtubeUrl}" style="display:inline-block;padding:11px 18px;font-size:14px;font-weight:500;color:${c.ink};text-decoration:none;font-family:${font};">Watch my latest videos &rarr;</a>
      </td></tr>
      </table>
    </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:20px 4px 0;font-size:12px;line-height:18px;color:${c.faint};">
    You&rsquo;re getting this because you joined the waitlist at <a href="${SITE}" style="color:${c.faint};">buildsoftwaresolo.com</a>.
    Not for you? Reply &ldquo;unsubscribe&rdquo; and I&rsquo;ll take you off.
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}
