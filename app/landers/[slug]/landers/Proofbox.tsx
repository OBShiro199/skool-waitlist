import { youngSerif as display, figtree as body } from '../../_fonts/fonts'
import { HeroVideo } from '../../_components/HeroVideo'
import { Companions } from '../../_components/Companions'
import { DemoButton } from '../../_components/DemoButton'
import s from './proofbox.module.css'

const sp = (n: string) => `/landers/sprites/proofbox/${n}.webp`

const TICKET = [['Sourdough, white', 38, '+4'], ['Seeded rye', 14, '−2'], ['Croissant', 64, '+10'], ['Pain au chocolat', 40, '+6'], ['Cinnamon bun', 24, '+8'], ['Focaccia slab', 6, '0']]
// last week: baked vs sold (croissants)
const WEEK = [['Mon', 48, 41], ['Tue', 48, 39], ['Wed', 52, 50], ['Thu', 52, 52], ['Fri', 60, 60], ['Sat', 72, 72], ['Sun', 40, 33]]
const DAY = [
  ['04:00', 'The baker opens the app', 'The list was agreed at 3pm yesterday. No guessing in the dark.'],
  ['10:00', 'Croissants still on the shelf', 'Last month they were gone by 9:40. Now the 10 o’clock regulars get one.'],
  ['15:00', 'Tomorrow’s list arrives', 'Six weeks of tills, the forecast and the market calendar, turned into numbers.'],
  ['17:30', 'Close with 8 items left', 'Down from 41. Two loaves go to the food bank, the rest go home with the team.'],
]
const FAQ = [
  ['Which tills does it work with?', 'Most card readers and tills used by independent shops, plus a CSV upload if yours is older. Set-up takes about 15 minutes.'],
  ['What if I bake to order as well?', 'Standing and one-off orders sit on the same list, so the shelf plan and the orders never fight over the same dough.'],
  ['Does it handle new products?', 'For the first two weeks it borrows the pattern from your nearest product, then learns its own.'],
  ['Can I override it?', 'Always. Change any number and Proofbox learns from what you changed and what then sold.'],
]

export default function Proofbox() {
  return (
    <div className={`${s.page} ${display.variable} ${body.variable}`}>
      <div className={s.window}>
        <HeroVideo src="/landers/heroes/proofbox.mp4" poster="/landers/heroes/proofbox.jpg" className={s.hero} scrim="radial-gradient(ellipse at center, rgba(59,42,32,.55) 0%, rgba(59,42,32,.2) 55%, rgba(59,42,32,.45) 100%)">
          <div className={s.heroInner}>
            <span className={s.sign}>Proofbox</span>
            <h1>Bake what sells.<br />Sell out at closing, not at ten.</h1>
            <p>Tomorrow’s bake list, worked out from your last six weeks of tills, the weather and what’s on in town.</p>
            <DemoButton className={s.cta}>Plan tomorrow’s bake</DemoButton>
          </div>
        </HeroVideo>
      </div>

      <section className={s.how}>
        <Companions spots={[{ src: sp('croissant'), top: '4%', left: '4%', size: 140, rotate: -12 }, { src: sp('steam'), top: '12%', right: '6%', size: 110 }]} />
        <h2>How it works</h2>
        <div className={s.recipe}>
          <div><span>1</span><h3>Connect your till</h3><p>Works with the card reader you already have. We read what sold and what time it sold out.</p></div>
          <div><span>2</span><h3>Check the list at 3pm</h3><p>“Sourdough 38, croissants 64, cinnamon buns 24 (sunny Saturday, market on).” Change any number with a tap.</p></div>
          <div><span>3</span><h3>Order flour on Fridays</h3><p>Next week’s flour, butter and yeast, worked out from the plan and sent to your supplier as one order.</p></div>
        </div>
      </section>

      <section className={s.benefits}>
        <Companions spots={[{ src: sp('loaf'), top: '62%', left: '2%', size: 150, rotate: 8 }, { src: sp('rolling-pin'), top: '6%', right: '3%', size: 150, rotate: -18 }]} />
        <div className={s.lead}>
          <h2>Fewer empty shelves at 10am. Fewer loaves in the bin at 4pm.</h2>
        </div>
        <ul className={s.notes}>
          <li><b>Waste down by a third.</b> Our test bakery went from 41 unsold items a day to 26 in six weeks.</li>
          <li><b>Sell-outs moved to the afternoon.</b> The croissants that used to go by 9:40 now last until lunch.</li>
          <li><b>Rain and school holidays built in.</b> The plan drops when it’s wet and rises when the market is on.</li>
          <li><b>One screen for the whole team.</b> The 4am baker sees exactly what the 3pm manager agreed.</li>
        </ul>
      </section>

      <section className={s.ticketRow}>
        <Companions spots={[{ src: sp('croissant'), top: '70%', right: '4%', size: 120, rotate: 14 }]} />
        <div className={s.ticketCopy}>
          <h2>Tomorrow’s bake, on one ticket.</h2>
          <p>Each number comes with the reason behind it, so the 4am baker trusts it. Tap a line to change it; the ticket prints on the kitchen printer at 3pm.</p>
        </div>
        <div className={s.ticket} aria-label="Example bake ticket for Saturday">
          <div className={s.ticketHead}><b>PROOFBOX</b><span>Bake list · Sat 14 Dec</span></div>
          <p className={s.ticketWhy}>Sunny, 9°C · Christmas market on Fore St · last 6 Saturdays</p>
          {TICKET.map(([n, q, d]) => (
            <div key={n as string} className={s.ticketLine}><span>{n}</span><i /><b>{q}</b><small>{d}</small></div>
          ))}
          <div className={s.ticketFoot}><span>Flour needed</span><b>41.5 kg</b></div>
          <div className={s.tear} aria-hidden />
        </div>
      </section>

      <section className={s.chart}>
        <h2>Croissants, last week</h2>
        <p className={s.chartSub}>Baked against sold. The gap is what went in the bin.</p>
        <div className={s.bars} role="img" aria-label="Bar chart: baked versus sold croissants for each day; the gap is largest on Monday, Tuesday and Sunday">
          {WEEK.map(([d, baked, sold]) => (
            <div key={d as string} className={s.barCol}>
              <div className={s.barPair}>
                <span className={s.baked} style={{ height: `${(baked as number) * 3}px` }}><em>{baked}</em></span>
                <span className={s.sold} style={{ height: `${(sold as number) * 3}px` }}><em>{sold}</em></span>
              </div>
              <b>{d}</b>
            </div>
          ))}
        </div>
        <div className={s.key}><span><i className={s.baked} /> Baked</span><span><i className={s.sold} /> Sold</span></div>
      </section>

      <section className={s.day}>
        <Companions spots={[{ src: sp('steam'), top: '4%', left: '6%', size: 110 }]} />
        <h2>A day with Proofbox</h2>
        <ol className={s.timeline}>
          {DAY.map(([t, h, p]) => <li key={t}><time>{t}</time><div><h3>{h}</h3><p>{p}</p></div></li>)}
        </ol>
      </section>

      <section className={s.menu}>
        <Companions spots={[{ src: sp('oven'), top: '8%', right: '5%', size: 170 }]} />
        <div className={s.board}>
          <h2>Today’s prices</h2>
          <div className={s.item}><span>The Corner Shop</span><i /><b>£29 / month</b></div>
          <p>One oven, one site, up to 40 lines on the menu.</p>
          <div className={s.item}><span>The High Street</span><i /><b>£59 / month</b></div>
          <p>Up to three sites, supplier ordering, weather and events.</p>
          <div className={s.item}><span>Wholesale</span><i /><b>Ask at the counter</b></div>
          <p>Café accounts, standing orders and delivery runs.</p>
          <DemoButton className={s.cta}>Try it free for 30 days</DemoButton>
        </div>
      </section>

      <section className={s.faq}>
        <h2>Questions from bakers</h2>
        <div className={s.faqGrid}>
          {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
      </section>

      <section className={s.closing}>
        <Companions spots={[{ src: sp('loaf'), top: '20%', left: '8%', size: 150, rotate: -10 }, { src: sp('croissant'), top: '30%', right: '9%', size: 130, rotate: 12 }]} />
        <h2>Sell the last loaf at closing.</h2>
        <p>30 days free. Connect your till in 15 minutes.</p>
        <DemoButton className={s.cta}>Plan tomorrow’s bake</DemoButton>
      </section>

      <footer className={s.footer}>Proofbox · A fictional startup from Lander Library</footer>
    </div>
  )
}
