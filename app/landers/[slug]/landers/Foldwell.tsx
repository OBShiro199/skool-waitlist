import { instrumentSerif } from '../../_fonts/fonts'
import { HeroVideo } from '../../_components/HeroVideo'
import { Companions } from '../../_components/Companions'
import k from '../../_kit/kit.module.css'
import { Buttons, Closing, CountUp, Faq, Footer, Headline, Marquee, Nav, Pill, Pricing, Quotes, Reveal, SectionHead, Spotlight, Window } from '../../_kit/kit'
import s from './foldwell.module.css'
import { FoldwellCalc } from './FoldwellCalc'

const sp = (n: string) => `/landers/sprites/foldwell/${n}.webp`
const INBOX: [string, string, string, string][] = [
  ['Stationers', 'Office costs', '£23.37', 'Today'], ['Rail ticket, Leeds', 'Travel', '£64.10', 'Yesterday'],
  ['Laptop stand', 'Equipment', '£39.99', '12 Mar'], ['Phone bill (60% work)', 'Phone', '£18.00', '10 Mar'], ['Co-working day pass', 'Premises', '£25.00', '8 Mar'],
]

export default function Foldwell() {
  return (
    <div className={`${k.root} ${s.theme} ${instrumentSerif.variable}`}>
      <Nav brand={<><span className={s.mark} aria-hidden />Foldwell</>} links={['Product', 'Calculator', 'Pricing', 'FAQ']} cta="Start free" />

      <HeroVideo src="/landers/heroes/foldwell.mp4" poster="/landers/heroes/foldwell.jpg" scrim="var(--hero-scrim)">
        <div className={k.heroInner}>
          <Pill>Making Tax Digital ready for April 2026</Pill>
          <Headline text="Snap receipts all year. | File in *ten minutes*." />
          <p className={k.lede}>Self-assessment for freelancers. Photograph the receipt when you get it; Foldwell sorts it, and in January your return is already filled in.</p>
          <Buttons primary="Start free" secondary="Try the calculator" />
          <div className={k.heroMeta}><span>Free until you file</span><span>Submitted to HMRC</span><span>£79 a year</span></div>
        </div>
      </HeroVideo>

      <Marquee label="Filed by 12,000 freelancers, including" names={['Copywriters', 'Illustrators', 'Developers', 'Photographers', 'Consultants', 'Translators', 'Video editors', 'Tutors']} />

      <section className={k.section} id="product">
        <Companions spots={[{ src: sp('red-boat'), top: '4%', right: '5%', size: 110, rotate: -8 }]} />
        <div className={k.wrap}>
          <SectionHead eyebrow="Product" title={<>Snap it at the till. <em>That’s the whole job.</em></>} sub="Point the camera at a receipt or forward the email it came in. Foldwell reads the shop, the date and the amount, picks the category and tells you in plain words whether it counts." />
          <Reveal>
            <Window title="Foldwell · Tax year 2025–26" className={s.app}>
              <div className={s.appGrid}>
                <div className={s.inbox}>
                  <div className={s.paneHead}><b>Receipts</b><span>147 sorted · 0 to check</span></div>
                  {INBOX.map(([n, c, a, d], i) => (
                    <div key={n} className={`${s.row} ${i === 0 ? s.rowNew : ''}`}>
                      <span className={s.rowIcon} aria-hidden>{n[0]}</span>
                      <div><b>{n}</b><small>{d}</small></div>
                      <span className={s.cat}>{c}</span>
                      <b className={s.amt}>{a}</b>
                    </div>
                  ))}
                </div>
                <div className={s.phone} aria-label="The app reading a receipt">
                  <div className={s.notch} />
                  <div className={s.receipt}><b>STATIONERS</b><span>14 Mar 2026 · 10:42</span><i /><p><span>A4 notebooks ×3</span><span>£14.97</span></p><p><span>Gel pens ×12</span><span>£8.40</span></p><p><span>Total</span><span>£23.37</span></p></div>
                  <div className={s.sorted}><span>Sorted as</span><b>Office costs</b><small>Allowable · saves about £6.08</small></div>
                </div>
                <div className={s.estimate}>
                  <span className={s.paneLabel}>Estimated tax for 2025–26</span>
                  <b className={s.owed}>£4,212</b>
                  <div className={s.split}><div><span>Income tax</span><b>£3,140</b></div><div><span>Class 4 NI</span><b>£1,072</b></div></div>
                  <div className={s.setAside}><div><span>Set aside so far</span><b>£3,600</b></div><div className={s.meter}><i style={{ width: '85%' }} /></div><small>85% of your bill · on track for 31 Jan</small></div>
                </div>
              </div>
            </Window>
          </Reveal>
        </div>
      </section>

      <section className={`${k.section} ${k.alt}`} id="calculator">
        <div className={k.wrap}>
          <SectionHead eyebrow="Calculator" title={<>What forgetting <em>costs you</em>.</>} sub="Most freelancers under-claim. Drag the slider to what you think slipped through last year." />
          <div className={k.bento}>
            <Reveal className={k.span3}><Spotlight className={s.calcCell}><FoldwellCalc /></Spotlight></Reveal>
            <Reveal className={k.span3} delay={80}><Spotlight><div className={k.cell}><h3>Where your expenses went</h3><p>Sorted into HMRC’s own categories, each explained in one sentence.</p>
              <div className={`${k.cellVisual} ${s.donutRow}`}><div className={s.donut} role="img" aria-label="Expenses: travel 34%, equipment 26%, premises 18%, phone 12%, other 10%" /><ul>{[['Travel', '34%', '#2F4A3A'], ['Equipment', '26%', '#8DA67B'], ['Premises', '18%', '#C2452D'], ['Phone', '12%', '#D9B77A'], ['Other', '10%', '#B9B3A3']].map(([n, v, c]) => <li key={n}><i style={{ background: c }} />{n}<b>{v}</b></li>)}</ul></div></div></Spotlight></Reveal>
            <Reveal className={k.span2}><Spotlight><div className={k.cell}><h3>Submitted to HMRC</h3><p>Through the same software route accountants use.</p><div className={`${k.cellVisual} ${s.hmrc}`}><span className={s.okDot} />Return accepted · ref 7741-2290</div></div></Spotlight></Reveal>
            <Reveal className={k.span2} delay={60}><Spotlight><div className={k.cell}><h3>Bank feeds</h3><p>Connect your business account and income is matched on its own.</p><div className={`${k.cellVisual} ${s.bank}`}><span>Invoice #212 · £1,800</span><b>Matched</b></div></div></Spotlight></Reveal>
            <Reveal className={k.span2} delay={120}><Spotlight><div className={k.cell}><h3>Six years of evidence</h3><p>Every receipt kept with its photo, in one export if HMRC ever asks.</p><div className={`${k.cellVisual} ${s.vault}`}>{['2021', '2022', '2023', '2024', '2025', '2026'].map((y) => <span key={y}>{y}</span>)}</div></div></Spotlight></Reveal>
          </div>
        </div>
      </section>

      <section className={k.section}>
        <div className={k.wrap}>
          <div className={k.stats}>
            <div className={k.stat}><b><CountUp to={1140} prefix="£" /></b><span>average expenses users had been forgetting</span></div>
            <div className={k.stat}><b><CountUp to={10} suffix=" min" /></b><span>median time to file in January</span></div>
            <div className={k.stat}><b><CountUp to={12000} /></b><span>freelancers filed with Foldwell</span></div>
            <div className={k.stat}><b>0</b><span>spreadsheets to keep</span></div>
          </div>
        </div>
      </section>

      <section className={`${k.section} ${k.alt}`} id="how-it-works">
        <Companions spots={[{ src: sp('house'), top: '6%', right: '5%', size: 120 }]} />
        <div className={k.wrap}>
          <SectionHead eyebrow="How it works" title={<>Your tax year, <em>folded flat</em>.</>} />
          <ol className={s.year}>
            {[['6 Apr', 'Tax year starts', 'Connect your bank. Foldwell starts sorting.'], ['July', 'First check-in', 'Two minutes: confirm what we sorted.'], ['October', 'Second check-in', 'We flag anything that looks personal.'], ['January', 'You file', 'Review the pre-filled return and submit.'], ['31 Jan', 'The deadline passes quietly', 'You filed weeks ago.']].map(([d, h, p], i) => (
              <Reveal key={d} as="li" delay={i * 80}><span>{d}</span><b>{h}</b><p>{p}</p></Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className={k.section}>
        <div className={k.wrap}>
          <SectionHead eyebrow="Freelancers" title={<>January used to be <em>the worst month</em>.</>} />
          <Quotes items={[
            { text: 'I used to spend the first two weekends of January in a shoebox of receipts. This year I filed on a Tuesday lunchtime.', name: 'Leah Morgan', role: 'Freelance illustrator' },
            { text: 'It found £900 of travel I’d never claimed. That paid for the next ten years of Foldwell.', name: 'Chris Adeyemi', role: 'Video editor' },
            { text: 'The quarterly check-in takes two minutes. I actually do it.', name: 'Hannah Clarke', role: 'Copywriter' },
            { text: 'Knowing how much to set aside each month changed how I sleep.', name: 'Ravi Shah', role: 'Software contractor' },
            { text: 'Plain English everywhere. I finally understand what I can claim.', name: 'Ella Fischer', role: 'Photographer' },
            { text: 'My accountant was going to charge £400. Foldwell was £79 and took ten minutes.', name: 'Jamie Doyle', role: 'Tutor' },
          ]} />
        </div>
      </section>

      <section className={`${k.section} ${k.alt}`} id="pricing">
        <div className={k.wrap}>
          <SectionHead eyebrow="Pricing" title={<>One plan. <em>Pay when you file.</em></>} sub="Use everything free all year. You only pay when your return is submitted." />
          <Pricing plans={[
            { name: 'Snap', price: '£0', per: 'all year', blurb: 'Sort receipts and track tax, no return.', features: ['Unlimited receipts', 'Bank feeds', 'Tax set-aside tracker'], cta: 'Start free' },
            { name: 'File', price: '£79', per: 'per tax year', blurb: 'Your return, pre-filled and submitted to HMRC.', features: ['Everything in Snap', 'Pre-filled return', 'Submitted to HMRC', 'Quarterly check-ins', 'Six-year evidence vault'], featured: true, cta: 'Start free, pay to file' },
            { name: 'File + review', price: '£199', per: 'per tax year', blurb: 'A chartered accountant checks it before it goes.', features: ['Everything in File', 'Accountant review', 'Help if HMRC asks questions'], cta: 'Add a review' },
          ]} />
        </div>
      </section>

      <section className={k.section} id="faq">
        <div className={k.wrap}>
          <SectionHead eyebrow="FAQ" title={<>Fair <em>questions</em>.</>} />
          <Faq items={[
            ['Is Foldwell recognised by HMRC?', 'Returns are submitted through HMRC’s software route, the same one accountants use. You get the HMRC receipt in the app.'],
            ['What if I’m also employed?', 'Add your P60 figures and Foldwell includes them, so your return shows the whole picture.'],
            ['What can I claim?', 'We sort into HMRC’s own expense categories and explain each in a sentence: travel, equipment, phone, a share of your home office and more.'],
            ['What happens if I’m investigated?', 'Every receipt is kept for six years with its photo, so you can hand over the evidence in one export.'],
          ]} />
        </div>
      </section>

      <Closing video="/landers/heroes/foldwell.mp4" poster="/landers/heroes/foldwell.jpg" title={<>Start snapping today. <em>File in January.</em></>} sub="Free until you file. Ten minutes when you do." cta="Start free" />
      <Footer brand={<><span className={s.mark} aria-hidden />Foldwell</>} cols={[['Product', ['Receipt capture', 'Bank feeds', 'Self-assessment', 'Calculator']], ['Learn', ['What can I claim?', 'Tax dates', 'Making Tax Digital']], ['Help', ['Contact', 'Security', 'Status']]]} />
      <div className={k.grain} aria-hidden />
    </div>
  )
}
