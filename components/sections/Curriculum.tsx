'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { guides, weeks } from '@/content/curriculum'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { track } from '@/lib/track'

function Lessons({ week }: { week: (typeof weeks)[number] }) {
  return (
    <ol>
      {week.lessons.map((l, i) => (
        <li key={l} className="flex h-9 items-center gap-3 border-b border-divider text-13 last:border-b-0">
          <span className="num w-7 flex-none text-faint">
            {week.n}.{i + 1}
          </span>
          <span className="truncate text-body">{l}</span>
        </li>
      ))}
    </ol>
  )
}

export function Curriculum() {
  const [open, setOpen] = useState(1)

  return (
    <section id="curriculum" className="section">
      <Eyebrow idx="04">Curriculum</Eyebrow>
      <h2 className="mt-3 text-24 md:text-32">
        <span className="num">5</span> weeks · <span className="num">40</span> lessons · <span className="num">7</span> guides
      </h2>

      {/* desktop: five columns */}
      <div className="mt-10 hidden grid-cols-5 border border-hairline lg:grid">
        {weeks.map((w) => (
          <div key={w.n} className="border-hairline px-4 pb-2 pt-4 [&:not(:last-child)]:border-r">
            <p className="num text-13 text-faint">Week {w.n}</p>
            <h3 className="mt-1 text-16">{w.name}</h3>
            <p className="mt-1 min-h-[36px] text-13 text-muted">{w.outcome}</p>
            <div className="mt-3 border-t border-hairline">
              <Lessons week={w} />
            </div>
          </div>
        ))}
      </div>

      {/* tablet and mobile: accordion */}
      <div className="mt-8 border border-hairline lg:hidden">
        {weeks.map((w) => {
          const isOpen = open === w.n
          return (
            <div key={w.n} className="border-b border-hairline last:border-b-0">
              <h3>
                <button
                  type="button"
                  className="flex h-12 w-full cursor-pointer items-center gap-3 px-4 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`week-${w.n}`}
                  onClick={() => {
                    setOpen(isOpen ? 0 : w.n)
                    if (!isOpen) track('curriculum_open', { week: w.n })
                  }}
                >
                  <span className="text-14 font-medium text-ink">
                    Week {w.n} · {w.name}
                  </span>
                  <span className="ml-auto text-13 text-faint">8 lessons</span>
                  <Plus
                    size={16}
                    strokeWidth={1.5}
                    className={`text-muted transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
                    aria-hidden
                  />
                </button>
              </h3>
              <div id={`week-${w.n}`} className="morph" data-open={isOpen}>
                <div>
                  <div className="px-4 pb-3">
                    <p className="pb-2 text-13 text-muted">{w.outcome}</p>
                    <Lessons week={w} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_3fr]">
        <div>
          <p className="text-14 font-medium text-ink">Guides</p>
          <p className="text-13 text-faint">The stack in depth</p>
        </div>
        <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g, i) => (
            <li key={g} className="flex h-9 items-center gap-3 border-b border-divider text-13">
              <span className="num w-6 text-faint">G{i + 1}</span>
              <span className="truncate text-body">{g}</span>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-6 text-13 text-faint">
        Plus: the live $10K build, daily calls Monday to Friday, unlimited Q&amp;A, 10M+ leads and 20 clone-ready apps.
      </p>
    </section>
  )
}
