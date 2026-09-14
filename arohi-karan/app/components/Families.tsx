import Section, { Reveal } from './Section'
import ArchImage from './ArchImage'
import { assetUrl, hasAsset } from '../assets'

const CREST = '/assets/ornament/crest.png'

export default function Families() {
  return (
    <Section style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
      <Reveal as="p" className="label">Our families</Reveal>
      <Reveal
        as="p"
        className="display"
        style={{ color: 'var(--ink)', fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', letterSpacing: '0.1em', margin: '1rem 0 3.5rem' }}
      >
        Two families, one celebration
      </Reveal>

      <Reveal>
        <div className="families-row">
          <div>
            <h3 className="label" style={{ marginBottom: '1.5rem' }}>The Dalwadis</h3>
            <ArchImage src="/assets/families/dalwadi.jpg" alt="The Dalwadi family" caption="Photograph to be added" sizes="(max-width: 767px) 70vw, 280px" style={{ maxWidth: 280, margin: '0 auto' }} />
          </div>

          <div style={{ display: 'grid', placeItems: 'center' }} aria-hidden="true">
            {hasAsset(CREST) ? (
              <img src={assetUrl(CREST)} alt="" className="ornament" style={{ width: 90 }} />
            ) : (
              <span style={{ display: 'block', width: 1, height: 80, background: 'var(--border)' }} />
            )}
          </div>

          <div>
            <h3 className="label" style={{ marginBottom: '1.5rem' }}>The Sharmas</h3>
            <ArchImage src="/assets/families/sharma.jpg" alt="The Sharma family" caption="Photograph to be added" sizes="(max-width: 767px) 70vw, 280px" style={{ maxWidth: 280, margin: '0 auto' }} />
          </div>
        </div>
      </Reveal>

      <style>{`
        .families-row { display: grid; gap: 2.5rem; justify-items: center; }
        @media (min-width: 768px) {
          .families-row { grid-template-columns: 1fr auto 1fr; align-items: center; gap: 3rem; }
        }
      `}</style>
    </Section>
  )
}
