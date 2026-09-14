import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Arohi & Karan · 2 February 2027 · Jaipur'

/**
 * The link is shared on WhatsApp constantly, so the preview card is rendered
 * here rather than depending on a photographic asset. Palette matches the page.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FBF6EC',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', width: 1120, height: 550, border: '2px solid #B08D4F', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', fontSize: 26, letterSpacing: 12, color: '#7F653D' }}>A · K</div>
            <div style={{ display: 'flex', width: 70, height: 1, background: '#B08D4F', margin: '26px 0 34px' }} />
            <div style={{ display: 'flex', fontSize: 86, letterSpacing: 14, color: '#3B2E23' }}>AROHI &amp; KARAN</div>
            <div style={{ display: 'flex', fontSize: 24, letterSpacing: 10, color: '#6E5C49', marginTop: 38 }}>
              2 &amp; 3 FEBRUARY 2027
            </div>
            <div style={{ display: 'flex', fontSize: 20, letterSpacing: 8, color: '#776654', marginTop: 18 }}>
              THE RAJ PALACE · JAIPUR
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
