import Section, { Reveal } from './Section'
import { WARDROBE } from '../data'

export default function Wardrobe() {
  return (
    <Section style={{ padding: '6rem 0' }}>
      <div style={{ padding: '0 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal as="p" className="label">Wardrobe</Reveal>
        <Reveal
          as="h2"
          className="display"
          style={{ color: 'var(--ink)', fontSize: 'clamp(1.6rem, 4.5vw, 2.6rem)', letterSpacing: '0.1em', margin: '1rem 0 3rem' }}
        >
          What to wear, for every celebration
        </Reveal>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="snap-row wardrobe-row">
          {WARDROBE.map((w) => (
            <div
              key={w.event}
              className="arch"
              style={{
                background: 'var(--parchment)',
                border: '1px solid var(--border)',
                padding: '4rem 1.4rem 2rem',
                textAlign: 'center',
              }}
            >
              <h3 className="display" style={{ color: 'var(--ink)', fontSize: '1.15rem', letterSpacing: '0.08em' }}>
                {w.event}
              </h3>
              <p style={{ color: 'var(--gold-deep)', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0.9rem 0' }}>
                {w.code}
              </p>
              <p style={{ fontSize: '0.88rem' }}>{w.steer}</p>
            </div>
          ))}
        </div>
        <p className="swipe-hint-w">Swipe for more</p>
      </div>

      <style>{`
        .swipe-hint-w {
          color: var(--dim); font-size: 0.62rem; letter-spacing: 0.3em;
          text-transform: uppercase; text-align: center; margin-top: 1rem;
        }
        @media (min-width: 768px) {
          .swipe-hint-w { display: none; }
          .wardrobe-row { grid-template-columns: repeat(3, minmax(0, 1fr)); padding: 0 1.5rem; }
        }
      `}</style>
    </Section>
  )
}
