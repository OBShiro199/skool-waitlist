'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import s from './library.module.css'

type Card = { slug: string; name: string; style: string; what: string; video: string; poster: string }
const SKOOL = 'https://www.skool.com/build-profitable-software'
const LOCKED = [
  { name: 'Clone a Software App', what: '20 profitable apps with the full build, stack and launch template.' },
  { name: 'Find Leads', what: 'Millions of verified B2B leads across the UK, EU and US. 5,000 exports a month.' },
  { name: 'Designs', what: '75 design systems measured from the best-looking sites, ready for Claude Code.' },
  { name: 'Dashboard', what: 'Your builds, streak and XP, saved to your account.' },
  { name: 'Community', what: 'Daily calls, Q&A and the live $10K build.' },
]

function Lock() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
}

export function LandersLibrary({ landers }: { landers: Card[] }) {
  const [q, setQ] = useState('')
  const [locked, setLocked] = useState<(typeof LOCKED)[number] | null>(null)
  const list = useMemo(() => {
    const n = q.trim().toLowerCase()
    return landers.filter((l) => !n || `${l.name} ${l.style}`.toLowerCase().includes(n))
  }, [q, landers])
  return (
    <div className={s.shell}>
      <aside className={s.rail}>
        <div className={s.brand}><b>Build Software Solo</b><span>Members area</span></div>
        <nav className={s.nav}>
          <span className={`${s.navItem} ${s.active}`}>Lander Library</span>
          {LOCKED.map((t) => (
            <button key={t.name} type="button" className={`${s.navItem} ${s.lockedItem}`} onClick={() => setLocked(t)}>
              <span>{t.name}</span><Lock />
            </button>
          ))}
        </nav>
        <a className={s.join} href={SKOOL} target="_blank" rel="noopener noreferrer">Unlock everything on Skool</a>
      </aside>

      <section className={s.main}>
        <header className={s.head}>
          <span className={s.kicker}>Lander Library</span>
          <h1>Landing pages with hero videos you can clone.</h1>
          <p>Every hero was made with the Higgsfield MCP inside Claude Code. Open one, then hit “Clone this lander” for the prompt, the hero prompts and the files.</p>
          <input className={s.search} placeholder="Search by name or style: claymation, watercolour…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search landers" />
        </header>
        <div className={s.grid}>
          {list.map((l) => (
            <Link key={l.slug} href={`/landers/${l.slug}`} className={s.card}>
              <div className={s.media}>
                <video poster={l.poster} autoPlay muted loop playsInline preload="metadata" aria-hidden>
                  <source src={l.video} type="video/mp4" />
                  <source src={l.video.replace(/\.mp4$/, '.webm')} type="video/webm" />
                </video>
              </div>
              <div className={s.meta}>
                <div className={s.row}><b>{l.name}</b><span className={s.tag}>{l.style}</span></div>
                <p>{l.what}</p>
              </div>
            </Link>
          ))}
          {!list.length && <p className={s.empty}>No landers match “{q}”.</p>}
        </div>
      </section>

      {locked && (
        <div className={s.modalWrap} onClick={() => setLocked(null)}>
          <div className={s.modal} role="dialog" aria-modal="true" aria-label={`${locked.name} is locked`} onClick={(e) => e.stopPropagation()}>
            <span className={s.lockBadge}><Lock /> Members only</span>
            <h2>{locked.name}</h2>
            <p>{locked.what}</p>
            <p className={s.muted}>It unlocks when you join the Build Software Solo community on Skool.</p>
            <div className={s.modalActions}>
              <a className={s.primary} href={SKOOL} target="_blank" rel="noopener noreferrer">Join on Skool</a>
              <button type="button" className={s.secondary} onClick={() => setLocked(null)}>Back to the library</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
