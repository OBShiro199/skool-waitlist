import { GeistMono } from 'geist/font/mono'
import { instrumentSerif } from '../../_fonts/fonts'
import { HeroVideo } from '../../_components/HeroVideo'
import { Companions } from '../../_components/Companions'
import k from '../../_kit/kit.module.css'
import { Buttons, Closing, CountUp, Faq, Footer, Headline, Marquee, Nav, Pill, Pricing, Quotes, Reveal, SectionHead, Spotlight, Window } from '../../_kit/kit'
import s from './perihelion.module.css'

const sp = (n: string) => `/landers/sprites/perihelion/${n}.webp`

// moisture index per cell at 06:00 (0 parched … 9 saturated)
const FIELD = ['7777766655', '7777665544', '6766554433', '6655443322', '7766554432', '8877665543', '8887766554', '8888776655']
const tone = (v: number) => ['#5a2b13', '#7a3a17', '#9a531f', '#b8742d', '#d29a4e', '#7f8f55', '#4f7a5a', '#346a63', '#25586a', '#1d4766'][v]
const FIELDS = [
  { n: 'North 40', a: '41 ac', d: '−23%', st: 'Irrigate in 48h', hot: true },
  { n: 'Clay Field', a: '28 ac', d: '−9%', st: 'Watch', hot: false },
  { n: 'Barn Meadow', a: '36 ac', d: '+2%', st: 'Fine', hot: false },
  { n: 'Long Acre', a: '52 ac', d: '+4%', st: 'Fine', hot: false },
]

export default function Perihelion() {
  return (
    <div className={`${k.root} ${s.theme} ${instrumentSerif.variable} ${GeistMono.variable}`}>
      <Nav brand={<><span className={s.mark} aria-hidden />Perihelion</>} links={['Product', 'How it works', 'Pricing', 'FAQ']} cta="Map my fields" />

      <HeroVideo src="/landers/heroes/perihelion.mp4" poster="/landers/heroes/perihelion.jpg" scrim="var(--hero-scrim)">
        <div className={k.heroInner}>
          <Pill>New · thermal stress alerts for spring drilling</Pill>
          <Headline text="See thirst | *before* it shows." />
          <p className={k.lede}>Satellite moisture maps for farms under 500 acres. Every field, every morning, four to six days before the crop wilts.</p>
          <Buttons primary="Map my fields free" secondary="Watch the 2-minute demo" />
          <div className={k.heroMeta}><span>3 m resolution</span><span>Daily at 06:00</span><span>No hardware</span></div>
        </div>
      </HeroVideo>

      <Marquee label="Trusted on 1,400 farms across the UK" names={['Halden Farms', 'Northfield Grain', 'Wexcombe Estate', 'Brackenridge Co-op', 'Lowmoor Growers', 'Ashby Fen', 'Tellisford Dairy', 'Corran Arable']} />

      <section className={k.section} id="product">
        <div className={k.wrap}>
          <SectionHead eyebrow="Product" title={<>One map. <em>Every</em> morning.</>} sub="Each square is 3 metres of crop. Blue is water in the leaf, amber is the first sign of thirst. By 7am the map has been turned into one sentence." id="product-anchor" />
          <Reveal>
            <Window title="Perihelion · Hilltop Farm · Thu 13 Nov, 06:00" className={s.app}>
              <div className={s.appGrid}>
                <aside className={s.side}>
                  <span className={s.sideHead}>Fields by risk</span>
                  {FIELDS.map((f) => (
                    <div key={f.n} className={`${s.fieldRow} ${f.hot ? s.fieldHot : ''}`}>
                      <div><b>{f.n}</b><small>{f.a}</small></div>
                      <div className={s.fieldRight}><span className={s.delta}>{f.d}</span><em>{f.st}</em></div>
                    </div>
                  ))}
                  <div className={s.legend} aria-hidden><span>Parched</span><i>{Array.from({ length: 10 }, (_, v) => <b key={v} style={{ background: tone(v) }} />)}</i><span>Wet</span></div>
                </aside>
                <div className={s.mapPane}>
                  <div className={s.grid} role="img" aria-label="Moisture map of North 40: the eastern edge is dry, the west is well watered">
                    {FIELD.map((row, y) => row.split('').map((v, x) => <span key={`${x}-${y}`} style={{ background: tone(Number(v)), animationDelay: `${(x + y) * 60}ms` }} />))}
                  </div>
                  <div className={s.pin}><b>North 40 · east edge</b><span>Moisture down 23% in 3 days</span></div>
                  <div className={s.sms}><span>Perihelion · 06:58</span><p>North 40: dry patch spreading east, irrigate within 48h. Everything else fine.</p></div>
                </div>
              </div>
            </Window>
          </Reveal>
        </div>
      </section>

      <section className={`${k.section} ${k.alt}`}>
        <Companions spots={[{ src: sp('satellite'), top: '4%', right: '3%', size: 140, rotate: -10 }]} />
        <div className={k.wrap}>
          <SectionHead eyebrow="Why it works" title={<>Light tells you <em>days</em> before leaves do.</>} />
          <div className={k.bento}>
            <Reveal className={k.span4}>
              <Spotlight>
                <div className={k.cell}>
                  <h3>Stress shows up in the light first</h3>
                  <p>Near-infrared and short-wave bands drop as leaf water falls, long before the green fades. Perihelion watches that curve and calls it early.</p>
                  <div className={k.cellVisual}>
                    <svg viewBox="0 0 600 170" className={s.curve} aria-label="Chart: leaf water falls on day 1, Perihelion alerts on day 2, stress becomes visible on day 7">
                      <defs><linearGradient id="phc" x1="0" x2="1"><stop offset="0" stopColor="#4f7a5a" /><stop offset="1" stopColor="#F2A65A" /></linearGradient></defs>
                      <path d="M0 40 C 120 42, 200 60, 300 95 S 480 150, 600 158" stroke="url(#phc)" strokeWidth="3" fill="none" className={s.curveLine} />
                      <line x1="120" x2="120" y1="10" y2="165" className={s.mark1} /><text x="128" y="22">Perihelion alert · day 2</text>
                      <line x1="470" x2="470" y1="10" y2="165" className={s.mark2} /><text x="478" y="22">Visible · day 7</text>
                    </svg>
                  </div>
                </div>
              </Spotlight>
            </Reveal>
            <Reveal className={k.span2} delay={80}>
              <Spotlight>
                <div className={k.cell}>
                  <h3>Three bands, every pass</h3>
                  <p>NIR, SWIR and thermal, read together so cloud and dew don’t fool it.</p>
                  <div className={`${k.cellVisual} ${s.bands}`}>{[['NIR', 86], ['SWIR', 64], ['Thermal', 72]].map(([n, v]) => <div key={n as string}><span>{n}</span><i style={{ width: `${v}%` }} /></div>)}</div>
                </div>
              </Spotlight>
            </Reveal>
            <Reveal className={k.span2}>
              <Spotlight><div className={k.cell}><h3>No kit to install</h3><p>No probes, hubs or drones. If you can see the sky, we can see your field.</p><div className={`${k.cellVisual} ${s.bigNum}`}>0<small>devices</small></div></div></Spotlight>
            </Reveal>
            <Reveal className={k.span2} delay={60}>
              <Spotlight><div className={k.cell}><h3>Your agronomist, invited</h3><p>Free viewer seats. Notes pin to the exact patch they walked.</p><div className={`${k.cellVisual} ${s.note}`}><b>R. Okoye · agronomist</b><span>Walked it Tues. Wilting under the hedge line, agree with the map.</span></div></div></Spotlight>
            </Reveal>
            <Reveal className={k.span2} delay={120}>
              <Spotlight><div className={k.cell}><h3>Straight to the pivot</h3><p>Export each morning’s zones to your irrigation controller in one tap.</p><div className={`${k.cellVisual} ${s.zones}`}>{['Z1 18mm', 'Z2 12mm', 'Z3 0mm', 'Z4 6mm'].map((z) => <span key={z}>{z}</span>)}</div></div></Spotlight>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={k.section}>
        <div className={k.wrap}>
          <div className={k.stats}>
            <div className={k.stat}><b><CountUp to={18} suffix="%" /></b><span>less water used on pilot farms</span></div>
            <div className={k.stat}><b><CountUp to={5.2} decimals={1} /></b><span>days’ warning before stress is visible</span></div>
            <div className={k.stat}><b><CountUp to={1400} /></b><span>farms read every morning</span></div>
            <div className={k.stat}><b><CountUp to={31} />/34</b><span>stress patches flagged in the winter pilot</span></div>
          </div>
        </div>
      </section>

      <section className={`${k.section} ${k.alt}`} id="how-it-works">
        <div className={k.wrap}>
          <SectionHead eyebrow="How it works" title={<>Set up in four minutes. <em>Read</em> it in four seconds.</>} />
          <div className={s.steps}>
            {[['01', 'Draw your boundaries', 'Trace each field, or import your RPA shapefile. About four minutes for 200 acres.'], ['02', 'We read the light at dawn', 'Three bands, every field, every morning. Cloud gaps are filled with radar moisture.'], ['03', 'One line by 7am', '“North 40: dry patch spreading east, irrigate within 48h.” Open the map only if you want to.']].map(([n, h, p], i) => (
              <Reveal key={n} delay={i * 100} className={s.step}><span>{n}</span><h3>{h}</h3><p>{p}</p></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={k.section}>
        <div className={k.wrap}>
          <SectionHead eyebrow="Growers" title={<>Read over <em>breakfast</em>.</>} />
          <Quotes items={[
            { text: 'The text comes in while I’m making tea. Last July it told me the clay field was going before I could see a single yellow leaf. That one message paid for the year.', name: 'Tom Hadley', role: '160 ac barley and beans, Wiltshire' },
            { text: 'We stopped watering the whole block and started watering the strips that needed it. Our abstraction licence goes a lot further now.', name: 'Priya Malhotra', role: 'Salad grower, Lincolnshire' },
            { text: 'I was sceptical about anything from space. Then it matched my probe readings to within a couple of percent, without the probes.', name: 'Gareth Pryce', role: '420 ac mixed, Herefordshire' },
            { text: 'My agronomist and I look at the same map now. Half our phone calls disappeared.', name: 'Ellen Shaw', role: 'Potatoes, Norfolk' },
            { text: 'Set up in the time it took the kettle to boil. I didn’t believe the 4 minutes until I did it.', name: 'Joe Mercer', role: '95 ac market garden, Kent' },
            { text: 'It ranks the fields every morning. My first job of the day is always the right one.', name: 'Ruth Abernethy', role: 'Arable co-op manager, Fife' },
          ]} />
        </div>
      </section>

      <section className={`${k.section} ${k.alt}`} id="pricing">
        <Companions spots={[{ src: sp('wheat'), top: '6%', left: '3%', size: 120, rotate: -8 }]} />
        <div className={k.wrap}>
          <SectionHead eyebrow="Pricing" title={<>Priced per acre. <em>Billed</em> by the season.</>} sub="Start free on your smallest fields. Upgrade when the first text pays for itself." />
          <Pricing plans={[
            { name: 'Smallholding', price: '£0', per: 'up to 25 acres', blurb: 'For trying it on one field this season.', features: ['Weekly moisture map', 'Email alerts', 'One user'], cta: 'Start free' },
            { name: 'Family farm', price: '£1.80', per: 'per acre / season', blurb: 'Daily maps and 7am texts for up to 500 acres.', features: ['Daily map at 06:00', 'Text alerts by 7am', 'Three seasons of history', 'Free agronomist seats', 'Irrigation zone export'], featured: true, cta: 'Start the season' },
            { name: 'Co-operative', price: 'Custom', blurb: 'Shared view across members and estates.', features: ['Everything in Family farm', 'Member and estate roll-ups', 'API and data export', 'Named support'], cta: 'Talk to us' },
          ]} />
        </div>
      </section>

      <section className={k.section} id="faq">
        <div className={k.wrap}>
          <SectionHead eyebrow="FAQ" title={<>Questions, <em>answered</em>.</>} />
          <Faq items={[
            ['What if it’s cloudy?', 'Thermal and short-wave bands see through thin cloud. On a fully overcast morning we fill gaps with radar moisture and mark the map as lower confidence.'],
            ['Do I need any kit on the farm?', 'No probes, hubs or drones. A phone that gets texts is all you need.'],
            ['How accurate is it?', 'In our winter pilot the map flagged 31 of 34 stress patches that agronomists later confirmed on foot, an average of five days before they showed.'],
            ['Can my agronomist see it?', 'Yes. Add them as a free viewer. They see the same map and can pin notes to any patch.'],
          ]} />
        </div>
      </section>

      <Closing video="/landers/heroes/perihelion.mp4" poster="/landers/heroes/perihelion.jpg" title={<>The next dry patch is already on its way. <em>See it first.</em></>} sub="Free up to 25 acres. No card, no hardware." cta="Map my fields free" />
      <Footer brand={<><span className={s.mark} aria-hidden />Perihelion</>} cols={[['Product', ['Moisture map', 'Morning texts', 'Irrigation export', 'Agronomist seats']], ['Company', ['About', 'Field trials', 'Careers']], ['Help', ['Set-up guide', 'Contact', 'Status']]]} />
      <div className={k.grain} aria-hidden />
    </div>
  )
}
