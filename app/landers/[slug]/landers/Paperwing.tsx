import { spectral as display, publicSans as body } from '../../_fonts/fonts'
import { HeroVideo } from '../../_components/HeroVideo'
import { Companions } from '../../_components/Companions'
import { DemoButton } from '../../_components/DemoButton'
import s from './paperwing.module.css'

const sp = (n: string) => `/landers/sprites/paperwing/${n}.webp`

const ROWS = [
  ['PW 214', 'EGLF → LFMN', '07:40', 'Capt. Reyes · FO Lind', 'Ready'],
  ['PW 215', 'LFMN → EGLF', '12:10', 'Capt. Reyes · FO Lind', 'Ready'],
  ['PW 380', 'EGHH → EGJJ', '09:05', 'Capt. Okafor · FO —', 'Needs FO'],
  ['PW 381', 'EGJJ → EGHH', '15:30', 'Capt. Okafor · FO Marsh', 'Swapped'],
]

export default function Paperwing() {
  return (
    <div className={`${s.page} ${display.variable} ${body.variable}`}>
      <HeroVideo src="/landers/heroes/paperwing.mp4" poster="/landers/heroes/paperwing.jpg" className={s.hero} scrim="linear-gradient(180deg, rgba(251,250,247,.7) 0%, rgba(251,250,247,.15) 45%, rgba(251,250,247,0) 100%)">
        <div className={s.grid} aria-hidden />
        <div className={s.heroInner}>
          <div className={s.topline}><span>Paperwing</span><span>Crew &amp; flight scheduling</span></div>
          <h1>Every crew, every tail, every leg.<br /><em>One calm board.</em></h1>
          <p>Rostering, duty limits and swaps for operators with 2 to 40 aircraft.</p>
          <DemoButton className={s.cta}>See your week on the board</DemoButton>
        </div>
      </HeroVideo>

      <section className={s.how}>
        <Companions spots={[{ src: sp('crane'), top: '6%', right: '5%', size: 150, rotate: -10 }, { src: sp('cloud'), top: '60%', left: '2%', size: 120 }]} />
        <span className={s.label}>How it works</span>
        <h2>Build the roster, then let it fix itself.</h2>
        <div className={s.board}>
          <div className={`${s.r} ${s.th}`}><span>Flight</span><span>Route</span><span>Off blocks</span><span>Crew</span><span>Status</span></div>
          {ROWS.map((r) => (
            <div key={r[0]} className={s.r}>{r.map((c, i) => <span key={i} className={i === 4 ? s[`st${c.replace(/\s/g, '')}`] ?? '' : ''}>{c}</span>)}</div>
          ))}
        </div>
        <ol className={s.steps}>
          <li><b>Load your fleet and crew.</b> Tails, type ratings, base and contract hours. A CSV from your current sheet works.</li>
          <li><b>Draft the month.</b> Paperwing builds a roster that respects flight-time limits and rest rules, then shows you every trade-off it made.</li>
          <li><b>Swap without phone calls.</b> When someone goes sick, it offers the three legal replacements, ranked by cost and fatigue.</li>
        </ol>
      </section>

      <section className={s.benefits}>
        <Companions spots={[{ src: sp('star'), top: '10%', right: '10%', size: 90 }, { src: sp('boat'), top: '70%', right: '30%', size: 110 }]} />
        <span className={s.label}>For the ops room</span>
        <div className={s.split}>
          <p className={s.quoteish}>A roster that was two days of spreadsheet now takes one afternoon, and nobody gets rostered past their limits.</p>
          <ul>
            <li><b>Limits checked live.</b> Duty and rest rules run on every change, not at the end of the month.</li>
            <li><b>Pilots see their own week.</b> A phone view with times, hotels and swap requests.</li>
            <li><b>Built for charter, too.</b> Ad-hoc legs drop into the board and re-plan the crew around them.</li>
          </ul>
        </div>
      </section>

      <section className={s.pricing}>
        <Companions spots={[{ src: sp('tower'), top: '8%', left: '4%', size: 120 }]} />
        <span className={s.label}>Pricing</span>
        <h2>Per aircraft, per month.</h2>
        <div className={s.tiers}>
          <div><b>£95</b><span>per aircraft</span><p>Up to 10 aircraft. Rostering, limits and the crew app.</p></div>
          <div><b>£75</b><span>per aircraft</span><p>11 to 40 aircraft. Adds charter quoting and a second base.</p></div>
        </div>
        <DemoButton className={s.cta}>Book a 20-minute walkthrough</DemoButton>
      </section>

      <footer className={s.footer}><span>Paperwing</span><span>A fictional startup from Lander Library</span></footer>
    </div>
  )
}
