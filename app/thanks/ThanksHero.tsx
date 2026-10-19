'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, BookOpen, Clapperboard, Check } from 'lucide-react'
import { confetti } from '@/lib/confetti'

const freebies = [
  {
    href: 'https://docs.google.com/document/d/1gXQ7vXX5XP_3CqRojcBrA26pWclcNCX4uBfNd5Knmrk/edit?tab=t.0',
    icon: BookOpen,
    title: 'The Free 100-page SaaS Playbook',
    body: 'Everything from idea to first customers, in one document.',
  },
  {
    href: 'https://claude.ai/artifact/LnDi2CTQNDhu67D3YorJBt#ec0ca4c8-0ba6',
    icon: Clapperboard,
    title: 'The Reel Farm code prompt',
    body: 'Paste it into Claude Code and build your own reel farm.',
  },
]

export function ThanksHero() {
  const [joined, setJoined] = useState<{ token: string | null; exists: boolean } | null>(null)

  useEffect(() => {
    let j: { token: string | null; exists: boolean; at: number } | null = null
    try {
      j = JSON.parse(sessionStorage.getItem('joined') ?? 'null')
    } catch {}
    if (!j) return
    setJoined(j)
    // celebrate once, right after joining
    if (!j.exists && Date.now() - j.at < 15000) {
      setTimeout(() => confetti(innerWidth / 2, innerHeight * 0.35), 150)
      // DataFast conversion: once per signup, never on refresh or a return visit
      const w = window as unknown as { datafast?: (goal: string) => void }
      w.datafast?.('waitlist_signup')
      try {
        sessionStorage.setItem('joined', JSON.stringify({ ...j, at: 0 }))
      } catch {}
    }
  }, [])

  return (
    <section className="px-4 py-16 text-center md:px-8 md:py-24">
      <p className="inline-flex items-center gap-2 text-13 font-medium text-success">
        <Check size={16} strokeWidth={2} aria-hidden /> {joined?.exists ? 'Already on the list' : 'Confirmed'}
      </p>
      <h1 className="mt-4 text-32 md:text-48">You&apos;re in.</h1>
      <p className="mx-auto mt-4 max-w-[52ch] text-16 text-body">
        Check your emails: a confirmation from Olly is on its way. You&apos;ll hear first when doors open, at the founding price.
      </p>
      <p className="mt-2 text-13 text-faint">Not there in a minute? Check your promotions or spam folder.</p>

      <div className="mx-auto mt-12 max-w-[640px] text-left">
        <p className="text-13 text-faint">While you wait, two free things from me</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {freebies.map(({ href, icon: Icon, title, body }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="laser laser-slow group flex flex-col gap-3 rounded-box border border-hairline bg-surface p-5 transition-colors hover:bg-row-hover"
            >
              <span className="flex items-center justify-between">
                <Icon size={18} strokeWidth={1.5} className="text-blue" aria-hidden />
                <ArrowUpRight size={16} strokeWidth={1.5} className="text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </span>
              <span>
                <span className="block text-16 font-medium text-ink">{title}</span>
                <span className="mt-1 block text-13 text-muted">{body}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
