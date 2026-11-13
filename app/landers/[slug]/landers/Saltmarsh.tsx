import { cormorant as display, karla as body } from '../../_fonts/fonts'
import { HeroVideo } from '../../_components/HeroVideo'
import { Companions } from '../../_components/Companions'
import { DemoButton } from '../../_components/DemoButton'
import s from './saltmarsh.module.css'

const sp = (n: string) => `/landers/sprites/saltmarsh/${n}.webp`

// one painted route per month: a path, its colour, and how many walks laid it down
const ROUTES = [
  ['Jan', 'M40 300 C 120 240, 200 320, 290 260 S 420 200, 470 250', '#8FA3AE', 6],
  ['Mar', 'M60 120 C 140 160, 180 90, 260 130 S 380 170, 440 110', '#9DB08A', 9],
  ['May', 'M90 220 C 160 180, 230 240, 300 190 S 410 150, 520 200', '#C7B266', 14],
  ['Jul', 'M30 180 C 110 140, 170 210, 250 170 S 400 230, 560 160', '#C79A4B', 18],
  ['Sep', 'M120 330 C 200 290, 280 340, 360 300 S 470 260, 560 300', '#B9764A', 11],
  ['Nov', 'M50 60 C 150 90, 230 40, 320 80 S 450 110, 540 70', '#5B7F8E', 7],
] as const
const SEASONS = [['Winter', '#8FA3AE', '#5B7F8E'], ['Spring', '#9DB08A', '#C7B266'], ['Summer', '#C79A4B', '#D9B77A'], ['Autumn', '#B9764A', '#7E5A43']]
const FAQ = [
  ['Does it drain my battery?', 'About 2% an hour while you walk, and nothing when you don’t. It switches itself off when it notices you’re in a car or on a train.'],
  ['Who can see my routes?', 'Nobody, unless you print or share a page. Routes are stored on your phone and in an encrypted backup only you can open.'],
  ['Can I add old walks?', 'Yes. Import GPX files from any watch or app and they’re painted in with the right month’s colour.'],
  ['What paper is the print on?', '300gsm cold-press cotton paper, A2, posted flat in December. One print per year is included in the £36.'],
]

export default function Saltmarsh() {
  return (
    <div className={`${s.page} ${display.variable} ${body.variable}`}>
      <HeroVideo src="/landers/heroes/saltmarsh.mp4" poster="/landers/heroes/saltmarsh.jpg" className={s.hero} scrim="linear-gradient(180deg, rgba(244,239,230,.82) 0%, rgba(244,239,230,.35) 42%, rgba(244,239,230,0) 70%)">
        <div className={s.heroInner}>
          <span className={s.mark}>Saltmarsh</span>
          <h1><em>Every walk you take,</em><br /><em>painted into the year.</em></h1>
          <p>A walking journal that keeps your routes, notes and the odd sketch, then paints them into one map of your year.</p>
          <DemoButton className={s.cta}>Start this year’s map</DemoButton>
        </div>
      </HeroVideo>
      <div className={s.deckle} aria-hidden />

      <section className={s.how}>
        <Companions spots={[{ src: sp('egret'), top: '2%', right: '8%', size: 150 }, { src: sp('reeds'), top: '72%', right: '4%', size: 120 }]} />
        <h2><em>How a page fills itself</em></h2>
        <div className={s.columns}>
          <p><b>Walk as you always do.</b> Saltmarsh records the route quietly in the background, about 2% battery an hour. No streaks, no step counts in your face.</p>
          <p><b>Add a line, if you like.</b> “Curlews on the mud at low tide.” A photo, a pressed leaf scanned in, a pencil sketch. Or nothing at all.</p>
          <p><b>Watch the map grow.</b> Each route is laid down as a soft wash of colour. Paths you repeat get deeper, like paint going over the same stroke.</p>
        </div>
      </section>

      <section className={s.yearMap}>
        <div className={s.yearCopy}>
          <h2><em>The year, as paint</em></h2>
          <p>Every walk adds a wash of colour in the shade of its month. The paths you take most go darker, the way a brush does when it goes over the same stroke. By December the map looks like the year felt.</p>
        </div>
        <figure className={s.sheet}>
          <svg viewBox="0 0 600 380" role="img" aria-label="A watercolour-style map of a year of walks, one colour per month">
            <defs>
              <filter id="bleed"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" /><feDisplacementMap in="SourceGraphic" scale="9" /><feGaussianBlur stdDeviation="1.1" /></filter>
            </defs>
            {ROUTES.map(([m, d, c, n], i) => (
              <g key={m} filter="url(#bleed)" opacity=".82">
                <path d={d} stroke={c} strokeWidth={6 + n} fill="none" strokeLinecap="round" opacity=".55" className={s.stroke} style={{ animationDelay: `${i * 0.5}s` }} />
                <path d={d} stroke={c} strokeWidth={3} fill="none" strokeLinecap="round" className={s.stroke} style={{ animationDelay: `${i * 0.5 + 0.2}s` }} />
              </g>
            ))}
          </svg>
          <figcaption>
            {ROUTES.map(([m, , c, n]) => <span key={m}><i style={{ background: c }} />{m} · {n} walks</span>)}
          </figcaption>
        </figure>
      </section>

      <section className={s.entry}>
        <Companions spots={[{ src: sp('egret'), top: '8%', left: '4%', size: 120 }]} />
        <article className={s.page2}>
          <header><span>Tuesday 4 March</span><span>Low tide 11:42 · 5.8 km</span></header>
          <p className={s.hand}>Curlews on the mud at low tide, maybe twenty. The reeds have gone from rust to straw. Cold enough for gloves until the sea wall, then not.</p>
          <div className={s.entryFoot}><span className={s.chip} style={{ background: '#9DB08A' }}>March wash</span><span>Added to the map</span></div>
        </article>
        <div className={s.entryCopy}>
          <h2><em>A line, if you like</em></h2>
          <p>Some days you’ll write a paragraph, most days nothing. Saltmarsh never nags. Notes sit on the route where you wrote them, and appear in the margin of your printed year.</p>
        </div>
      </section>

      <section className={s.seasons} aria-label="The seasonal palette">
        {SEASONS.map(([n, a, b]) => (
          <div key={n} style={{ background: `linear-gradient(160deg, ${a}, ${b})` }}><span>{n}</span></div>
        ))}
      </section>

      <section className={s.margin}>
        <Companions spots={[{ src: sp('shell'), top: '14%', right: '6%', size: 100, rotate: 12 }, { src: sp('rowing-boat'), top: '70%', right: '22%', size: 140 }]} />
        <h2><em>Notes in the margin</em></h2>
        <dl className={s.notes}>
          <div><dt>Private by default</dt><dd>Your routes stay on your phone unless you choose to print or share a page.</dd></div>
          <div><dt>A real print, once a year</dt><dd>Every December we send your year as one A2 print on 300gsm cold-press paper.</dd></div>
          <div><dt>Works offline</dt><dd>Out on the marsh with no signal, it keeps recording and catches up at home.</dd></div>
        </dl>
      </section>

      <section className={s.who}>
        <Companions spots={[{ src: sp('cloud'), top: '6%', left: '6%', size: 160 }]} />
        <h2><em>Who it’s for</em></h2>
        <p className={s.whoLead}>People who walk the same three paths and want to see the year they made out of them.</p>
        <div className={s.price}>
          <p><span>The journal</span> free, forever</p>
          <p><span>The yearly print</span> £36, posted in December</p>
        </div>
        <DemoButton className={s.cta}>Start this year’s map</DemoButton>
      </section>

      <section className={s.print}>
        <div className={s.frame}>
          <img src="/landers/heroes/saltmarsh.jpg" alt="Your year as one print: a watercolour map on cold-press paper" />
          <span>2026 · 214 walks · 1,186 km</span>
        </div>
        <div className={s.printCopy}>
          <h2><em>Posted in December</em></h2>
          <p>Your whole year on one A2 sheet of cotton paper, with the month colours, your longest walk marked in sea blue and three of your notes in the margin.</p>
        </div>
      </section>

      <section className={s.faq}>
        <h2><em>Before you start</em></h2>
        {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
      </section>

      <section className={s.closing}>
        <Companions spots={[{ src: sp('reeds'), top: '18%', left: '10%', size: 120 }, { src: sp('rowing-boat'), top: '42%', right: '10%', size: 130 }]} />
        <h2><em>Your first stroke is your next walk.</em></h2>
        <DemoButton className={s.cta}>Start this year’s map</DemoButton>
      </section>

      <footer className={s.footer}>Saltmarsh · <em>A fictional startup from Lander Library</em></footer>
    </div>
  )
}
