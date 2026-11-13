import { caslon as display, hanken as body } from '../../_fonts/fonts'
import { HeroVideo } from '../../_components/HeroVideo'
import { Companions } from '../../_components/Companions'
import { DemoButton } from '../../_components/DemoButton'
import s from './foldwell.module.css'
import { FoldwellCalc } from './FoldwellCalc'

const sp = (n: string) => `/landers/sprites/foldwell/${n}.webp`

const YEAR = [['6 Apr', 'Tax year starts', 'Connect your bank. Foldwell starts sorting.'], ['Jul', 'First check-in', 'Two minutes: confirm what we sorted.'], ['Oct', 'Second check-in', 'We flag anything that looks personal.'], ['Jan', 'You file', 'Review the pre-filled return and submit.'], ['31 Jan', 'Deadline passes quietly', 'You filed weeks ago.']]
const FAQ = [
  ['Is Foldwell recognised by HMRC?', 'Returns are submitted through HMRC’s software route, the same one accountants use. You get the HMRC receipt in the app.'],
  ['What if I’m also employed?', 'Add your P60 figures and Foldwell includes them, so your return shows the whole picture.'],
  ['What can I claim?', 'We sort into HMRC’s own expense categories and explain each one in a sentence: travel, equipment, phone, a share of your home office, and the rest.'],
  ['What happens if I’m investigated?', 'Every receipt is kept for six years with its photo, so you can hand over the evidence in one export.'],
]

export default function Foldwell() {
  return (
    <div className={`${s.page} ${display.variable} ${body.variable}`}>
      <HeroVideo src="/landers/heroes/foldwell.mp4" poster="/landers/heroes/foldwell.jpg" scrim="linear-gradient(90deg, rgba(47,74,58,.78) 0%, rgba(47,74,58,.35) 50%, rgba(47,74,58,0) 80%)">
        <div className={s.heroInner}>
          <span className={s.mark}>Foldwell</span>
          <h1>Snap receipts all year.<br />File in ten minutes.</h1>
          <p>Self-assessment for freelancers. Photograph the receipt when you get it; we sort it, and in January your return is already filled in.</p>
          <DemoButton className={s.cta}>File with Foldwell</DemoButton>
        </div>
      </HeroVideo>

      <section className={`${s.layer} ${s.l1}`}>
        <Companions spots={[{ src: sp('red-boat'), top: '10%', right: '6%', size: 120, rotate: -6 }, { src: sp('tree'), top: '6%', right: '20%', size: 110 }]} />
        <h2>How it works</h2>
        <div className={s.steps}>
          <div><b>All year</b><p>Snap a receipt or forward the email. Foldwell reads it and files it under the right expense.</p></div>
          <div><b>Every quarter</b><p>A two-minute check: we show what we sorted and flag anything odd, like a personal streaming subscription on the business card.</p></div>
          <div><b>In January</b><p>Your return is pre-filled. Review the numbers, tap submit, and we send it straight to HMRC.</p></div>
        </div>
      </section>

      <section className={`${s.layer} ${s.lSnap}`}>
        <div className={s.snapRow}>
          <div className={s.phone} aria-label="The Foldwell app reading a receipt">
            <div className={s.notch} />
            <div className={s.receipt}>
              <b>STATIONERS</b><span>14 Mar 2026 · 10:42</span><i />
              <p><span>A4 notebooks ×3</span><span>£14.97</span></p>
              <p><span>Gel pens ×12</span><span>£8.40</span></p>
              <p><span>Total</span><span>£23.37</span></p>
            </div>
            <div className={s.sorted}><span>Sorted as</span><b>Office costs</b><small>Allowable · saves about £6.08</small></div>
          </div>
          <div>
            <h2>Snap it at the till. That’s the whole job.</h2>
            <p className={s.lead}>Point the camera at a receipt, or forward the email it came in. Foldwell reads the shop, the date and the amount, decides the category, and tells you in plain words whether it counts.</p>
          </div>
        </div>
      </section>

      <section className={`${s.layer} ${s.l2}`}>
        <Companions spots={[{ src: sp('house'), top: '8%', right: '5%', size: 130 }, { src: sp('cloud'), top: '66%', right: '6%', size: 140 }]} />
        <h2>What you get back</h2>
        <div className={s.points}>
          <p><span>£1,140</span>average expenses our beta users had been forgetting to claim.</p>
          <p><span>10 min</span>median time from opening the app in January to a submitted return.</p>
          <p><span>0 spreadsheets</span>to keep. Your bank feed and your camera are enough.</p>
        </div>
      </section>

      <section className={`${s.layer} ${s.lCalc}`}>
        <div className={s.calcRowWrap}>
          <div>
            <h2>What forgetting costs you.</h2>
            <p className={s.lead}>Most freelancers we spoke to under-claim. Drag the slider to the amount you think slipped through last year.</p>
          </div>
          <FoldwellCalc />
        </div>
      </section>

      <section className={`${s.layer} ${s.lYear}`}>
        <h2>Your tax year, folded flat.</h2>
        <ol className={s.year}>
          {YEAR.map(([d, h, p]) => <li key={d}><span>{d}</span><b>{h}</b><p>{p}</p></li>)}
        </ol>
      </section>

      <section className={`${s.layer} ${s.l3}`}>
        <Companions spots={[{ src: sp('sun'), top: '6%', right: '8%', size: 140 }]} />
        <h2>One plan. Pay when you file.</h2>
        <div className={s.plan}>
          <p className={s.big}>£79 <small>per tax year</small></p>
          <ul>
            <li>Unlimited receipts and bank feeds</li>
            <li>Quarterly check-ins and Making Tax Digital ready</li>
            <li>Your return submitted to HMRC</li>
            <li>Free until you file, so try it all year</li>
          </ul>
          <DemoButton className={s.cta}>Start free</DemoButton>
        </div>
      </section>

      <section className={`${s.layer} ${s.lFaq}`}>
        <h2>Fair questions</h2>
        <div className={s.faq}>{FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
      </section>

      <section className={`${s.layer} ${s.lClose}`}>
        <Companions spots={[{ src: sp('red-boat'), top: '30%', right: '12%', size: 120 }, { src: sp('cloud'), top: '14%', left: '8%', size: 140 }]} />
        <h2>Start snapping today. File in January.</h2>
        <DemoButton className={s.cta}>Start free</DemoButton>
      </section>

      <footer className={s.footer}>Foldwell · A fictional startup from Lander Library</footer>
    </div>
  )
}
