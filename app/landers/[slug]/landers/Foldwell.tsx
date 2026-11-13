import { caslon as display, hanken as body } from '../../_fonts/fonts'
import { HeroVideo } from '../../_components/HeroVideo'
import { Companions } from '../../_components/Companions'
import { DemoButton } from '../../_components/DemoButton'
import s from './foldwell.module.css'

const sp = (n: string) => `/landers/sprites/foldwell/${n}.webp`

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
        <Companions spots={[{ src: sp('red-boat'), top: '10%', right: '6%', size: 120, rotate: -6 }, { src: sp('tree'), top: '55%', right: '20%', size: 120 }]} />
        <h2>How it works</h2>
        <div className={s.steps}>
          <div><b>All year</b><p>Snap a receipt or forward the email. Foldwell reads it and files it under the right expense.</p></div>
          <div><b>Every quarter</b><p>A two-minute check: we show what we sorted and flag anything odd, like a personal streaming subscription on the business card.</p></div>
          <div><b>In January</b><p>Your return is pre-filled. Review the numbers, tap submit, and we send it straight to HMRC.</p></div>
        </div>
      </section>

      <section className={`${s.layer} ${s.l2}`}>
        <Companions spots={[{ src: sp('house'), top: '8%', right: '5%', size: 130 }, { src: sp('cloud'), top: '64%', left: '3%', size: 140 }]} />
        <h2>What you get back</h2>
        <div className={s.points}>
          <p><span>£1,140</span>average expenses our beta users had been forgetting to claim.</p>
          <p><span>10 min</span>median time from opening the app in January to a submitted return.</p>
          <p><span>0 spreadsheets</span>to keep. Your bank feed and your camera are enough.</p>
        </div>
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

      <footer className={s.footer}>Foldwell · A fictional startup from Lander Library</footer>
    </div>
  )
}
