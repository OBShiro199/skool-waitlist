import { Cormorant_Garamond, Karla } from 'next/font/google'
import { HeroVideo } from '../../_components/HeroVideo'
import { Companions } from '../../_components/Companions'
import { DemoButton } from '../../_components/DemoButton'
import s from './saltmarsh.module.css'

const display = Cormorant_Garamond({ subsets: ['latin'], style: ['normal', 'italic'], weight: ['400', '500'], variable: '--sm-display' })
const body = Karla({ subsets: ['latin'], weight: ['400', '500'], variable: '--sm-body' })
const sp = (n: string) => `/landers/sprites/saltmarsh/${n}.webp`

export default function Saltmarsh() {
  return (
    <div className={`${s.page} ${display.variable} ${body.variable}`}>
      <HeroVideo src="/landers/heroes/saltmarsh.mp4" poster="/landers/heroes/saltmarsh.jpg" className={s.hero} scrim="linear-gradient(180deg, rgba(244,239,230,.82) 0%, rgba(244,239,230,.35) 42%, rgba(244,239,230,0) 70%)">
        <div className={s.heroInner}>
          <span className={s.mark}>Saltmarsh</span>
          <h1><em>Every walk you take,</em><br /><em>painted into the year.</em></h1>
          <p>A walking journal that keeps your routes, notes and the odd sketch, then paints them into one map of your year.</p>
          <DemoButton className={s.cta}>Start this year’s map</DemoButton>
        </div>
      </HeroVideo>
      <div className={s.deckle} aria-hidden />

      <section className={s.how}>
        <Companions spots={[{ src: sp('egret'), top: '2%', right: '8%', size: 150 }, { src: sp('reeds'), top: '58%', left: '2%', size: 130 }]} />
        <h2><em>How a page fills itself</em></h2>
        <div className={s.columns}>
          <p><b>Walk as you always do.</b> Saltmarsh records the route quietly in the background, about 2% battery an hour. No streaks, no step counts in your face.</p>
          <p><b>Add a line, if you like.</b> “Curlews on the mud at low tide.” A photo, a pressed leaf scanned in, a pencil sketch. Or nothing at all.</p>
          <p><b>Watch the map grow.</b> Each route is laid down as a soft wash of colour. Paths you repeat get deeper, like paint going over the same stroke.</p>
        </div>
      </section>

      <section className={s.margin}>
        <Companions spots={[{ src: sp('shell'), top: '14%', right: '6%', size: 100, rotate: 12 }, { src: sp('rowing-boat'), top: '70%', right: '22%', size: 140 }]} />
        <h2><em>Notes in the margin</em></h2>
        <dl className={s.notes}>
          <div><dt>Private by default</dt><dd>Your routes stay on your phone unless you choose to print or share a page.</dd></div>
          <div><dt>A real print, once a year</dt><dd>Every December we send your year as one A2 print on 300gsm cold-press paper.</dd></div>
          <div><dt>Works offline</dt><dd>Out on the marsh with no signal, it keeps recording and catches up at home.</dd></div>
        </dl>
      </section>

      <section className={s.who}>
        <Companions spots={[{ src: sp('cloud'), top: '6%', left: '6%', size: 160 }]} />
        <h2><em>Who it’s for</em></h2>
        <p className={s.whoLead}>People who walk the same three paths and want to see the year they made out of them.</p>
        <div className={s.price}>
          <p><span>The journal</span> free, forever</p>
          <p><span>The yearly print</span> £36, posted in December</p>
        </div>
        <DemoButton className={s.cta}>Start this year’s map</DemoButton>
      </section>

      <footer className={s.footer}>Saltmarsh · <em>A fictional startup from Lander Library</em></footer>
    </div>
  )
}
