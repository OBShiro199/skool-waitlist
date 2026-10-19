import { offer } from '@/content/offer'
import { Logo } from '@/components/ui/Logo'

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="rail min-h-screen">
      <div className="flex h-12 items-center border-b border-hairline px-4 md:px-8">
        <a href="/" className="flex items-center gap-2 text-14 font-medium text-ink">
          <Logo /> {offer.name}
        </a>
      </div>
      <article className="section mx-auto max-w-[720px] border-t-0 [&_h2]:mt-8 [&_h2]:text-20 [&_p]:mt-3 [&_p]:text-14 [&_li]:text-14 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        <h1 className="text-24 md:text-32">{title}</h1>
        {children}
      </article>
    </main>
  )
}
