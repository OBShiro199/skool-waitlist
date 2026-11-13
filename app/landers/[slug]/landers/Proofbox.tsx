import { fraunces, inter } from '../../_fonts/fonts'
import { HeroVideo } from '../../_components/HeroVideo'
import { Companions } from '../../_components/Companions'
import k from '../../_kit/kit.module.css'
import { Buttons, Closing, CountUp, Faq, Footer, Headline, Marquee, Nav, Pill, Pricing, Quotes, Reveal, SectionHead, Spotlight, Window } from '../../_kit/kit'
import s from './proofbox.module.css'

const sp = (n: string) => `/landers/sprites/proofbox/${n}.webp`
const TICKET: [string, number, string][] = [['Sourdough, white', 38, '+4'], ['Seeded rye', 14, '−2'], ['Croissant', 64, '+10'], ['Pain au chocolat', 40, '+6'], ['Cinnamon bun', 24, '+8'], ['Focaccia slab', 6, '0']]
const WEEK: [string, number, number][] = [['Mon', 48, 41], ['Tue', 48, 39], ['Wed', 52, 50], ['Thu', 52, 52], ['Fri', 60, 60], ['Sat', 72, 72], ['Sun', 40, 33]]

export default function Proofbox() {
  return (
    <div className={`${k.root} ${s.theme} ${fraunces.variable} ${inter.variable}`}>
      <Nav brand={<><span className={s.mark} aria-hidden>P</span>Proofbox</>} links={['Product', 'How it works', 'Pricing', 'FAQ']} cta="Try it free" />

      <div className={s.window}>
        <HeroVideo src="/landers/heroes/proofbox.mp4" poster="/landers/heroes/proofbox.jpg" className={s.hero} scrim="var(--hero-scrim)">
          <div className={`${k.heroInner} ${k.heroCenter}`}>
            <Pill>Now with Christmas market forecasting</Pill>
            <Headline text="Bake what sells. | Sell out at *closing*, | not at ten." />
            <p className={k.lede}>Tomorrow’s bake list, worked out from six weeks of tills, the weather and what’s on in town. Ready at 3pm, trusted at 4am.</p>
            <Buttons primary="Plan tomorrow’s bake" secondary="See a sample ticket" />
          </div>
        </HeroVideo>
      </div>

      <Marquee label="Baking smarter in 600 independent bakeries" names={['Crumb & Co', 'Hearth Street', 'The Larder', 'Wildflour', 'Saltash Bread', 'Mill House', 'Rise & Shine', 'Kiln Bakehouse']} />

      <section className={k.section} id="product">
        <Companions spots={[{ src: sp('croissant'), top: '3%', left: '4%', size: 130, rotate: -14 }, { src: sp('steam'), top: '5%', right: '6%', size: 100 }]} />
        <div className={k.wrap}>
          <SectionHead eyebrow="Product" title={<>Tomorrow’s bake, on <em>one</em> ticket.</>} sub="Every number comes with the reason behind it, so the 4am baker trusts it. The ticket prints on the kitchen printer at 3pm." />
          <Reveal>
            <Window title="Proofbox · Hearth Street Bakery · Saturday plan" className={s.app}>
              <div className={s.appGrid}>
                <div className={s.ticket} aria-label="Example bake ticket for Saturday">
                  <div className={s.ticketHead}><b>PROOFBOX</b><span>Sat 14 Dec</span></div>
                  <p className={s.ticketWhy}>Sunny, 9°C · Christmas market on Fore St · based on the last 6 Saturdays</p>
                  {TICKET.map(([n, q, d]) => <div key={n} className={s.ticketLine}><span>{n}</span><i /><b>{q}</b><small>{d}</small></div>)}
                  <div className={s.ticketFoot}><span>Flour needed</span><b>41.5 kg</b></div>
                </div>
                <div className={s.chartPane}>
                  <div className={s.chartTop}><div><b>Croissants · last week</b><span>Baked against sold</span></div><span className={s.badge}>−37% waste</span></div>
                  <div className={s.bars} role="img" aria-label="Baked versus sold croissants by day">
                    {WEEK.map(([d, baked, sold], i) => (
                      <div key={d} className={s.barCol}>
                        <div className={s.barPair}>
                          <span className={s.baked} style={{ height: `${baked * 2.6}px`, animationDelay: `${i * 70}ms` }} />
                          <span className={s.sold} style={{ height: `${sold * 2.6}px`, animationDelay: `${i * 70 + 40}ms` }} />
                        </div>
                        <b>{d}</b>
                      </div>
                    ))}
                  </div>
                  <div className={s.key}><span><i className={s.baked} />Baked</span><span><i className={s.sold} />Sold</span><span className={s.sellout}>Sell-out moved from 9:40 to 12:15</span></div>
                </div>
              </div>
            </Window>
          </Reveal>
        </div>
      </section>

      <section className={`${k.section} ${k.alt}`}>
        <div className={k.wrap}>
          <SectionHead eyebrow="Inside the plan" title={<>It reads the <em>whole</em> town, not just your till.</>} />
          <div className={k.bento}>
            <Reveal className={k.span3}><Spotlight><div className={k.cell}><h3>Weather, markets and term dates</h3><p>Rain drops the plan, a market on Fore St lifts it. School holidays move the morning rush.</p><div className={`${k.cellVisual} ${s.chips}`}>{['☀ Sunny 9°C', 'Market on Fore St', 'Half term ends Mon', 'Payday Friday'].map((c) => <span key={c}>{c}</span>)}</div></div></Spotlight></Reveal>
            <Reveal className={k.span3} delay={80}><Spotlight><div className={k.cell}><h3>Flour orders, written for you</h3><p>Next week’s flour, butter and yeast, worked out from the plan and sent as one order on Friday.</p><div className={`${k.cellVisual} ${s.order}`}>{[['Strong white flour', '41.5 kg'], ['Butter (82%)', '12 kg'], ['Fresh yeast', '0.6 kg']].map(([a, b]) => <div key={a}><span>{a}</span><b>{b}</b></div>)}<button type="button">Send to supplier</button></div></div></Spotlight></Reveal>
            <Reveal className={k.span2}><Spotlight><div className={k.cell}><h3>Less in the bin</h3><p>From 41 unsold items a day to 26, in six weeks.</p><div className={`${k.cellVisual} ${s.big}`}>−37<small>%</small></div></div></Spotlight></Reveal>
            <Reveal className={k.span2} delay={60}><Spotlight><div className={k.cell}><h3>One screen, every shift</h3><p>The 4am baker sees exactly what the 3pm manager agreed.</p><div className={`${k.cellVisual} ${s.team}`}><span>MB</span><span>JT</span><span>AK</span><small>3 people on this plan</small></div></div></Spotlight></Reveal>
            <Reveal className={k.span2} delay={120}><Spotlight><div className={k.cell}><h3>Works with your till</h3><p>Card readers, most shop tills, or a CSV if yours is older. Set up in 15 minutes.</p><div className={`${k.cellVisual} ${s.connect}`}><i /><span>Till connected · 6 weeks imported</span></div></div></Spotlight></Reveal>
          </div>
        </div>
      </section>

      <section className={k.section}>
        <div className={k.wrap}>
          <div className={k.stats}>
            <div className={k.stat}><b><CountUp to={37} suffix="%" /></b><span>less waste in the first six weeks</span></div>
            <div className={k.stat}><b>12:15</b><span>new croissant sell-out time, up from 9:40</span></div>
            <div className={k.stat}><b><CountUp to={15} suffix=" min" /></b><span>to connect your till</span></div>
            <div className={k.stat}><b><CountUp to={600} /></b><span>bakeries planning with Proofbox</span></div>
          </div>
        </div>
      </section>

      <section className={`${k.section} ${k.alt}`} id="how-it-works">
        <Companions spots={[{ src: sp('rolling-pin'), top: '8%', right: '4%', size: 150, rotate: -16 }]} />
        <div className={k.wrap}>
          <SectionHead eyebrow="How it works" title={<>A day with <em>Proofbox</em>.</>} />
          <ol className={s.day}>
            {[['04:00', 'The baker opens the app', 'The list was agreed at 3pm yesterday. No guessing in the dark.'], ['10:00', 'Croissants still on the shelf', 'Last month they were gone by 9:40. Now the 10 o’clock regulars get one.'], ['15:00', 'Tomorrow’s list arrives', 'Six weeks of tills, the forecast and the market calendar, turned into numbers.'], ['17:30', 'Close with 8 items left', 'Down from 41. Two loaves go to the food bank, the rest go home with the team.']].map(([t, h, p], i) => (
              <Reveal key={t} as="li" delay={i * 90}><time>{t}</time><div><h3>{h}</h3><p>{p}</p></div></Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className={k.section}>
        <div className={k.wrap}>
          <SectionHead eyebrow="Bakers" title={<>Fewer empty shelves. <em>Fewer</em> loaves in the bin.</>} />
          <Quotes items={[
            { text: 'I used to bake on gut feel at four in the morning. Now the list is on the wall when I walk in, and I actually trust it.', name: 'Martha Bell', role: 'Owner, Hearth Street Bakery' },
            { text: 'Saturday croissants used to be gone before ten. We now sell the last one around lunch and bin almost nothing.', name: 'Jonah Tate', role: 'Head baker, Crumb & Co' },
            { text: 'The market-day bump is real. Proofbox caught it before I did.', name: 'Aisha Khan', role: 'Wildflour, two shops' },
            { text: 'The Friday flour order alone saves me an hour a week.', name: 'Dan Probert', role: 'Mill House' },
            { text: 'We cut our waste by more than a third in a month and a half. That’s real money for a shop our size.', name: 'Sofia Russo', role: 'Kiln Bakehouse' },
            { text: 'My night team and day team finally agree on numbers.', name: 'Ben Okafor', role: 'Rise & Shine, three sites' },
          ]} />
        </div>
      </section>

      <section className={`${k.section} ${k.alt}`} id="pricing">
        <Companions spots={[{ src: sp('oven'), top: '4%', right: '4%', size: 150 }]} />
        <div className={k.wrap}>
          <SectionHead eyebrow="Pricing" title={<>Less than a <em>tray</em> of croissants a week.</>} sub="30 days free on every plan. No card to start." />
          <Pricing plans={[
            { name: 'The Corner Shop', price: '£29', per: '/ month', blurb: 'One oven, one site, up to 40 lines.', features: ['Daily bake list at 3pm', 'Weather and events', 'Kitchen ticket printing'], cta: 'Start free' },
            { name: 'The High Street', price: '£59', per: '/ month', blurb: 'Up to three sites and supplier ordering.', features: ['Everything in Corner Shop', 'Friday supplier orders', 'Shared team screen', 'Waste reporting'], featured: true, cta: 'Start free' },
            { name: 'Wholesale', price: 'Custom', blurb: 'Café accounts, standing orders and delivery runs.', features: ['Standing order planning', 'Delivery run sheets', 'Named support'], cta: 'Ask at the counter' },
          ]} />
        </div>
      </section>

      <section className={k.section} id="faq">
        <div className={k.wrap}>
          <SectionHead eyebrow="FAQ" title={<>Questions from <em>bakers</em>.</>} />
          <Faq items={[
            ['Which tills does it work with?', 'Most card readers and tills used by independent shops, plus a CSV upload if yours is older. Set-up takes about 15 minutes.'],
            ['What if I bake to order as well?', 'Standing and one-off orders sit on the same list, so the shelf plan and the orders never fight over the same dough.'],
            ['Does it handle new products?', 'For the first two weeks it borrows the pattern from your nearest product, then learns its own.'],
            ['Can I override it?', 'Always. Change any number and Proofbox learns from what you changed and what then sold.'],
          ]} />
        </div>
      </section>

      <Closing video="/landers/heroes/proofbox.mp4" poster="/landers/heroes/proofbox.jpg" title={<>Sell the last loaf <em>at closing</em>.</>} sub="30 days free. Connect your till in 15 minutes." cta="Plan tomorrow’s bake" />
      <Footer brand={<><span className={s.mark} aria-hidden>P</span>Proofbox</>} cols={[['Product', ['Bake lists', 'Supplier orders', 'Waste reports', 'Team screen']], ['Bakers', ['Stories', 'Recipes for the plan', 'Community']], ['Help', ['Connect your till', 'Contact', 'Status']]]} />
      <div className={k.grain} aria-hidden />
    </div>
  )
}
