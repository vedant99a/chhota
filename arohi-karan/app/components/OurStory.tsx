import Section, { Reveal } from './Section'
import ArchImage from './ArchImage'

/* PLACEHOLDER COPY: these three paragraphs are stand ins and are awaiting
   Arohi and Karan's own words. Roughly 40 words each. */
const BEATS = [
  {
    numeral: 'I.',
    title: 'How We Met',
    body: 'A friend of a friend, a long table, and a conversation that outlasted everyone else in the room. Neither of them remembers who spoke first. Both remember staying until the restaurant turned the lights up.',
    photo: '/assets/couple/met.jpg',
  },
  {
    numeral: 'II.',
    title: 'The Question',
    body: 'It was meant to happen at sunset, on a terrace, with a speech. It happened instead on an ordinary Tuesday, in a kitchen, mid sentence. The speech was never delivered and has not been missed.',
    photo: '/assets/couple/question.jpg',
  },
  {
    numeral: 'III.',
    title: 'Forever, From Here',
    body: 'Two families who had never met now finish each other’s sentences. What began as a conversation between two people has become a much louder one. In February, it moves to Jaipur.',
    photo: '/assets/couple/forever.jpg',
  },
]

export default function OurStory() {
  return (
    <Section style={{ padding: '6rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
      <Reveal as="p" className="label">Our story</Reveal>
      <Reveal
        as="h2"
        className="display"
        style={{ color: 'var(--ink)', fontSize: 'clamp(1.8rem, 5vw, 3rem)', letterSpacing: '0.12em', margin: '1rem 0 3.5rem' }}
      >
        How We Got Here
      </Reveal>

      <div style={{ display: 'grid', gap: '4rem' }}>
        {BEATS.map((b) => (
          <Reveal key={b.numeral}>
            <div className="story-row">
              <ArchImage
                src={b.photo}
                alt={b.title}
                ratio={3 / 4}
                caption="Photograph to be added"
                sizes="(max-width: 767px) 70vw, 300px"
                style={{ maxWidth: 300 }}
              />
              <div>
                <h3 className="display" style={{ color: 'var(--ink)', fontSize: '1.5rem', letterSpacing: '0.12em' }}>
                  <span style={{ color: 'var(--gold-deep)' }}>{b.numeral}</span> {b.title}
                </h3>
                <p className="measure" style={{ marginTop: '1rem' }}>{b.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <style>{`
        .story-row { display: grid; gap: 2rem; align-items: center; }
        @media (min-width: 768px) {
          .story-row { grid-template-columns: 300px 1fr; gap: 3.5rem; }
        }
      `}</style>
    </Section>
  )
}
