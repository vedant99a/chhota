import Section, { Reveal } from './Section'
import ArchImage from './ArchImage'
import { DAY_ONE, DAY_TWO, type Event } from '../data'

function Card({ event }: { event: Event }) {
  return (
    <article style={{ display: 'flex', flexDirection: 'column' }}>
      <ArchImage src={event.image} alt={event.name} ratio={3 / 4} sizes="(max-width: 767px) 82vw, 320px" />
      <div
        style={{
          background: 'var(--parchment)',
          border: '1px solid var(--border)',
          borderTop: 'none',
          padding: '1.6rem 1.4rem 1.8rem',
          flex: 1,
        }}
      >
        <h4 className="display" style={{ color: 'var(--ink)', fontWeight: 400, fontSize: '1.35rem', letterSpacing: '0.08em' }}>
          {event.name}
        </h4>
        <p style={{ color: 'var(--dim)', fontSize: '0.8rem', letterSpacing: '0.06em', marginTop: '0.5rem' }}>
          {event.time} · {event.venue}
        </p>
        {event.theme && (
          <p style={{ color: 'var(--gold-deep)', fontSize: '0.8rem', marginTop: '0.35rem' }}>Theme: {event.theme}</p>
        )}
        {event.dress.length > 0 && (
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0' }}>
            {event.dress.map((d) => (
              <li
                key={d}
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--umber)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  padding: '0.4rem 0.8rem',
                }}
              >
                {d}
              </li>
            ))}
          </ul>
        )}
        <p style={{ marginTop: '1rem', fontSize: '0.92rem' }}>{event.body}</p>
      </div>
    </article>
  )
}

function DayHeading({ day, date }: { day: string; date: string }) {
  return (
    <Reveal>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '0 0 2.5rem' }}>
        <div>
          <h3 className="display" style={{ color: 'var(--ink)', fontSize: 'clamp(1.3rem, 3.5vw, 2rem)', letterSpacing: '0.16em' }}>
            {day}
          </h3>
          <p style={{ color: 'var(--dim)', fontSize: '0.85rem', letterSpacing: '0.1em' }}>{date}</p>
        </div>
        <span style={{ flex: 1, height: 1, background: 'var(--gold)', opacity: 0.5 }} />
      </div>
    </Reveal>
  )
}

export default function Celebrations() {
  return (
    <Section style={{ padding: '6rem 0' }}>
      <div style={{ padding: '0 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal as="p" className="label">The celebrations</Reveal>
      </div>

      <div style={{ maxWidth: 1100, margin: '3rem auto 0' }}>
        <div style={{ padding: '0 1.5rem' }}>
          <DayHeading day="DAY ONE · TUESDAY" date="2 February 2027" />
        </div>
        <div className="snap-row cards-2">
          {DAY_ONE.map((e) => <Card key={e.slug} event={e} />)}
        </div>
        <p className="swipe-hint">Swipe for more</p>

        <div style={{ padding: '0 1.5rem', marginTop: '4.5rem' }}>
          <DayHeading day="DAY TWO · WEDNESDAY" date="3 February 2027" />
        </div>
        <div className="snap-row cards-4">
          {DAY_TWO.map((e) => <Card key={e.slug} event={e} />)}
        </div>
        <p className="swipe-hint">Swipe for more</p>

        <p style={{ textAlign: 'center', color: 'var(--dim)', letterSpacing: '0.16em', fontSize: '0.75rem', textTransform: 'uppercase', marginTop: '4rem' }}>
          Thursday 4 February · Checkout
        </p>
      </div>

      <style>{`
        .swipe-hint {
          color: var(--dim); font-size: 0.62rem; letter-spacing: 0.3em;
          text-transform: uppercase; text-align: center; margin-top: 1rem;
        }
        @media (min-width: 768px) {
          .swipe-hint { display: none; }
          .cards-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 0 1.5rem; }
          .cards-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); padding: 0 1.5rem; }
        }
      `}</style>
    </Section>
  )
}
