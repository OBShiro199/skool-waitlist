/** A short confetti burst from a point on screen. No dependencies; skipped with reduced motion. */
export function confetti(originX = innerWidth / 2, originY = innerHeight / 2) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '200' })
  document.body.appendChild(canvas)
  const dpr = Math.min(devicePixelRatio || 1, 2)
  canvas.width = innerWidth * dpr
  canvas.height = innerHeight * dpr
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)

  // the site's tag hues
  const colors = ['#5f86e0', '#8faeec', '#14a096', '#27a644', '#d18b0f', '#e25c80']
  const pieces = Array.from({ length: 140 }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9
    const speed = 7 + Math.random() * 9
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      w: 5 + Math.random() * 5,
      h: 8 + Math.random() * 6,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }
  })

  const start = performance.now()
  const frame = (t: number) => {
    const age = t - start
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    for (const p of pieces) {
      p.vy += 0.32
      p.vx *= 0.985
      p.vy *= 0.985
      p.x += p.vx
      p.y += p.vy
      p.r += p.vr
      ctx.save()
      ctx.globalAlpha = Math.max(0, 1 - age / 2600)
      ctx.translate(p.x, p.y)
      ctx.rotate(p.r)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)))
      ctx.restore()
    }
    if (age < 2600) requestAnimationFrame(frame)
    else canvas.remove()
  }
  requestAnimationFrame(frame)
}
