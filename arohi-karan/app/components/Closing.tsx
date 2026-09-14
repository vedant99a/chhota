import Section, { Reveal } from './Section'
import { assetUrl, hasAsset } from '../assets'

const CLOSING = '/assets/closing.jpg'
const PEACOCK = '/assets/ornament/peacock.png'

export default function Closing() {
  return (
    <Section style={{ position: 'relative', padding: '8rem 1.5rem', textAlign: 'center', overflow: 'hidden' }}>
      {hasAsset(CLOSING) && (
        <div className="graded" style={{ position: 'absolute', inset: 0, opacity: 0.28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetUrl(CLOSING)} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      {/* Ivory scrim keeps the copy readable over the facade. */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'var(--ivory)', opacity: 0.72 }} />

      {hasAsset(PEACOCK) && (
        <img
          src={assetUrl(PEACOCK)}
          alt=""
          aria-hidden="true"
          className="ornament"
          style={{ position: 'absolute', left: '4%', bottom: 0, width: 180, opacity: 0.55 }}
        />
      )}

      <div style={{ position: 'relative' }}>
        <Reveal
          as="p"
          className="display"
          style={{
            color: 'var(--ink)',
            fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)',
            letterSpacing: '0.08em',
            lineHeight: 1.5,
            maxWidth: '20ch',
            margin: '0 auto',
          }}
        >
          We can&rsquo;t wait to start this new chapter with our favourite people.
        </Reveal>
        <Reveal
          as="p"
          className="script"
          style={{ color: 'var(--gold-deep)', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', marginTop: '2.5rem' }}
        >
          With love, Arohi &amp; Karan
        </Reveal>
      </div>
    </Section>
  )
}
