import { newsreader as display, ibmPlexSans as body } from '../../_fonts/fonts'
import { HeroVideo } from '../../_components/HeroVideo'
import { Companions } from '../../_components/Companions'
import { DemoButton } from '../../_components/DemoButton'
import s from './perihelion.module.css'

const sp = (n: string) => `/landers/sprites/perihelion/${n}.webp`

// moisture index per 3 m cell for a 200-acre farm at 06:00 (0 = parched, 9 = saturated)
const FIELD = [
  '7777766655', '7777665544', '6766554433', '6655443322', '7766554432',
  '8877665543', '8887766554', '8888776655',
]
const tone = (v: number) => ['#5a2b13', '#7a3a17', '#9a531f', '#b8742d', '#c99a4b', '#7f8f55', '#4f7a5a', '#346a63', '#25586a', '#1d4766'][v]
const FAQ = [
  ['What if it’s cloudy?', 'Thermal and short-wave bands see through thin cloud. On a fully overcast morning we fill the gap with radar moisture and tell you the map is a lower-confidence one.'],
  ['Do I need any kit on the farm?', 'No. No probes, no hub, no drone. If you have a phone that gets texts, you have everything.'],
  ['How accurate is it?', 'In our winter pilot the map flagged 31 of 34 stress patches that agronomists later confirmed on foot, an average of five days before they showed.'],
  ['Can my agronomist see it?', 'Yes. Add them as a viewer for free. They see the same map and can leave notes on any field.'],
]

export default function Perihelion() {
  return (
    <div className={`${s.page} ${display.variable} ${body.variable}`}>
      <HeroVideo src="/landers/heroes/perihelion.mp4" poster="/landers/heroes/perihelion.jpg" scrim="linear-gradient(180deg, rgba(5,7,11,.15) 0%, rgba(5,7,11,0) 40%, rgba(5,7,11,.82) 100%)">
        <div className={s.heroInner}>
          <span className={s.mark}>PERIHELION</span>
          <div className={s.title}>
            <h1>See thirst<br /><em>before it shows.</em></h1>
            <p>Satellite moisture maps for farms under 500 acres. Every field, every morning, before the crop wilts.</p>
            <DemoButton className={s.cta}>Map my fields free</DemoButton>
          </div>
          <dl className={s.specs}>
            <div><dt>Revisit</dt><dd>daily, 06:00</dd></div>
            <div><dt>Resolution</dt><dd>3 m per pixel</dd></div>
            <div><dt>Bands</dt><dd>NIR · SWIR · thermal</dd></div>
            <div><dt>Lead time</dt><dd>4–6 days before visible stress</dd></div>
          </dl>
        </div>
      </HeroVideo>

      <section className={s.how}>
        <Companions spots={[{ src: sp('satellite'), top: '8%', right: '6%', size: 150, rotate: -8 }, { src: sp('moon'), top: '62%', left: '3%', size: 90 }]} />
        <p className={s.eyebrow}>How it works</p>
        <h2>Three passes overhead. One message in your pocket.</h2>
        <ol className={s.steps}>
          <li><span>01</span><div><h3>Draw your boundaries once</h3><p>Trace each field on the map, or import your RPA shapefile. Takes about four minutes for a typical 200-acre farm.</p></div></li>
          <li><span>02</span><div><h3>We read the light at dawn</h3><p>Near-infrared and short-wave bands show leaf water days before the green fades. Thermal confirms what the leaves are hiding.</p></div></li>
          <li><span>03</span><div><h3>You get one line by 7am</h3><p>“North 40: dry patch spreading east, irrigate within 48h.” No dashboard to check unless you want to.</p></div></li>
        </ol>
      </section>

      <section className={s.benefits}>
        <Companions spots={[{ src: sp('wheat'), top: '58%', left: '6%', size: 130, rotate: 10 }, { src: sp('field-tile'), top: '76%', left: '24%', size: 100, rotate: -6 }]} />
        <div className={s.big}>
          <p className={s.eyebrow}>What changes</p>
          <h2>Water where it’s needed. Not where it’s easy.</h2>
        </div>
        <div className={s.list}>
          <article><b>18%</b><p>less water used on the farms in our winter pilot, from watering only the strips that needed it.</p></article>
          <article><b>4–6 days</b><p>of warning before stress is visible from the tractor seat.</p></article>
          <article><b>0 hardware</b><p>No probes to bury, no batteries to swap. If you can see the sky, we can see your field.</p></article>
          <article><b>Every field</b><p>ranked by risk each morning, so the first job of the day is always the right one.</p></article>
        </div>
      </section>

      <section className={s.map}>
        <div className={s.mapCopy}>
          <p className={s.eyebrow}>The morning map</p>
          <h2>Your farm, read cell by cell before breakfast.</h2>
          <p>Each square is 3 metres of crop. Blue is water in the leaf, amber is the first sign of thirst. The text that lands at 7am is the one sentence this map is trying to tell you.</p>
          <div className={s.legend} aria-hidden>
            <span>Parched</span>
            <i>{Array.from({ length: 10 }, (_, v) => <b key={v} style={{ background: tone(v) }} />)}</i>
            <span>Saturated</span>
          </div>
        </div>
        <div className={s.mapViz}>
          <div className={s.grid} role="img" aria-label="Moisture map of North 40: the eastern edge is dry and the western half is well watered">
            {FIELD.map((row, y) => row.split('').map((v, x) => <span key={`${x}-${y}`} style={{ background: tone(Number(v)) }} />))}
          </div>
          <div className={s.callout}><b>North 40 · east edge</b><span>Moisture down 23% in 3 days. Irrigate within 48h.</span></div>
          <div className={s.sms}>
            <span className={s.smsFrom}>Perihelion · 06:58</span>
            <p>North 40: dry patch spreading east, irrigate within 48h. Barn Meadow and Long Acre fine. Full map: peri.farm/m/4417</p>
          </div>
        </div>
      </section>

      <section className={s.compare}>
        <p className={s.eyebrow}>Against the alternatives</p>
        <h2>What it takes to know your fields.</h2>
        <div className={s.tableWrap}>
          <table>
            <thead><tr><th /><th>Soil probes</th><th>Drone survey</th><th className={s.us}>Perihelion</th></tr></thead>
            <tbody>
              <tr><th>Coverage</th><td>One point per probe</td><td>Whole farm, when flown</td><td className={s.us}>Every 3 m, every morning</td></tr>
              <tr><th>Set-up</th><td>A day of digging</td><td>A pilot and a dry, calm day</td><td className={s.us}>Four minutes on a map</td></tr>
              <tr><th>Warning before stress shows</th><td>1–2 days</td><td>Same day</td><td className={s.us}>4–6 days</td></tr>
              <tr><th>Cost for 200 acres</th><td>£2,400 up front</td><td>£180 per flight</td><td className={s.us}>£360 a season</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={s.voice}>
        <blockquote>
          <p>“The text comes in while I’m making tea. Last July it told me the clay field was going before I could see a single yellow leaf. That one message paid for the year.”</p>
          <footer>A grower in the pilot · 160 acres of barley and beans</footer>
        </blockquote>
      </section>

      <section className={s.pricing}>
        <Companions spots={[{ src: sp('sun-glint'), top: '6%', left: '6%', size: 120 }]} />
        <p className={s.eyebrow}>Pricing</p>
        <h2>Priced per acre, billed by the season.</h2>
        <div className={s.tiers}>
          <div><h3>Smallholding</h3><p className={s.price}>£0</p><p>Up to 25 acres. Weekly map, email alerts.</p></div>
          <div className={s.featured}><h3>Family farm</h3><p className={s.price}>£1.80<small> / acre / season</small></p><p>Up to 500 acres. Daily maps, 7am text alerts, three seasons of history.</p><DemoButton className={s.cta}>Start the season</DemoButton></div>
          <div><h3>Co-operative</h3><p className={s.price}>Talk to us</p><p>Shared view across members, agronomist seats and an export to your irrigation controller.</p></div>
        </div>
      </section>

      <section className={s.faq}>
        <p className={s.eyebrow}>Questions</p>
        <div className={s.faqList}>
          {FAQ.map(([q, a]) => (
            <details key={q}><summary>{q}</summary><p>{a}</p></details>
          ))}
        </div>
      </section>

      <section className={s.closing} style={{ backgroundImage: 'linear-gradient(180deg, rgba(5,7,11,.4), rgba(5,7,11,.9)), url(/landers/heroes/perihelion.jpg)' }}>
        <h2>The next dry patch is already on its way.<br /><em>See it first.</em></h2>
        <DemoButton className={s.cta}>Map my fields free</DemoButton>
        <p>Free up to 25 acres. No card, no hardware.</p>
      </section>

      <footer className={s.footer}><span>Perihelion</span><span>A fictional startup from Lander Library</span></footer>
    </div>
  )
}
