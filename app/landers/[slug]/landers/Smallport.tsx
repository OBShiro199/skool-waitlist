import { GeistMono } from 'geist/font/mono'
import { archivo } from '../../_fonts/fonts'
import { HeroVideo } from '../../_components/HeroVideo'
import { Companions } from '../../_components/Companions'
import k from '../../_kit/kit.module.css'
import { Buttons, Closing, CountUp, Faq, Footer, Headline, Marquee, Nav, Pill, Pricing, Quotes, Reveal, SectionHead, Spotlight, Window } from '../../_kit/kit'
import s from './smallport.module.css'

const sp = (n: string) => `/landers/sprites/smallport/${n}.webp`
const LOTS: [string, string, string, string, string, string][] = [
  ['SP-0412', 'Huila, CO', 'Washed Caturra', '18 × 60 kg', 'At sea', 'ETA 3 Dec'],
  ['SP-0413', 'Sidama, ET', 'Natural Heirloom', '12 × 60 kg', 'Customs', 'Cleared in ~2 days'],
  ['SP-0409', 'Cerrado, BR', 'Pulped natural', '30 × 60 kg', 'Warehouse', '22 sacks left'],
  ['SP-0415', 'Nyeri, KE', 'SL28 / SL34', '6 × 60 kg', 'Booked', 'Departs 9 Dec'],
]
const STOPS: [string, string, string, string][] = [['Origin', 'Huila', '12 Oct', 'done'], ['Port', 'Cartagena', '19 Oct', 'done'], ['At sea', 'Day 22 of 28', 'now', 'now'], ['Port', 'Felixstowe', 'ETA 3 Dec', ''], ['Roastery', 'Your store', '~6 Dec', '']]

export default function Smallport() {
  return (
    <div className={`${k.root} ${s.theme} ${archivo.variable} ${GeistMono.variable}`}>
      <Nav brand={<><span className={s.mark} aria-hidden />SMALLPORT</>} links={['Product', 'How it works', 'Pricing', 'FAQ']} cta="Track a lot" />

      <HeroVideo src="/landers/heroes/smallport.mp4" poster="/landers/heroes/smallport.jpg" scrim="var(--hero-scrim)">
        <div className={k.heroInner}>
          <Pill>Live vessel tracking for every lot</Pill>
          <Headline text="Know where every sack is. | From *origin* to roaster." />
          <p className={k.lede}>Green coffee tracking for independent roasters buying 1 to 50 containers a year. Lots, ships, customs and stock in one manifest.</p>
          <Buttons primary="Track my next lot" secondary="See a live manifest" />
          <div className={k.heroMeta}><span>Works with your importer</span><span>Landed cost per kilo</span><span>Days of cover</span></div>
        </div>
      </HeroVideo>

      <Marquee label="Roasting from origin with 450 roasters" names={['Dockside Roasters', 'Ember & Bean', 'Halfpenny Coffee', 'Northern Lot', 'Ferry Lane', 'Saltwater Roastery', 'Kettle Hill', 'Common Ground']} />

      <section className={k.section} id="product">
        <Companions spots={[{ src: sp('cargo-ship'), top: '2%', right: '3%', size: 170 }]} />
        <div className={k.wrap}>
          <SectionHead eyebrow="Product" title={<>Your lots, as <em>one manifest</em>.</>} sub="Forward the contracts, bills of lading and import docs. Smallport reads them, follows the ship, and tells you the day anything slips." />
          <Reveal>
            <Window title="Smallport · Manifest · 4 active lots" className={s.app}>
              <div className={s.table}>
                <div className={`${s.tr} ${s.thead}`}><span>Lot</span><span>Origin</span><span>Coffee</span><span>Qty</span><span>Status</span><span>Next</span></div>
                {LOTS.map((r) => <div key={r[0]} className={`${s.tr} ${r[0] === 'SP-0412' ? s.trActive : ''}`}>{r.map((c, i) => <span key={i} className={i === 4 ? s[`st_${c.replace(/\s/g, '')}`] : ''}>{c}</span>)}</div>)}
              </div>
              <div className={s.voyage}>
                <div className={s.voyageHead}><b>SP-0412 · live</b><span>MV Caribbean Wren · 18 sacks washed Caturra</span></div>
                <div className={s.route} role="img" aria-label="Voyage tracker: left origin and the port of loading, at sea on day 22 of 28">
                  <svg viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden><path d="M20 50 C 220 10, 420 10, 520 40 S 820 70, 980 30" className={s.track} /><path d="M20 50 C 220 10, 420 10, 520 40 S 820 70, 980 30" className={s.trackDone} /></svg>
                  {STOPS.map(([kind, n, d, st], i) => (
                    <div key={i} className={`${s.stop} ${st === 'done' ? s.stopDone : st === 'now' ? s.stopNow : ''}`} style={{ left: `${[2, 26, 52, 76, 98][i]}%` }}><i /><span>{kind}</span><b>{n}</b><small>{d}</small></div>
                  ))}
                </div>
              </div>
            </Window>
          </Reveal>
        </div>
      </section>

      <section className={`${k.section} ${k.alt}`} id="how-it-works">
        <div className={k.wrap}>
          <SectionHead eyebrow="How it works" title={<>From the farm gate <em>to your hopper</em>.</>} />
          <div className={k.bento}>
            <Reveal className={k.span3}><Spotlight><div className={k.cell}><h3>Days of cover, per coffee</h3><p>Log roasts against each lot and see when your bestseller runs dry, before it does.</p>
              <div className={`${k.cellVisual} ${s.cover}`}>{([['House espresso', 23, 'Reorder by 2 Dec'], ['Huila washed', 9, 'SP-0412 lands 3 Dec'], ['Sidama natural', 4, 'Customs, ~2 days'], ['Decaf', 31, 'Fine']] as const).map(([n, d, note]) => (
                <div key={n}><div className={s.coverHead}><b>{n}</b><span>{d} days</span></div><div className={s.coverBar}><i style={{ width: `${Math.min(100, (d / 35) * 100)}%` }} className={d < 7 ? s.low : d < 14 ? s.mid : ''} /></div><small>{note}</small></div>
              ))}</div></div></Spotlight></Reveal>
            <Reveal className={k.span3} delay={80}><Spotlight><div className={k.cell}><h3>Landed cost, per kilo</h3><p>Worked out from the invoice, freight bill and import entry. Updates if any of them change.</p>
              <div className={`${k.cellVisual} ${s.cost}`}>{([['Green coffee (FOB)', 6.2], ['Ocean freight', 0.38], ['Insurance', 0.05], ['Port, customs & haulage', 0.44], ['Warehouse to roastery', 0.21]] as const).map(([n, v]) => <div key={n}><span>{n}</span><b>£{v.toFixed(2)}</b></div>)}<div className={s.costTotal}><span>Landed at your door</span><b>£7.28</b></div></div></div></Spotlight></Reveal>
            <Reveal className={k.span2}><Spotlight><div className={k.cell}><h3>Paperwork, read for you</h3><p>Forward documents to your Smallport inbox.</p><div className={`${k.cellVisual} ${s.docs}`}>{['Bill of lading · SP-0412', 'Commercial invoice · SP-0413', 'Phyto certificate · SP-0413'].map((d) => <span key={d}>{d}</span>)}</div></div></Spotlight></Reveal>
            <Reveal className={k.span2} delay={60}><Spotlight><div className={k.cell}><h3>Delays, the day they happen</h3><p>A message when anything slips by more than two days.</p><div className={`${k.cellVisual} ${s.alert}`}><b>SP-0413 · +3 days</b><span>Port congestion at Djibouti. New ETA 11 Dec.</span></div></div></Spotlight></Reveal>
            <Reveal className={k.span2} delay={120}><Spotlight><div className={k.cell}><h3>Your importer, invited</h3><p>Share lots with your importer so documents land in the right place.</p><div className={`${k.cellVisual} ${s.share}`}><span>Atlas Green Imports</span><b>Viewer</b></div></div></Spotlight></Reveal>
          </div>
        </div>
      </section>

      <section className={k.section}>
        <div className={k.wrap}>
          <div className={k.stats}>
            <div className={k.stat}><b><CountUp to={450} /></b><span>roasters tracking lots</span></div>
            <div className={k.stat}><b><CountUp to={2} suffix=" days" /></b><span>delay threshold before we message you</span></div>
            <div className={k.stat}><b>£<CountUp to={7.28} decimals={2} /></b><span>landed per kilo, to the penny</span></div>
            <div className={k.stat}><b>0</b><span>spreadsheets of container numbers</span></div>
          </div>
        </div>
      </section>

      <section className={`${k.section} ${k.alt}`}>
        <Companions spots={[{ src: sp('crane'), top: '4%', right: '5%', size: 140 }, { src: sp('coffee-sacks'), top: '6%', left: '4%', size: 110 }]} />
        <div className={k.wrap}>
          <SectionHead eyebrow="Roasters" title={<>No more <em>“where’s my coffee?”</em> emails.</>} />
          <Quotes items={[
            { text: 'I used to email our importer every Monday asking where the containers were. Now I just open the manifest.', name: 'Ella Brennan', role: 'Founder, Dockside Roasters' },
            { text: 'Days of cover saved our house espresso twice this year. We reordered before we ran out, not after.', name: 'Kwame Asante', role: 'Head roaster, Ember & Bean' },
            { text: 'Landed cost per kilo used to take me an afternoon in a spreadsheet. Smallport just shows it.', name: 'Isla Morrison', role: 'Halfpenny Coffee' },
            { text: 'The delay alert told us about port congestion before our importer did.', name: 'Pedro Alves', role: 'Ferry Lane Coffee' },
            { text: 'We buy direct from three farms. Finally one place for every lot.', name: 'Hana Sato', role: 'Saltwater Roastery' },
            { text: 'Set up in an afternoon by forwarding a year of emails.', name: 'Rob Kerr', role: 'Northern Lot' },
          ]} />
        </div>
      </section>

      <section className={k.section} id="pricing">
        <div className={k.wrap}>
          <SectionHead eyebrow="Pricing" title={<>Less than <em>one sack</em> a month.</>} sub="14-day trial on every plan. Cancel any time." />
          <Pricing plans={[
            { name: 'Roastery', price: '£49', per: '/ month', blurb: 'Up to 12 lots a year, one warehouse.', features: ['Lot manifest', 'Vessel tracking', 'Roast logging', 'Days of cover'], cta: 'Start a trial' },
            { name: 'Importer desk', price: '£129', per: '/ month', blurb: 'Unlimited lots, three warehouses, team seats.', features: ['Everything in Roastery', 'Landed cost per kilo', 'Delay alerts', 'Importer sharing', 'Five team seats'], featured: true, cta: 'Start a trial' },
            { name: 'Collective', price: 'Custom', blurb: 'Shared buying across several roasteries.', features: ['Everything in Importer desk', 'Shared containers', 'Split costs per roaster', 'API access'], cta: 'Talk to us' },
          ]} />
        </div>
      </section>

      <section className={`${k.section} ${k.alt}`} id="faq">
        <div className={k.wrap}>
          <SectionHead eyebrow="FAQ" title={<>Questions, <em>cleared</em>.</>} />
          <Faq items={[
            ['Do I need to change how I buy?', 'No. Keep your importer and your contracts. Smallport reads the paperwork you already get and tracks from there.'],
            ['How does it know where the ship is?', 'From the vessel’s public position data and the port’s own status updates, matched to the bill of lading on your lot.'],
            ['Can my importer see it?', 'Invite them as a viewer. They see the lots you share and can upload documents straight to them.'],
            ['What about roast loss?', 'Set your average loss per coffee and days of cover is worked out from roasted, not green, weight.'],
          ]} />
        </div>
      </section>

      <Closing video="/landers/heroes/smallport.mp4" poster="/landers/heroes/smallport.jpg" title={<>Your next lot is <em>already on the water</em>.</>} sub="14 days free. Forward your first bill of lading today." cta="Track my next lot" />
      <Footer brand={<><span className={s.mark} aria-hidden />SMALLPORT</>} cols={[['Product', ['Manifest', 'Vessel tracking', 'Days of cover', 'Landed cost']], ['Roasters', ['Stories', 'Buying guides', 'Importers']], ['Help', ['Forwarding docs', 'Contact', 'Status']]]} />
      <div className={k.grain} aria-hidden />
    </div>
  )
}
