import { cormorant, inter } from '../../_fonts/fonts'
import { HeroVideo } from '../../_components/HeroVideo'
import { Companions } from '../../_components/Companions'
import k from '../../_kit/kit.module.css'
import { Buttons, Closing, CountUp, Faq, Footer, Headline, Marquee, Nav, Pill, Pricing, Quotes, Reveal, SectionHead, Spotlight, Window } from '../../_kit/kit'
import s from './saltmarsh.module.css'

const sp = (n: string) => `/landers/sprites/saltmarsh/${n}.webp`
const ROUTES = [
  ['Jan', 'M40 300 C 120 240, 200 320, 290 260 S 420 200, 470 250', '#8FA3AE', 6],
  ['Mar', 'M60 120 C 140 160, 180 90, 260 130 S 380 170, 440 110', '#9DB08A', 9],
  ['May', 'M90 220 C 160 180, 230 240, 300 190 S 410 150, 520 200', '#C7B266', 14],
  ['Jul', 'M30 180 C 110 140, 170 210, 250 170 S 400 230, 560 160', '#C79A4B', 18],
  ['Sep', 'M120 330 C 200 290, 280 340, 360 300 S 470 260, 560 300', '#B9764A', 11],
  ['Nov', 'M50 60 C 150 90, 230 40, 320 80 S 450 110, 540 70', '#5B7F8E', 7],
] as const

export default function Saltmarsh() {
  return (
    <div className={`${k.root} ${s.theme} ${cormorant.variable} ${inter.variable}`}>
      <Nav brand={<><span className={s.mark} aria-hidden />Saltmarsh</>} links={['The map', 'Journal', 'Print', 'Pricing']} cta="Start your map" />

      <HeroVideo src="/landers/heroes/saltmarsh.mp4" poster="/landers/heroes/saltmarsh.jpg" scrim="var(--hero-scrim)">
        <div className={`${k.heroInner} ${s.heroInner}`}>
          <Pill>The 2026 print ships in December</Pill>
          <Headline text="Every walk you take, | *painted* into the year." />
          <p className={k.lede}>A walking journal that keeps your routes, notes and the odd sketch, then paints them into one map of your year.</p>
          <Buttons primary="Start this year’s map" secondary="See a finished year" />
          <div className={k.heroMeta}><span>Free to keep</span><span>Private by default</span><span>Works offline</span></div>
        </div>
      </HeroVideo>

      <Marquee label="Walked by 38,000 people across" names={['Norfolk Coast', 'Dartmoor', 'The Fens', 'Pembrokeshire', 'Morecambe Bay', 'Isle of Skye', 'Romney Marsh', 'Northumberland']} />

      <section className={k.section} id="the-map">
        <Companions spots={[{ src: sp('egret'), top: '2%', right: '5%', size: 140 }]} />
        <div className={k.wrap}>
          <SectionHead eyebrow="The map" title={<>The year, <em>as paint</em>.</>} sub="Each walk adds a wash in the colour of its month. Paths you repeat go deeper, the way a brush does over the same stroke. By December the map looks like the year felt." />
          <Reveal>
            <Window title="Saltmarsh · Your year so far" className={s.app}>
              <div className={s.appGrid}>
                <figure className={s.sheet}>
                  <svg viewBox="0 0 600 380" role="img" aria-label="A watercolour map of a year of walks, one colour per month">
                    <defs><filter id="sm-bleed"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" /><feDisplacementMap in="SourceGraphic" scale="9" /><feGaussianBlur stdDeviation="1.1" /></filter></defs>
                    {ROUTES.map(([m, d, c, n], i) => (
                      <g key={m} filter="url(#sm-bleed)" opacity=".85">
                        <path d={d} stroke={c} strokeWidth={6 + n} fill="none" strokeLinecap="round" opacity=".55" className={s.stroke} style={{ animationDelay: `${i * 0.45}s` }} />
                        <path d={d} stroke={c} strokeWidth={3} fill="none" strokeLinecap="round" className={s.stroke} style={{ animationDelay: `${i * 0.45 + 0.2}s` }} />
                      </g>
                    ))}
                  </svg>
                </figure>
                <aside className={s.panel}>
                  <div className={s.panelStat}><b>214</b><span>walks</span></div>
                  <div className={s.panelStat}><b>1,186</b><span>km</span></div>
                  <div className={s.panelStat}><b>23.4</b><span>km longest, 9 July</span></div>
                  <div className={s.months}>{ROUTES.map(([m, , c, n]) => <span key={m}><i style={{ background: c }} />{m}<small>{n}</small></span>)}</div>
                </aside>
              </div>
            </Window>
          </Reveal>
        </div>
      </section>

      <section className={`${k.section} ${k.alt}`} id="journal">
        <div className={k.wrap}>
          <SectionHead eyebrow="Journal" title={<>A line, <em>if you like</em>.</>} sub="Some days you’ll write a paragraph, most days nothing. Saltmarsh never nags." />
          <div className={k.bento}>
            <Reveal className={k.span4}><Spotlight><div className={k.cell}><h3>Notes sit where you wrote them</h3><p>A sentence, a photo, a pressed leaf scanned in. They appear on the route and in the margin of your print.</p>
              <div className={`${k.cellVisual} ${s.entry}`}><header><span>Tuesday 4 March</span><span>Low tide 11:42 · 5.8 km</span></header><p>Curlews on the mud at low tide, maybe twenty. The reeds have gone from rust to straw. Cold enough for gloves until the sea wall.</p><footer><span className={s.chip}>March wash</span><span>Added to the map</span></footer></div></div></Spotlight></Reveal>
            <Reveal className={k.span2} delay={80}><Spotlight><div className={k.cell}><h3>Private by default</h3><p>Routes stay on your phone, in an encrypted backup only you can open.</p><div className={`${k.cellVisual} ${s.lock}`} aria-hidden><span /></div></div></Spotlight></Reveal>
            <Reveal className={k.span2}><Spotlight><div className={k.cell}><h3>Gentle on battery</h3><p>About 2% an hour while you walk, nothing when you don’t.</p><div className={`${k.cellVisual} ${s.battery}`}><i /><span>98%</span></div></div></Spotlight></Reveal>
            <Reveal className={k.span2} delay={60}><Spotlight><div className={k.cell}><h3>Works with no signal</h3><p>Out on the marsh it keeps recording and catches up at home.</p><div className={`${k.cellVisual} ${s.offline}`}><span>Offline</span><span>3 walks waiting to sync</span></div></div></Spotlight></Reveal>
            <Reveal className={k.span2} delay={120}><Spotlight><div className={k.cell}><h3>Bring old walks in</h3><p>Import GPX from any watch or app, painted in the right month’s colour.</p><div className={`${k.cellVisual} ${s.import}`}><span>route-skye-2024.gpx</span><b>Painted · September</b></div></div></Spotlight></Reveal>
          </div>
        </div>
      </section>

      <section className={s.seasons} aria-label="The seasonal palette">
        {[['Winter', '#8FA3AE', '#5B7F8E'], ['Spring', '#9DB08A', '#C7B266'], ['Summer', '#C79A4B', '#D9B77A'], ['Autumn', '#B9764A', '#7E5A43']].map(([n, a, b]) => <div key={n} style={{ background: `linear-gradient(160deg, ${a}, ${b})` }}><span>{n}</span></div>)}
      </section>

      <section className={k.section} id="print">
        <div className={`${k.wrap} ${s.printRow}`}>
          <Reveal className={s.frame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/landers/heroes/saltmarsh.jpg" alt="Your year as one print: a watercolour map on cold-press paper" />
            <span>2026 · 214 walks · 1,186 km</span>
          </Reveal>
          <div>
            <SectionHead align="left" eyebrow="The print" title={<>Posted in <em>December</em>.</>} sub="Your whole year on one A2 sheet of 300gsm cotton paper, with the month colours, your longest walk marked in sea blue and three of your notes in the margin." />
            <Buttons primary="Reserve your print" />
          </div>
        </div>
      </section>

      <section className={`${k.section} ${k.alt}`}>
        <div className={k.wrap}>
          <div className={k.stats}>
            <div className={k.stat}><b><CountUp to={38000} /></b><span>walkers painting their year</span></div>
            <div className={k.stat}><b><CountUp to={2} suffix="%" /></b><span>battery an hour while walking</span></div>
            <div className={k.stat}><b><CountUp to={300} suffix="gsm" /></b><span>cotton paper for the print</span></div>
            <div className={k.stat}><b>0</b><span>ads, streaks or step targets</span></div>
          </div>
        </div>
      </section>

      <section className={k.section}>
        <Companions spots={[{ src: sp('shell'), top: '6%', left: '4%', size: 90, rotate: 12 }, { src: sp('rowing-boat'), top: '4%', right: '6%', size: 130 }]} />
        <div className={k.wrap}>
          <SectionHead eyebrow="Walkers" title={<>Kept <em>quietly</em>, all year.</>} />
          <Quotes items={[
            { text: 'I walk the same sea wall most mornings. Seeing it go from a pale line in January to a deep blue stripe by August made me cry a little.', name: 'Helen Varley', role: 'Walks the Norfolk coast' },
            { text: 'No badges, no streaks, no league tables. It just keeps the year for you.', name: 'Callum Reid', role: 'Dog walker, Fife' },
            { text: 'The December print is on our kitchen wall. Guests always ask about it.', name: 'Nadia Farouk', role: 'Hill walker, Peak District' },
            { text: 'I imported eight years of GPX files. Each one became a painting.', name: 'Owen Price', role: 'Long-distance walker' },
            { text: 'The notes in the margin are my favourite bit. Little moments I’d have forgotten.', name: 'Sarah Lowe', role: 'Birdwatcher, Kent' },
            { text: 'It’s the only app on my phone that feels like a sketchbook.', name: 'Tomás Ruiz', role: 'Illustrator' },
          ]} />
        </div>
      </section>

      <section className={`${k.section} ${k.alt}`} id="pricing">
        <div className={k.wrap}>
          <SectionHead eyebrow="Pricing" title={<>The journal is <em>free</em>. The print is a gift.</>} />
          <Pricing plans={[
            { name: 'Journal', price: 'Free', blurb: 'Routes, notes and the painted map, forever.', features: ['Unlimited walks', 'Notes and photos', 'Painted year map', 'GPX import'], cta: 'Start your map' },
            { name: 'Yearly print', price: '£36', per: '/ year', blurb: 'Your year on A2 cotton paper, posted in December.', features: ['Everything in Journal', 'One A2 print a year', 'Your notes in the margin', 'Free UK postage'], featured: true, cta: 'Reserve your print' },
            { name: 'Family', price: '£60', per: '/ year', blurb: 'Up to four journals painted on one shared map.', features: ['Four walkers', 'One shared family print', 'Each walker in their own colour'], cta: 'Start a family map' },
          ]} />
        </div>
      </section>

      <section className={k.section}>
        <div className={k.wrap}>
          <SectionHead eyebrow="FAQ" title={<>Before you <em>start</em>.</>} />
          <Faq items={[
            ['Does it drain my battery?', 'About 2% an hour while you walk, and nothing when you don’t. It switches itself off when it notices you’re in a car or on a train.'],
            ['Who can see my routes?', 'Nobody, unless you print or share a page. Routes live on your phone and in an encrypted backup only you can open.'],
            ['Can I add old walks?', 'Yes. Import GPX files from any watch or app and they’re painted in with the right month’s colour.'],
            ['What paper is the print on?', '300gsm cold-press cotton paper, A2, posted flat in December.'],
          ]} />
        </div>
      </section>

      <Closing video="/landers/heroes/saltmarsh.mp4" poster="/landers/heroes/saltmarsh.jpg" title={<>Your first stroke is <em>your next walk</em>.</>} sub="Free to start. Your year is waiting to be painted." cta="Start this year’s map" />
      <Footer brand={<><span className={s.mark} aria-hidden />Saltmarsh</>} cols={[['App', ['The map', 'Journal', 'GPX import', 'The print']], ['Saltmarsh', ['About', 'Walkers’ stories', 'Privacy']], ['Help', ['Getting started', 'Contact', 'Status']]]} />
      <div className={k.grain} aria-hidden />
    </div>
  )
}
