import { youngSerif as display, figtree as body } from '../../_fonts/fonts'
import { HeroVideo } from '../../_components/HeroVideo'
import { Companions } from '../../_components/Companions'
import { DemoButton } from '../../_components/DemoButton'
import s from './proofbox.module.css'

const sp = (n: string) => `/landers/sprites/proofbox/${n}.webp`

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

      <footer className={s.footer}>Proofbox · A fictional startup from Lander Library</footer>
    </div>
  )
}
