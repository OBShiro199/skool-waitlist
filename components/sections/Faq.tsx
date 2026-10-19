'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { faq } from '@/content/faq'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { track } from '@/lib/track'

export function Faq() {
  const [open, setOpen] = useState<string | null>(faq[0].id)
  return (
    <section id="faq" className="section grid gap-8 md:grid-cols-[1fr_2fr] md:gap-12">
      <div>
        <Eyebrow idx="05">FAQ</Eyebrow>
        <h2 className="mt-3 text-24 md:text-32">Frequently asked questions.</h2>
      </div>
      <div className="border-t border-hairline">
        {faq.map((f) => {
          const isOpen = open === f.id
          return (
            <div key={f.id} className="border-b border-hairline">
              <h3>
                <button
                  type="button"
                  className="flex min-h-14 w-full cursor-pointer items-center gap-4 py-3 text-left text-16 font-medium text-ink"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${f.id}`}
                  onClick={() => {
                    setOpen(isOpen ? null : f.id)
                    if (!isOpen) track('faq_open', { question_id: f.id })
                  }}
                >
                  <span className="flex-1">{f.q}</span>
                  <Plus
                    size={16}
                    strokeWidth={1.5}
                    className={`flex-none text-muted transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
                    aria-hidden
                  />
                </button>
              </h3>
              <div id={`faq-${f.id}`} className="morph" data-open={isOpen} role="region">
                <div>
                  <p className="max-w-[65ch] pb-5 text-14 text-muted">{f.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
