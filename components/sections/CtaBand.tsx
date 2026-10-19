import { WaitlistForm } from '@/components/ui/WaitlistForm'

export function CtaBand({ label, title, location }: { label: string; title: string; location: string }) {
  return (
    <section className="section grid items-center gap-6 md:grid-cols-2 md:gap-12">
      <div>
        <p className="eyebrow">{label}</p>
        <h3 className="mt-2 text-20 md:text-24">{title}</h3>
      </div>
      <WaitlistForm location={location} />
    </section>
  )
}
