import { newsreader as display, ibmPlexSans as body } from '../../_fonts/fonts'
import { HeroVideo } from '../../_components/HeroVideo'
import { Companions } from '../../_components/Companions'
import { DemoButton } from '../../_components/DemoButton'
import s from './perihelion.module.css'

const sp = (n: string) => `/landers/sprites/perihelion/${n}.webp`

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
        <Companions spots={[{ src: sp('wheat'), top: '10%', right: '4%', size: 130, rotate: 10 }, { src: sp('field-tile'), top: '68%', right: '18%', size: 110, rotate: -6 }]} />
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

      <footer className={s.footer}><span>Perihelion</span><span>A fictional startup from Lander Library</span></footer>
    </div>
  )
}
