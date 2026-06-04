import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') ?? 'CELLAVIVA'
  const sub   = searchParams.get('sub')   ?? 'Plant-Based Hair Care · Clinically Proven'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'flex-end',
          padding: '64px 72px',
          background: '#E7EFE4',
          position: 'relative',
        }}
      >
        {/* Background decorative circle */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 480, height: 480, borderRadius: '50%',
          background: '#98CBB0', opacity: 0.35,
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: 300,
          width: 260, height: 260, borderRadius: '50%',
          background: '#2E5B41', opacity: 0.12,
          display: 'flex',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: '#2E5B41',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 900, color: '#E7EFE4', fontFamily: 'serif',
          }}>C</div>
          <span style={{ fontSize: 26, fontWeight: 900, color: '#142718', letterSpacing: '-1px' }}>
            CELLA<span style={{ color: '#2E5B41' }}>VIVA</span>
          </span>
        </div>

        {/* Title */}
        <div style={{
          fontSize: 58, fontWeight: 900, color: '#142718',
          lineHeight: 1.1, marginBottom: 16,
          maxWidth: 750, letterSpacing: '-2px',
        }}>
          {title}
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 22, color: '#2E5B41', fontWeight: 600,
          opacity: 0.85,
        }}>
          {sub}
        </div>

        {/* Bottom tag */}
        <div style={{
          position: 'absolute', bottom: 56, right: 72,
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#2E5B41', borderRadius: 100,
          padding: '8px 20px',
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#E7EFE4', letterSpacing: '0.05em' }}>
            cellaviva.com
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
