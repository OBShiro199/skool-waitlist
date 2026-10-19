'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { hashIp, insertSignup, markConfirmationSent, recentFromIp, signId, updateProfile, verifyToken } from '@/lib/store'
import { sendConfirmation } from '@/lib/email'

export type JoinStatus = 'ok' | 'exists' | 'invalid' | 'rate_limited' | 'error'
export type JoinResult = { status: JoinStatus; token?: string }

const attribution = z.string().trim().max(200).optional().nullable()
const JoinInput = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  location: z.string().max(40),
  company: z.string().optional(),
  renderedAt: z.number(),
  ref: attribution,
  utm_source: attribution,
  utm_medium: attribution,
  utm_campaign: attribution,
  utm_content: attribution,
  utm_term: attribution,
  referrer: z.string().trim().max(500).optional().nullable(),
})
export type JoinInput = z.input<typeof JoinInput>

export async function join(input: JoinInput): Promise<JoinResult> {
  const parsed = JoinInput.safeParse(input)
  if (!parsed.success) return { status: 'invalid' }
  const d = parsed.data

  // bots: honeypot filled or submitted faster than a person can type
  if (d.company || Date.now() - d.renderedAt < 1500) return { status: 'ok' }

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || '0.0.0.0'
  const ipHash = hashIp(ip)

  try {
    if ((await recentFromIp(ipHash, 10)) >= 5) return { status: 'rate_limited' }

    const id = await insertSignup({
      email: d.email,
      form_location: d.location,
      ref: d.ref ?? null,
      utm_source: d.utm_source ?? null,
      utm_medium: d.utm_medium ?? null,
      utm_campaign: d.utm_campaign ?? null,
      utm_content: d.utm_content ?? null,
      utm_term: d.utm_term ?? null,
      referrer: d.referrer ?? null,
      country: h.get('x-vercel-ip-country'),
      ip_hash: ipHash,
      user_agent: h.get('user-agent')?.slice(0, 300) ?? null,
    })
    if (!id) return { status: 'exists' }

    // the row is the source of truth; a failed email must not fail the signup
    try {
      await sendConfirmation(d.email)
      await markConfirmationSent(id)
    } catch (e) {
      console.error('confirmation email failed', e)
    }
    return { status: 'ok', token: signId(id) }
  } catch (e) {
    console.error('join failed', e)
    return { status: 'error' }
  }
}

const ProfileInput = z.object({
  token: z.string().max(200),
  first_name: z.string().trim().max(80).optional().nullable(),
  stage: z.enum(['idea', 'building', 'launched']).optional().nullable(),
})

export async function saveProfile(input: z.input<typeof ProfileInput>): Promise<{ ok: boolean }> {
  const parsed = ProfileInput.safeParse(input)
  if (!parsed.success) return { ok: false }
  const id = verifyToken(parsed.data.token)
  if (!id) return { ok: false }
  try {
    await updateProfile(id, { first_name: parsed.data.first_name || null, stage: parsed.data.stage ?? null })
    return { ok: true }
  } catch (e) {
    console.error('profile failed', e)
    return { ok: false }
  }
}
