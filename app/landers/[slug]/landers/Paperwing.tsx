import { GeistMono } from 'geist/font/mono'
import { instrumentSerif, interTight, inter } from '../../_fonts/fonts'
import { HeroVideo } from '../../_components/HeroVideo'
import { Companions } from '../../_components/Companions'
import k from '../../_kit/kit.module.css'
import { Buttons, Closing, CountUp, Faq, Footer, Headline, Marquee, Nav, Pill, Pricing, Quotes, Reveal, SectionHead, Spotlight, Window } from '../../_kit/kit'
import s from './paperwing.module.css'
import { PaperwingSwap } from './PaperwingSwap'

const sp = (n: string) => `/landers/sprites/paperwing/${n}.webp`
const H0 = 6, H1 = 20
const at = (h: number) => `${((h - H0) / (H1 - H0)) * 100}%`
// crew rows: [name, [[start, end, label, kind]]]
const ROSTER: [string, [number, number, string, string][]][] = [
  ['Capt. Reyes', [[7.5, 9.6, 'PW 214 → LFMN', 'f'], [12, 14.1, 'PW 215 → EGLF', 'f']]],
  ['FO Lind', [[7.5, 9.6, 'PW 214 → LFMN', 'f'], [12, 14.1, 'PW 215 → EGLF', 'f']]],
  ['Capt. Okafor', [[9, 10.2, 'PW 380 → EGJJ', 'f'], [15.5, 16.7, 'PW 381 → EGHH', 'f']]],
  ['FO —', [[9, 10.2, 'Needs FO', 'gap']]],
  ['FO Marsh', [[6, 14, 'Standby · EGHH', 's'], [15.5, 16.7, 'PW 381 → EGHH', 'f']]],
  ['Capt. Haines', [[13, 15.4, 'Charter C-77 → EGPH', 'c'], [16.5, 19, 'C-78 → EGHH', 'c']]],
]

export default function Paperwing() {
  return (
    <div className={`${k.root} ${s.theme} ${interTight.variable} ${inter.variable} ${instrumentSerif.variable} ${GeistMono.variable}`}>
      <Nav brand={<><span className={s.mark} aria-hidden />Paperwing</>} links={['Product', 'Try it', 'Pricing', 'FAQ']} cta="Book a walkthrough" />

      <HeroVideo src="/landers/heroes/paperwing.mp4" poster="/landers/heroes/paperwing.jpg" scrim="var(--hero-scrim)">
        <div className={s.chart} aria-hidden />
        <div className={k.heroInner}>
          <Pill>New · charter legs re-plan the crew automatically</Pill>
          <Headline text="Every crew, every tail, | every leg. *One calm board.*" />
          <p className={k.lede}>Rostering, duty limits and sick-call swaps for operators flying 2 to 40 aircraft.</p>
          <Buttons primary="See your week on the board" secondary="Try the sick-call demo" />
          <div className={k.heroMeta}><span>UK and EU flight-time limits built in</span><span>Crew app included</span></div>
        </div>
      </HeroVideo>

      <Marquee label="Rostering 900 crew at operators like" names={['Skerry Air', 'Northlink Charter', 'Solent Aviation', 'Hebridean Wings', 'Fenland Air Taxi', 'Atlantic Isles', 'Cotswold Jets', 'Orkney Air']} />

      <section className={k.section} id="product">
        <Companions spots={[{ src: sp('crane'), top: '3%', right: '4%', size: 140, rotate: -10 }]} />
        <div className={k.wrap}>
          <SectionHead eyebrow="Product" title={<>The whole day, <em>at a glance</em>.</>} sub="Every pilot, every leg, every standby block on one board. Limits are checked on each change, so the roster can never quietly drift past what’s legal." />
          <Reveal>
            <Window title="Paperwing · Ops board · Thu 13 Nov" className={s.app}>
              <div className={s.board}>
                <div className={s.hours}><span />{Array.from({ length: H1 - H0 + 1 }, (_, i) => <span key={i} style={{ left: at(H0 + i) }}>{String(H0 + i).padStart(2, '0')}</span>)}</div>
                {ROSTER.map(([who, legs], r) => (
                  <div key={who} className={s.lane}>
                    <b className={who === 'FO —' ? s.missing : ''}>{who}</b>
                    <div className={s.track}>
                      <i className={s.now} style={{ left: at(8.4) }} />
                      {legs.map(([a, b, label, kind]) => (
                        <span key={label + a} className={`${s.bar} ${s[`k_${kind}`]}`} style={{ left: at(a), width: `calc(${at(b)} - ${at(a)})`, animationDelay: `${r * 80}ms` }}>{label}</span>
                      ))}
                    </div>
                  </div>
                ))}
                <div className={s.boardFoot}><span><i className={s.k_f} />Scheduled</span><span><i className={s.k_c} />Charter</span><span><i className={s.k_s} />Standby</span><span><i className={s.k_gap} />Needs crew</span><span className={s.nowKey}>Now 08:24</span></div>
              </div>
            </Window>
          </Reveal>
        </div>
      </section>

      <section className={`${k.section} ${k.alt}`} id="try-it">
        <div className={k.wrap}>
          <SectionHead eyebrow="Try it" title={<>06:12. A first officer <em>calls in sick</em>.</>} sub="Press the button. This is the part of the morning Paperwing takes off your hands." />
          <div className={s.tryRow}>
            <Reveal><Window title="Sick call · PW 380"><PaperwingSwap /></Window></Reveal>
            <Reveal delay={100}>
              <Window title="Limits · Capt. A. Okafor">
                <div className={s.limits}>
                  {([['Duty today', 9.5, 13, 'h'], ['Flight time, 28 days', 71, 100, 'h'], ['Flight time, 12 months', 702, 900, 'h']] as const).map(([n, v, max, u]) => (
                    <div key={n} className={s.limit}><div className={s.limitHead}><span>{n}</span><span>{v}{u} / {max}{u}</span></div><div className={s.limitBar}><i style={{ width: `${(v / max) * 100}%` }} className={v / max > 0.75 ? s.limitHigh : ''} /></div></div>
                  ))}
                  <p className={s.limitNote}>Checked on every edit against UK and EU flight-time limitation rules and your own operations manual.</p>
                </div>
              </Window>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={k.section}>
        <div className={k.wrap}>
          <SectionHead eyebrow="For the whole operation" title={<>Built for the <em>ops room</em> and the flight deck.</>} />
          <div className={k.bento}>
            <Reveal className={k.span2}><Spotlight><div className={k.cell}><h3>Pilots see their own week</h3><p>Report times, hotels and swap requests on their phone.</p>
              <div className={`${k.cellVisual} ${s.crewPhone}`}>{[['Mon', 'PW 214 · 07:40 → LFMN'], ['Tue', 'PW 215 · 12:10 → EGLF'], ['Wed', 'Standby · 06:00–14:00'], ['Thu', 'Day off']].map(([d, a]) => <div key={d}><b>{d}</b><span>{a}</span></div>)}</div></div></Spotlight></Reveal>
            <Reveal className={k.span4} delay={80}><Spotlight><div className={k.cell}><h3>Charter legs, dropped straight in</h3><p>Quote a charter and the board re-plans the crew around it, showing every trade-off it made.</p>
              <div className={`${k.cellVisual} ${s.charter}`}><div><span>C-77 · EGHH → EGPH · Fri 13:00</span><b>Quote £8,450</b></div><div className={s.tradeoffs}><span>Haines moves off standby</span><span>Marsh covers the 15:30</span><span>No limits exceeded</span></div></div></div></Spotlight></Reveal>
            <Reveal className={k.span3}><Spotlight><div className={k.cell}><h3>Payroll-ready hours</h3><p>Duty, flight and allowance hours exported at month end, in the format your payroll already takes.</p><div className={`${k.cellVisual} ${s.file}`}><span>roster-nov-2026.csv</span><b>Export</b></div></div></Spotlight></Reveal>
            <Reveal className={k.span3} delay={60}><Spotlight><div className={k.cell}><h3>A full audit trail</h3><p>Every change, who made it and the rule it was checked against. Ready for your next audit.</p><div className={`${k.cellVisual} ${s.audit}`}>{['06:14 · FO Marsh assigned to PW 380 · J. Patel', '06:12 · FO Dunne off sick · crew app', '05:58 · Roster published · system'].map((x) => <span key={x}>{x}</span>)}</div></div></Spotlight></Reveal>
          </div>
        </div>
      </section>

      <section className={`${k.section} ${k.alt}`}>
        <div className={k.wrap}>
          <div className={k.stats}>
            <div className={k.stat}><b><CountUp to={4} suffix=" min" /></b><span>median time to cover a sick call</span></div>
            <div className={k.stat}><b>0</b><span>limit breaches at our pilot operator</span></div>
            <div className={k.stat}><b><CountUp to={900} /></b><span>crew rostered on Paperwing</span></div>
            <div className={k.stat}><b>1 afternoon</b><span>to build a month, down from two days</span></div>
          </div>
        </div>
      </section>

      <section className={k.section}>
        <Companions spots={[{ src: sp('cloud'), top: '4%', left: '4%', size: 120 }, { src: sp('star'), top: '6%', right: '8%', size: 80 }]} />
        <div className={k.wrap}>
          <SectionHead eyebrow="Operators" title={<>No more <em>22:00</em> phone calls.</>} />
          <Quotes items={[
            { text: 'Our roster used to be two days of spreadsheet. Now it’s an afternoon, and nobody gets rostered past their limits.', name: 'Jas Patel', role: 'Head of crewing, Skerry Air' },
            { text: 'The sick-call screen is the best thing in it. Three legal options, ranked, in seconds.', name: 'Morag Innes', role: 'Ops controller, Hebridean Wings' },
            { text: 'Pilots love seeing their week on their phone. Swap requests stopped coming by text.', name: 'Capt. Leon Hart', role: 'Chief pilot, Solent Aviation' },
            { text: 'We fly ad-hoc charters most days. The board re-plans crew around them without me touching it.', name: 'Ana Costa', role: 'Owner, Fenland Air Taxi' },
            { text: 'Our last audit took an hour. The trail was all there.', name: 'Greg Lowther', role: 'Compliance manager' },
            { text: 'Set up from our old spreadsheet in a morning. It flagged two limit problems we didn’t know we had.', name: 'Rhiannon Bell', role: 'Northlink Charter' },
          ]} />
        </div>
      </section>

      <section className={`${k.section} ${k.alt}`} id="pricing">
        <Companions spots={[{ src: sp('tower'), top: '6%', right: '5%', size: 110 }]} />
        <div className={k.wrap}>
          <SectionHead eyebrow="Pricing" title={<>Per aircraft, <em>per month</em>.</>} sub="Every plan includes the crew app and unlimited users." />
          <Pricing plans={[
            { name: 'Fleet', price: '£95', per: 'aircraft / month', blurb: 'Up to 10 aircraft.', features: ['Roster board', 'Live limit checks', 'Crew app', 'Sick-call swaps'], cta: 'Book a walkthrough' },
            { name: 'Operator', price: '£75', per: 'aircraft / month', blurb: '11 to 40 aircraft, multiple bases.', features: ['Everything in Fleet', 'Charter re-planning', 'Second base', 'Payroll export', 'Audit trail'], featured: true, cta: 'Book a walkthrough' },
            { name: 'Group', price: 'Custom', blurb: 'More than 40 aircraft or several AOCs.', features: ['Everything in Operator', 'Multiple AOCs', 'SSO and API', 'Named success manager'], cta: 'Talk to us' },
          ]} />
        </div>
      </section>

      <section className={k.section} id="faq">
        <div className={k.wrap}>
          <SectionHead eyebrow="FAQ" title={<>Questions from the <em>ops room</em>.</>} />
          <Faq items={[
            ['Which flight-time rules does it check?', 'UK and EU flight-time limitation rules for commercial air transport out of the box, plus any stricter limits in your operations manual.'],
            ['Can we import our current roster?', 'Yes. Upload your spreadsheet; Paperwing maps the columns and flags anything that already breaks a limit.'],
            ['Do pilots need another login?', 'They get a link by text. The crew view works in the browser and remembers them for 30 days.'],
            ['Does it replace our ops software?', 'No. It does rostering and swaps well, and exports to the flight planning and payroll tools you already use.'],
          ]} />
        </div>
      </section>

      <Closing video="/landers/heroes/paperwing.mp4" poster="/landers/heroes/paperwing.jpg" title={<>Fold the roster once. <em>Let it fly itself.</em></>} sub="A 20-minute walkthrough with your own fleet loaded." cta="Book a walkthrough" />
      <Footer brand={<><span className={s.mark} aria-hidden />Paperwing</>} cols={[['Product', ['Roster board', 'Sick-call swaps', 'Crew app', 'Charter']], ['Company', ['About', 'Operators', 'Careers']], ['Help', ['Import guide', 'Contact', 'Status']]]} />
      <div className={k.grain} aria-hidden />
    </div>
  )
}
