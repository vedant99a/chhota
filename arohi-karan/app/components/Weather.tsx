import Section, { Reveal } from './Section'

/* Deliberately static. A forecast three months out is noise, and a failed API
   call on a wedding invitation is worse than a typical average. */
const PANELS = [
  { label: 'Daytime', temp: '24 to 26°C', body: 'Bright, dry and still. Made for a garden lunch.' },
  { label: 'After dark', temp: '9 to 12°C', body: 'It drops quickly once the sun goes. Bring a shawl, a jacket, something beautiful you can layer.' },
]

export default function Weather() {
  return (
    <Section style={{ padding: '6rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
      <Reveal as="p" className="label" style={{ textAlign: 'center' }}>What to expect</Reveal>

      <div className="weather-grid">
        {PANELS.map((p) => (
          <Reveal key={p.label}>
            <div
              className="arch"
              style={{
                background: 'var(--parchment)',
                border: '1px solid var(--border)',
                padding: '5rem 2rem 3rem',
                textAlign: 'center',
                height: '100%',
              }}
            >
              <p className="label">{p.label}</p>
              <p className="display" style={{ color: 'var(--ink)', fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', margin: '1rem 0' }}>
                {p.temp}
              </p>
              <p className="measure" style={{ margin: '0 auto', fontSize: '0.92rem' }}>{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal as="p" style={{ marginTop: '2.5rem', color: 'var(--dim)', fontSize: '0.85rem', textAlign: 'center', maxWidth: '62ch', marginInline: 'auto' }}>
        Early February in Jaipur is dry and clear, with around ten hours of sun and almost no chance of
        rain. These are typical averages, not a forecast.
      </Reveal>

      <style>{`
        .weather-grid { display: grid; gap: 2rem; margin-top: 3rem; }
        @media (min-width: 768px) { .weather-grid { grid-template-columns: 1fr 1fr; gap: 3rem; } }
      `}</style>
    </Section>
  )
}
