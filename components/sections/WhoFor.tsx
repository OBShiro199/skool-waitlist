import { Eyebrow } from '@/components/ui/Eyebrow'

const rows = [
  ["You haven't started.", "You'll pick a validated idea in week 1 and ship it in week 2. No coding experience needed: if you can describe it, Claude can build it."],
  ["You've built, nobody's paying.", 'Week 3 is the outbound system that got me 500+ clients: lead lists, cold email, calls and closing.'],
  ["You're making some money.", 'Weeks 4 and 5 are growth, pricing, churn and building something you could sell.'],
]

export function WhoFor() {
  return (
    <section className="border-t border-hairline">
      <div className="px-4 pt-14 md:px-8 md:pt-20">
        <Eyebrow idx="03">Who it&apos;s for</Eyebrow>
      </div>
      <div className="mt-6 grid border-t border-hairline md:grid-cols-3">
        {rows.map(([h, p], i) => (
          <div key={h} className={`p-5 md:p-8 ${i < 2 ? 'border-hairline max-md:border-b md:border-r' : ''}`}>
            <h3 className="text-16">{h}</h3>
            <p className="mt-2 text-14 text-muted">{p}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
