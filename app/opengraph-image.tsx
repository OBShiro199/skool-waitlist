import { ImageResponse } from 'next/og'
import { offer, usd } from '@/content/offer'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = offer.name

export default function OgImage() {
  const steps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#fff', padding: 40 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #e6e6e9', padding: 64 }}>
          <div style={{ fontSize: 26, color: '#8a8f98' }}>{offer.name}</div>
          <div style={{ fontSize: 68, lineHeight: 1.05, letterSpacing: '-0.045em', color: '#08090a', maxWidth: 900 }}>
            Build and sell a profitable SaaS with AI. Watch me do it live.
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 26, color: '#62666d' }}>
              {`Founding price ${usd(offer.foundingMonthly)}/month · first ${offer.foundingSeats} members`}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
              {steps.map((s) => (
                <div key={s} style={{ width: 14, height: 10 + s * 9, background: s === 9 ? '#5f86e0' : '#e6e6e9' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
