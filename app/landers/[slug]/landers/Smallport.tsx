import { Archivo, Archivo_Narrow } from 'next/font/google'
import { HeroVideo } from '../../_components/HeroVideo'
import { Companions } from '../../_components/Companions'
import { DemoButton } from '../../_components/DemoButton'
import s from './smallport.module.css'

const display = Archivo({ subsets: ['latin'], weight: ['500', '800'], variable: '--sp-display' })
const body = Archivo_Narrow({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--sp-body' })
const sp = (n: string) => `/landers/sprites/smallport/${n}.webp`

const MANIFEST = [
  ['SP-0412', 'Huila, CO', 'Washed Caturra', '18 × 60 kg', 'At sea', 'ETA 3 Dec'],
  ['SP-0413', 'Sidama, ET', 'Natural Heirloom', '12 × 60 kg', 'Customs', 'Cleared in ~2 days'],
  ['SP-0409', 'Cerrado, BR', 'Pulped natural', '30 × 60 kg', 'Warehouse', '22 sacks left'],
  ['SP-0415', 'Nyeri, KE', 'SL28 / SL34', '6 × 60 kg', 'Booked', 'Departs 9 Dec'],
]

export default function Smallport() {
  return (
    <div className={`${s.page} ${display.variable} ${body.variable}`}>
      <HeroVideo src="/landers/heroes/smallport.mp4" poster="/landers/heroes/smallport.jpg" scrim="linear-gradient(0deg, rgba(34,34,34,.78) 0%, rgba(34,34,34,.15) 45%, rgba(34,34,34,.35) 100%)">
        <div className={s.heroInner}>
          <div className={s.bar}><span>SMALLPORT</span><span>Shipping &amp; stock for roasters</span></div>
          <div className={s.headline}>
            <h1>Know where every sack is, from origin to roaster.</h1>
            <p>Green coffee tracking for independent roasters buying 1 to 50 containers a year.</p>
            <DemoButton className={s.cta}>Track my next lot</DemoButton>
          </div>
        </div>
      </HeroVideo>

      <section className={s.manifest}>
        <Companions spots={[{ src: sp('cargo-ship'), top: '2%', right: '4%', size: 170 }, { src: sp('container'), top: '74%', left: '2%', size: 110, rotate: -8 }]} />
        <h2>Your lots, as one manifest.</h2>
        <div className={s.table}>
          <div className={`${s.tr} ${s.thead}`}><span>Lot</span><span>Origin</span><span>Coffee</span><span>Qty</span><span>Status</span><span>Next</span></div>
          {MANIFEST.map((r) => <div key={r[0]} className={s.tr}>{r.map((c, i) => <span key={i}>{c}</span>)}</div>)}
        </div>
      </section>

      <section className={s.how}>
        <Companions spots={[{ src: sp('crane'), top: '6%', right: '6%', size: 150 }, { src: sp('truck'), top: '66%', right: '24%', size: 110 }]} />
        <h2>How it works</h2>
        <div className={s.cols}>
          <div><b>01 / Forward the paperwork</b><p>Send contracts, bills of lading and import docs to your Smallport inbox. We read the lot numbers, weights and dates.</p></div>
          <div><b>02 / Watch it cross</b><p>Vessel position, port delays and customs status update on their own. You get a message when anything slips by more than two days.</p></div>
          <div><b>03 / Roast from stock</b><p>Log roasts against each lot and see days of cover per coffee, so you reorder before the bestseller runs dry.</p></div>
        </div>
      </section>

      <section className={s.pricing}>
        <Companions spots={[{ src: sp('coffee-sacks'), top: '10%', right: '6%', size: 140 }]} />
        <h2>Pricing</h2>
        <div className={s.specs}>
          <div><span>Roastery</span><b>£49 / month</b><p>Up to 12 lots a year, one warehouse, roast logging.</p></div>
          <div><span>Importer desk</span><b>£129 / month</b><p>Unlimited lots, three warehouses, landed-cost per kilo, team seats.</p></div>
          <div><span>Who it’s for</span><b>Independent roasters</b><p>Buying direct or through an importer, from a few bags to a few containers.</p></div>
        </div>
        <DemoButton className={s.cta}>Start a 14-day trial</DemoButton>
      </section>

      <footer className={s.footer}><span>SMALLPORT</span><span>A fictional startup from Lander Library</span></footer>
    </div>
  )
}
