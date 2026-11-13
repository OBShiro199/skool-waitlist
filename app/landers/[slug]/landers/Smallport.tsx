import { archivo as display, archivoNarrow as body } from '../../_fonts/fonts'
import { HeroVideo } from '../../_components/HeroVideo'
import { Companions } from '../../_components/Companions'
import { DemoButton } from '../../_components/DemoButton'
import s from './smallport.module.css'

const sp = (n: string) => `/landers/sprites/smallport/${n}.webp`

const COVER = [['House espresso (Cerrado)', 23, 'Reorder by 2 Dec'], ['Huila washed', 9, 'SP-0412 lands 3 Dec'], ['Sidama natural', 4, 'Customs, ~2 days'], ['Decaf (sugarcane)', 31, 'Fine']] as const
const COST = [['Green coffee (FOB)', 6.2], ['Ocean freight', 0.38], ['Insurance', 0.05], ['Import duty', 0], ['Port, customs & haulage', 0.44], ['Warehouse to roastery', 0.21]] as const
const FAQ = [
  ['Do I need to change how I buy?', 'No. Keep your importer and your contracts. Smallport reads the paperwork you already get and tracks from there.'],
  ['How does it know where the ship is?', 'From the vessel’s public position data and the port’s own status updates, matched to the bill of lading on your lot.'],
  ['Can my importer see it?', 'Invite them as a viewer. They see the lots you share and can upload documents straight to them.'],
  ['What about roast loss?', 'Set your average loss per coffee and days of cover is worked out from roasted, not green, weight.'],
]

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

      <section className={s.voyage}>
        <h2>SP-0412, live.</h2>
        <p className={s.voyageSub}>18 sacks of washed Caturra, from a cooperative in Huila to your roastery.</p>
        <div className={s.route} role="img" aria-label="Voyage tracker: the shipment has left origin and the port of loading and is at sea, due in 6 days">
          <svg viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden>
            <path d="M20 90 C 220 20, 420 20, 520 70 S 820 110, 980 40" className={s.track} />
            <path d="M20 90 C 220 20, 420 20, 520 70 S 820 110, 980 40" className={s.trackDone} />
          </svg>
          {[['Origin', 'Huila', '12 Oct', 'done'], ['Port', 'Cartagena', '19 Oct', 'done'], ['At sea', 'Day 22 of 28', 'now', 'now'], ['Port', 'Felixstowe', 'ETA 3 Dec', ''], ['Roastery', 'Your store', '~6 Dec', '']].map(([k, n, d, st], i) => (
            <div key={i} className={`${s.stop} ${st === 'done' ? s.stopDone : st === 'now' ? s.stopNow : ''}`} style={{ left: `${[2, 26, 52, 76, 98][i]}%` }}>
              <i /><span>{k}</span><b>{n}</b><small>{d}</small>
            </div>
          ))}
        </div>
      </section>

      <section className={s.coverRow}>
        <Companions spots={[{ src: sp('coffee-sacks'), top: '8%', right: '4%', size: 120 }]} />
        <div className={s.cover}>
          <h2>Days of cover</h2>
          {COVER.map(([n, d, note]) => (
            <div key={n} className={s.coverLine}>
              <div className={s.coverHead}><b>{n}</b><span>{d} days</span></div>
              <div className={s.coverBar}><i style={{ width: `${Math.min(100, (d / 35) * 100)}%` }} className={d < 7 ? s.low : d < 14 ? s.mid : ''} /></div>
              <small>{note}</small>
            </div>
          ))}
        </div>
        <div className={s.cost}>
          <h2>Landed cost, per kilo</h2>
          <table>
            <tbody>
              {COST.map(([n, v]) => <tr key={n}><td>{n}</td><td>£{v.toFixed(2)}</td></tr>)}
            </tbody>
            <tfoot><tr><td>Landed at your door</td><td>£{COST.reduce((a, [, v]) => a + v, 0).toFixed(2)}</td></tr></tfoot>
          </table>
          <small className={s.costNote}>SP-0412, worked out from the invoice, freight bill and import entry. Updates if any of them change.</small>
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

      <section className={s.faq}>
        <h2>Questions</h2>
        <div className={s.faqGrid}>{FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
      </section>

      <section className={s.closing}>
        <Companions spots={[{ src: sp('cargo-ship'), top: '22%', right: '8%', size: 170 }, { src: sp('truck'), top: '18%', left: '6%', size: 110 }]} />
        <h2>Your next lot is already on the water.</h2>
        <DemoButton className={s.cta}>Track my next lot</DemoButton>
      </section>

      <footer className={s.footer}><span>SMALLPORT</span><span>A fictional startup from Lander Library</span></footer>
    </div>
  )
}
