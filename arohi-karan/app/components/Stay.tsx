import Section, { Reveal } from './Section'
import ArchImage from './ArchImage'

export default function Stay() {
  return (
    <Section style={{ padding: '6rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
      <div className="split">
        <div>
          <Reveal as="p" className="label">Your stay</Reveal>
          <Reveal as="p" className="measure" style={{ marginTop: '1.5rem' }}>
            Every room is already booked, and it is on us. You are staying at The Raj Palace for the
            duration, from your arrival through to checkout on Thursday 4 February. Room details reach
            you closer to the date. Bring nothing but yourself, and a second pair of dancing shoes.
          </Reveal>
        </div>
        <Reveal>
          <ArchImage src="/assets/stay.jpg" alt="A palace suite at golden hour" ratio={4 / 3} sizes="(max-width: 767px) 90vw, 460px" />
        </Reveal>
      </div>
      <style>{`
        .split { display: grid; gap: 2.5rem; align-items: center; }
        @media (min-width: 768px) { .split { grid-template-columns: 1fr 1fr; gap: 4rem; } }
      `}</style>
    </Section>
  )
}
