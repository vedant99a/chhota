import Section, { Reveal } from './Section'
import { VENUE } from '../data'

const mapsLink = `https://www.google.com/maps/search/?api=1&query=${VENUE.lat},${VENUE.lng}`
const embed = `https://www.google.com/maps?ll=${VENUE.lat},${VENUE.lng}&z=16&output=embed`

const link: React.CSSProperties = { color: 'var(--gold-deep)', textDecoration: 'underline', textUnderlineOffset: '3px' }

export default function Venue() {
  return (
    <Section style={{ padding: '6rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
      <Reveal as="p" className="label">The palace</Reveal>
      <Reveal
        as="h2"
        className="display"
        style={{ color: 'var(--ink)', fontSize: 'clamp(1.9rem, 5.5vw, 3.2rem)', letterSpacing: '0.1em', margin: '1rem 0 2rem' }}
      >
        The Raj Palace, Jaipur
      </Reveal>

      <div className="venue-grid">
        <div>
          <Reveal as="p" className="measure">{VENUE.address}</Reveal>
          <Reveal as="p" style={{ marginTop: '1.2rem' }}>
            <a href={VENUE.site} target="_blank" rel="noopener noreferrer" style={{ ...link, display: 'inline-block', minHeight: 44, lineHeight: '44px' }}>
              {VENUE.site}
            </a>
          </Reveal>
          <Reveal as="p" style={{ marginTop: '0.6rem' }}>
            <a href={`tel:${VENUE.tel}`} style={{ ...link, display: 'inline-block', minHeight: 44, lineHeight: '44px' }}>
              {VENUE.phone}
            </a>
          </Reveal>
          <Reveal as="p" className="measure" style={{ marginTop: '1.2rem' }}>
            About 12 km from Jaipur International Airport, roughly 30 minutes by road.
          </Reveal>
          <Reveal style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" style={{ ...link, display: 'inline-block', minHeight: 44, lineHeight: '44px' }}>
              Open in Google Maps
            </a>
            <a href="/arohi-karan.ics" download style={{ ...link, display: 'inline-block', minHeight: 44, lineHeight: '44px' }}>
              Add to calendar
            </a>
          </Reveal>
        </div>

        <Reveal>
          <div className="arch map-frame" style={{ border: '1px solid var(--border)', overflow: 'hidden' }}>
            <iframe
              loading="lazy"
              title="The Raj Palace on Google Maps"
              src={embed}
              style={{ width: '100%', height: '100%', border: 0 }}
            />
          </div>
        </Reveal>
      </div>

      <style>{`
        .venue-grid { display: grid; gap: 3rem; }
        .map-frame { height: 240px; }
        @media (min-width: 768px) {
          .venue-grid { grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
          .map-frame { height: 380px; }
        }
      `}</style>
    </Section>
  )
}
