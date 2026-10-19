export function Eyebrow({ idx, children }: { idx: string; children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span className="idx">{idx}</span>
      <span aria-hidden>·</span>
      {children}
    </p>
  )
}
