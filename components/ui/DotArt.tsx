/** Dot-matrix illustration on a 4px grid. '.' ghost, 'o' faint, '#' blue, anything else empty. */
export function DotArt({ rows, cell = 6, className = '', label }: { rows: string[]; cell?: number; className?: string; label?: string }) {
  const w = Math.max(...rows.map((r) => r.length)) * cell
  const h = rows.length * cell
  const r = cell * 0.22
  const fill: Record<string, string> = { '.': 'var(--color-hairline)', o: 'var(--color-faint)', '#': 'var(--color-blue)' }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label}>
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          fill[ch] ? <circle key={`${x}-${y}`} cx={x * cell + cell / 2} cy={y * cell + cell / 2} r={r} fill={fill[ch]} /> : null,
        ),
      )}
    </svg>
  )
}

/** A staircase from $0 to the target, as dot rows. */
export function stairRows(cols = 48, height = 16, steps = 9, highlightLast = true): string[] {
  const grid = Array.from({ length: height }, () => Array(cols).fill('.'))
  for (let x = 0; x < cols; x++) {
    const step = Math.floor((x / cols) * steps)
    const top = height - 1 - Math.round(((step + 1) / steps) * (height - 2))
    for (let y = top; y < height; y++) grid[y][x] = highlightLast && step === steps - 1 ? '#' : 'o'
  }
  return grid.map((r) => r.join(''))
}
