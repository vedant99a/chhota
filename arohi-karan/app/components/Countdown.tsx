'use client'

import { useEffect, useState } from 'react'
import Section, { Reveal } from './Section'
import { COUNTDOWN_TARGET } from '../data'
import { assetUrl, hasAsset } from '../assets'

const TARGET = new Date(COUNTDOWN_TARGET).getTime()
const COLUMN = '/assets/ornament/floral-column.png'

const units = ['Days', 'Hours', 'Minutes', 'Seconds'] as const

function remaining() {
  const ms = Math.max(0, TARGET - Date.now())
  return [
    Math.floor(ms / 86400000),
    Math.floor(ms / 3600000) % 24,
    Math.floor(ms / 60000) % 60,
    Math.floor(ms / 1000) % 60,
  ]
}

export default function Countdown() {
  // Null until the first client tick, so SSR and first paint both render
  // middle dots and there is no hydration mismatch.
  const [values, setValues] = useState<number[] | null>(null)

  useEffect(() => {
    setValues(remaining())
    const id = setInterval(() => setValues(remaining()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <Section style={{ position: 'relative', padding: '7rem 1.5rem', textAlign: 'center' }}>
      {hasAsset(COLUMN) && (
        <>
          <img src={assetUrl(COLUMN)} alt="" aria-hidden="true" className="ornament"
            style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', height: '60%', opacity: 0.45 }} />
          <img src={assetUrl(COLUMN)} alt="" aria-hidden="true" className="ornament"
            style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%) scaleX(-1)', height: '60%', opacity: 0.45 }} />
        </>
      )}

      <Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            maxWidth: 620,
            margin: '0 auto',
          }}
        >
          {units.map((unit, i) => (
            <div
              key={unit}
              style={{
                padding: '0 0.5rem',
                borderLeft: i === 0 ? 'none' : '1px solid var(--border)',
              }}
            >
              <div
                className="display"
                style={{ color: 'var(--ink)', fontSize: 'clamp(1.8rem, 5vw, 3.4rem)', lineHeight: 1.1 }}
              >
                {values ? String(values[i]).padStart(2, '0') : '·'}
              </div>
              <div
                style={{
                  marginTop: '0.6rem',
                  fontSize: '0.6rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'var(--dim)',
                }}
              >
                {unit}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal as="p" className="label" style={{ marginTop: '3rem' }}>
        We&rsquo;re getting married
      </Reveal>
      <Reveal
        as="p"
        className="script"
        style={{ marginTop: '0.8rem', color: 'var(--umber)', fontSize: 'clamp(1.1rem, 3vw, 1.6rem)' }}
      >
        and we can&rsquo;t wait to celebrate with you
      </Reveal>
    </Section>
  )
}
