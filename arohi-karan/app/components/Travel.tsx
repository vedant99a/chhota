import Section, { Reveal } from './Section'
import ArchImage from './ArchImage'

export default function Travel() {
  return (
    <Section style={{ padding: '6rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
      <div className="split-r">
        <Reveal>
          <ArchImage src="/assets/travel.jpg" alt="A palace entrance at dawn" ratio={4 / 3} sizes="(max-width: 767px) 90vw, 460px" />
        </Reveal>
        <div>
          <Reveal as="p" className="label">Getting there</Reveal>
          <Reveal as="p" className="measure" style={{ marginTop: '1.5rem' }}>
            Fly into Jaipur International Airport, about thirty minutes from the palace gates. Share your
            arrival and departure flights in the form below and a car will be waiting at both ends. No
            taxis, no arrangements, nothing to think about.
          </Reveal>
          <Reveal as="p" style={{ marginTop: '1.5rem', color: 'var(--dim)', fontSize: '0.85rem' }}>
            Please send your flight details by 15 December 2026.
          </Reveal>
        </div>
      </div>
      <style>{`
        .split-r { display: grid; gap: 2.5rem; align-items: center; }
        @media (min-width: 768px) { .split-r { grid-template-columns: 1fr 1fr; gap: 4rem; } }
      `}</style>
    </Section>
  )
}
