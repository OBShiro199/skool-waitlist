'use client'
import { useState } from 'react'
import s from './foldwell.module.css'

const gbp = (n: number) => `£${Math.round(n).toLocaleString('en-GB')}`

/** How much tax forgotten expenses cost, at basic-rate income tax (20%) plus Class 4 National Insurance (6%). */
export function FoldwellCalc() {
  const [forgot, setForgot] = useState(1140)
  const back = forgot * 0.26
  return (
    <div className={s.calc}>
      <label htmlFor="fw-forgot">Expenses you didn’t claim last year</label>
      <output className={s.calcValue}>{gbp(forgot)}</output>
      <input id="fw-forgot" type="range" min={0} max={6000} step={20} value={forgot} onChange={(e) => setForgot(Number(e.target.value))} />
      <div className={s.calcRow}><span>Tax you paid on them</span><b>{gbp(back)}</b></div>
      <div className={s.calcRow}><span>Foldwell for the year</span><b>£79</b></div>
      <div className={`${s.calcRow} ${s.calcTotal}`}><span>{back >= 79 ? 'You’d be ahead by' : 'You’d be short by'}</span><b>{gbp(Math.abs(back - 79))}</b></div>
      <p className={s.calcNote}>Estimate at 20% income tax plus 6% Class 4 National Insurance. Higher-rate payers save more.</p>
    </div>
  )
}
