import { spectral as display, publicSans as body } from '../../_fonts/fonts'
import { HeroVideo } from '../../_components/HeroVideo'
import { Companions } from '../../_components/Companions'
import { DemoButton } from '../../_components/DemoButton'
import s from './paperwing.module.css'
import { PaperwingSwap } from './PaperwingSwap'

const sp = (n: string) => `/landers/sprites/paperwing/${n}.webp`

const LIMITS = [['Duty today', 9.5, 13, 'h'], ['Flight time, 28 days', 71, 100, 'h'], ['Flight time, 12 months', 702, 900, 'h']] as const
const FAQ = [
  ['Which flight-time rules does it check?', 'The UK and EU flight-time limitation rules for commercial air transport out of the box, plus any stricter limits in your own operations manual.'],
  ['Can we import our current roster?', 'Yes. Upload the spreadsheet you use now; Paperwing maps the columns and flags anything that already breaks a limit.'],
  ['Do pilots need another login?', 'They get a link by text. The crew view works in the browser and remembers them for 30 days.'],
  ['Does it replace our ops software?', 'No. It does rostering and swaps well, and exports to the flight planning and payroll tools you already use.'],
]

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
        <Companions spots={[{ src: sp('crane'), top: '6%', right: '5%', size: 150, rotate: -10 }, { src: sp('cloud'), top: '66%', right: '6%', size: 120 }]} />
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

      <section className={s.demo}>
        <Companions spots={[{ src: sp('crane'), top: '62%', right: '4%', size: 110, rotate: 12 }]} />
        <span className={s.label}>Try it</span>
        <h2>06:12. A first officer calls in sick.</h2>
        <p className={s.sub}>Press the button. This is the part of the morning Paperwing takes off your hands.</p>
        <PaperwingSwap />
      </section>

      <section className={s.limitsRow}>
        <div>
          <span className={s.label}>Limits, live</span>
          <h2>Every change is checked before it’s saved.</h2>
          <p className={s.sub}>Duty, rest and flight-time limits run on each edit, so the roster can never quietly drift past what’s legal.</p>
        </div>
        <div className={s.limits}>
          <b className={s.limitsWho}>Capt. A. Okafor</b>
          {LIMITS.map(([n, v, max, u]) => (
            <div key={n} className={s.limit}>
              <div className={s.limitHead}><span>{n}</span><span>{v}{u} of {max}{u}</span></div>
              <div className={s.limitBar}><i style={{ width: `${(v / max) * 100}%` }} className={v / max > 0.75 ? s.limitHigh : ''} /></div>
            </div>
          ))}
        </div>
      </section>

      <section className={s.crewView}>
        <div className={s.crewPhone} aria-label="The crew view on a phone">
          <span className={s.crewTop}>Your week · FO Marsh</span>
          {[['Mon', 'PW 214 · 07:40 → LFMN', 'Hotel: Rue de France'], ['Tue', 'PW 215 · 12:10 → EGLF', 'Home by 15:05'], ['Wed', 'Standby · 06:00–14:00', 'Base EGHH'], ['Thu', 'Day off', ''], ['Fri', 'PW 381 · 15:30 → EGHH', '']].map(([d, a, b]) => (
            <div key={d} className={s.crewDay}><b>{d}</b><span>{a}</span>{b && <small>{b}</small>}</div>
          ))}
          <button type="button">Request a swap</button>
        </div>
        <div>
          <span className={s.label}>For the crew</span>
          <h2>Pilots see their own week. Nothing else.</h2>
          <p className={s.sub}>Report times, hotels and swap requests on their phone. Changes arrive as a text with the reason, not a 22:00 phone call.</p>
        </div>
      </section>

      <section className={s.stats}>
        {[['2 days → 1 afternoon', 'to build a month’s roster'], ['0', 'limit breaches since go-live at our pilot operator'], ['4 min', 'median time to cover a sick call']].map(([a, b]) => (
          <div key={b}><b>{a}</b><span>{b}</span></div>
        ))}
      </section>

      <section className={s.benefits}>
        <Companions spots={[{ src: sp('star'), top: '10%', right: '10%', size: 90 }, { src: sp('boat'), top: '74%', left: '8%', size: 110 }]} />
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
        <Companions spots={[{ src: sp('tower'), top: '10%', right: '8%', size: 120 }]} />
        <span className={s.label}>Pricing</span>
        <h2>Per aircraft, per month.</h2>
        <div className={s.tiers}>
          <div><b>£95</b><span>per aircraft</span><p>Up to 10 aircraft. Rostering, limits and the crew app.</p></div>
          <div><b>£75</b><span>per aircraft</span><p>11 to 40 aircraft. Adds charter quoting and a second base.</p></div>
        </div>
        <DemoButton className={s.cta}>Book a 20-minute walkthrough</DemoButton>
      </section>

      <section className={s.faq}>
        <span className={s.label}>Questions</span>
        {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
      </section>

      <section className={s.closing}>
        <Companions spots={[{ src: sp('cloud'), top: '16%', left: '10%', size: 130 }, { src: sp('crane'), top: '30%', right: '12%', size: 150, rotate: -8 }]} />
        <h2>Fold the roster once.<br /><em>Let it fly itself.</em></h2>
        <DemoButton className={s.cta}>Book a 20-minute walkthrough</DemoButton>
      </section>

      <footer className={s.footer}><span>Paperwing</span><span>A fictional startup from Lander Library</span></footer>
    </div>
  )
}
