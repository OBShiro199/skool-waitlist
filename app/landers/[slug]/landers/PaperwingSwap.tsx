'use client'
import { useState } from 'react'
import s from './paperwing.module.css'

const OPTIONS = [
  { who: 'FO Marsh', base: 'EGHH', note: 'On standby at base · 4.5h duty left after this leg', cost: '£0 extra', score: 'Best' },
  { who: 'FO Achebe', base: 'EGHH', note: 'Day off, opted in to call-outs · rested 31h', cost: '£180 call-out', score: 'Good' },
  { who: 'FO Lind', base: 'EGLF', note: 'Positioning flight needed · lands 08:20', cost: '£410 incl. positioning', score: 'Fallback' },
]

/** A tiny live demo: a first officer calls in sick and Paperwing offers the legal replacements. */
export function PaperwingSwap() {
  const [state, setState] = useState<'idle' | 'thinking' | 'options' | 'done'>('idle')
  const [picked, setPicked] = useState<string | null>(null)
  const call = () => { setState('thinking'); setTimeout(() => setState('options'), 900) }
  return (
    <div className={s.swap}>
      <div className={s.swapLeg}>
        <span>PW 380 · EGHH → EGJJ · 09:05</span>
        <b>{picked ? `Capt. Okafor · ${picked}` : state === 'idle' ? 'Capt. Okafor · FO Dunne' : 'Capt. Okafor · FO —'}</b>
        <em className={picked ? s.ok : state === 'idle' ? s.ok : s.warn}>{picked ? 'Ready' : state === 'idle' ? 'Ready' : 'Needs FO'}</em>
      </div>
      {state === 'idle' && <button type="button" className={s.swapBtn} onClick={call}>FO Dunne calls in sick at 06:12</button>}
      {state === 'thinking' && <p className={s.swapThinking}>Checking duty limits, rest and type ratings for 14 first officers…</p>}
      {(state === 'options' || state === 'done') && (
        <ol className={s.swapList}>
          {OPTIONS.map((o) => (
            <li key={o.who} className={picked === o.who ? s.swapPicked : ''}>
              <div><b>{o.who}</b><span>{o.note}</span></div>
              <div className={s.swapMeta}><span>{o.cost}</span><em>{o.score}</em></div>
              <button type="button" disabled={state === 'done'} onClick={() => { setPicked(o.who); setState('done') }}>{picked === o.who ? 'Assigned' : 'Assign'}</button>
            </li>
          ))}
        </ol>
      )}
      {state === 'done' && <button type="button" className={s.swapReset} onClick={() => { setState('idle'); setPicked(null) }}>Run it again</button>}
    </div>
  )
}
