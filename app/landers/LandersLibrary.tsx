'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import s from './library.module.css'
import { HeroPreview } from './HeroPreview'

type Card = { slug: string; name: string; style: string; what: string; video: string; poster: string; fonts: [string, string] }
const SKOOL = 'https://www.skool.com/build-profitable-software'
const LOCKED = [
  { name: 'Clone a Software App', what: '20 profitable apps with the full build, stack and launch template.' },
  { name: 'Find Leads', what: 'Millions of verified B2B leads across the UK, EU and US. 5,000 exports a month.' },
  { name: 'Designs', what: '75 design systems measured from the best-looking sites, ready for Claude Code.' },
  { name: 'Dashboard', what: 'Your builds, streak and XP, saved to your account.' },
  { name: 'Community', what: 'Daily calls, Q&A and the live $10K build.' },
]

function Lock() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
}
function Grid() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
}

export function LandersLibrary({ landers }: { landers: Card[] }) {
  const [q, setQ] = useState('')
  const [style, setStyle] = useState('All')
  const [locked, setLocked] = useState<(typeof LOCKED)[number] | null>(null)
  const styles = useMemo(() => ['All', ...landers.map((l) => l.style)], [landers])
  const list = useMemo(() => {
    const n = q.trim().toLowerCase()
    return landers.filter((l) => (style === 'All' || l.style === style) && (!n || `${l.name} ${l.style} ${l.what}`.toLowerCase().includes(n)))
  }, [q, style, landers])
  return (
    <div className={s.shell}>
      <aside className={s.rail}>
        <div className={s.brand}><i className={s.brandMark} aria-hidden /><div><b>Build Software Solo</b><span>Members area</span></div></div>
        <nav className={s.nav}>
          <span className={s.navLabel}>Open to you</span>
          <span className={`${s.navItem} ${s.active}`}><span className={s.navIcon}><Grid /></span>Lander Library<em>{landers.length}</em></span>
          <span className={s.navLabel}>Members only</span>
          {LOCKED.map((t) => (
            <button key={t.name} type="button" className={`${s.navItem} ${s.lockedItem}`} onClick={() => setLocked(t)}>
              <span className={s.navIcon}><Lock /></span>{t.name}
            </button>
          ))}
        </nav>
        <div className={s.joinCard}>
          <b>Unlock the whole Vault</b>
          <p>Apps to clone, leads, design systems and the live build.</p>
          <a className={s.join} href={SKOOL} target="_blank" rel="noopener noreferrer">Join the community <span aria-hidden>→</span></a>
        </div>
      </aside>

      <section className={s.main}>
        <div className={s.glow} aria-hidden />
        <header className={s.head}>
          <span className={s.kicker}><i aria-hidden />Lander Library · {String(landers.length).padStart(2, '0')} pages</span>
          <h1>Landing pages with <em>cinematic</em> hero videos, ready to clone.</h1>
          <p>Every hero was shot with the Higgsfield MCP inside Claude Code. Open one, then hit <b>Clone this lander</b> for the build prompt, the hero prompts and every file.</p>
          <dl className={s.facts}>
            <div><dt>Hero videos</dt><dd>{landers.length}</dd></div>
            <div><dt>Companion sprites</dt><dd>{landers.length * 5}</dd></div>
            <div><dt>Sections per page</dt><dd>12</dd></div>
          </dl>
        </header>

        <div className={s.toolbar}>
          <div className={s.chips} role="group" aria-label="Filter by style">
            {styles.map((t) => (
              <button key={t} type="button" className={`${s.chip} ${style === t ? s.chipOn : ''}`} aria-pressed={style === t} onClick={() => setStyle(t)}>{t}</button>
            ))}
          </div>
          <label className={s.searchWrap}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input className={s.search} placeholder="Search landers" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search landers" />
          </label>
        </div>

        <div className={s.grid}>
          {list.map((l) => (
            <Link key={l.slug} href={`/landers/${l.slug}`} className={s.card}>
              <div className={s.frame}>
                <HeroPreview slug={l.slug} poster={l.poster} name={l.name} />
                <span className={s.open}>Open lander <span aria-hidden>→</span></span>
              </div>
              <div className={s.meta}>
                <span className={s.index}>{String(landers.indexOf(l) + 1).padStart(2, '0')}</span>
                <div className={s.metaBody}>
                  <div className={s.row}><b>{l.name}</b><span className={s.tag}>{l.style}</span></div>
                  <p>{l.what}</p>
                  <span className={s.fonts}>{l.fonts[0]} <i>/</i> {l.fonts[1]}</span>
                </div>
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
