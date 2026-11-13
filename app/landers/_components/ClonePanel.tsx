'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import s from './shared.module.css'

type Props = { name: string; slug: string; rebuild: string; still: string; motion: string; video: string; poster: string; sprites: string[] }

function Block({ title, text }: { title: string; text: string }) {
  const [done, setDone] = useState(false)
  return (
    <div className={s.block}>
      <div className={s.blockHead}>
        <b>{title}</b>
        <button type="button" className={s.copy} onClick={() => navigator.clipboard.writeText(text).then(() => { setDone(true); setTimeout(() => setDone(false), 1500) })}>
          {done ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className={s.pre}>{text}</pre>
    </div>
  )
}

/** Floating "Clone this lander" button and the side panel with prompts and downloads. */
export function ClonePanel(p: Props) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [])
  return (
    <div className={s.cloneRoot}>
      <div className={s.cloneBar}>
        <Link href="/landers" className={s.cloneBack}>← Library</Link>
        <button type="button" className={s.cloneBtn} onClick={() => setOpen(true)} aria-expanded={open}>Clone this lander</button>
      </div>
      {open && <div className={s.overlay} onClick={() => setOpen(false)} />}
      <aside className={`${s.sheet} ${open ? s.sheetOpen : ''}`} aria-hidden={!open} aria-label={`Clone ${p.name}`}>
        <div className={s.sheetHead}>
          <div><span className={s.kicker}>Clone this lander</span><h2>{p.name}</h2></div>
          <button type="button" className={s.close} onClick={() => setOpen(false)} aria-label="Close">×</button>
        </div>
        <ol className={s.steps}>
          <li>Download the hero video, poster and companions below into your project&apos;s <code>public/heroes</code> and <code>public/companions/{p.slug}</code>.</li>
          <li>Paste the rebuild prompt into Claude Code.</li>
          <li>Want your own hero? Run the still prompt, then the motion prompt, in Higgsfield.</li>
        </ol>
        <Block title="1. Rebuild prompt for Claude Code" text={p.rebuild} />
        <Block title="2. Hero still prompt" text={p.still} />
        <Block title="3. Hero motion prompt" text={p.motion} />
        <div className={s.block}>
          <div className={s.blockHead}><b>4. Downloads</b></div>
          <div className={s.downloads}>
            <a href={p.video} download={`${p.slug}.mp4`}>Hero video (MP4)</a>
            <a href={p.poster} download={`${p.slug}.jpg`}>Poster (JPG)</a>
            {p.sprites.map((x) => <a key={x} href={x} download>{x.split('/').pop()}</a>)}
          </div>
        </div>
      </aside>
    </div>
  )
}
