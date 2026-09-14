'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

/**
 * Image urls arrive as props, already resolved by the server. Importing the
 * asset map here would pull every image into the client bundle, and in the
 * single file build that means a second full base64 copy of all thirteen.
 */
export type HeroAssets = { hero: string | null; column: string | null; logo: string | null }

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
/** 0 below `from`, 1 above `to`, linear between. */
const ramp = (p: number, from: number, to: number) => clamp((p - from) / (to - from))

// The arch wrapper is laid out at its final full bleed size and scaled DOWN,
// so the whole reveal stays on the compositor. Base units below.
const BASE_W_VW = 132
const BASE_H_SVH = 128

export default function ScrollHero({ hero, column, logo }: HeroAssets) {
  const containerRef = useRef<HTMLDivElement>(null)
  const archRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const identityRef = useRef<HTMLDivElement>(null)
  const beat1Ref = useRef<HTMLDivElement>(null)
  const beat2Ref = useRef<HTMLDivElement>(null)
  const beat3Ref = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reduced) return

    let frame = 0
    const tick = () => {
      frame = requestAnimationFrame(tick)
      const el = containerRef.current
      if (!el) return

      // rAF with getBoundingClientRect. No scroll event listener anywhere.
      const { top } = el.getBoundingClientRect()
      const travel = el.offsetHeight - window.innerHeight
      const p = travel > 0 ? clamp(-top / travel) : 0

      // --- the reveal, progress 0 to 0.45, holding thereafter ---
      const open = clamp(p / 0.45)
      const startW = window.innerWidth < 768 ? 78 : 62
      const sx = lerp(startW, BASE_W_VW, open) / BASE_W_VW
      const sy = lerp(56, BASE_H_SVH, open) / BASE_H_SVH
      const imgScale = lerp(1.18, 1.0, open)

      if (archRef.current) {
        archRef.current.style.transform = `translate(-50%, -50%) scaleX(${sx}) scaleY(${sy})`
      }
      // Counter scale the stage so the photograph stays viewport sized and
      // undistorted while the arch window grows over it.
      if (stageRef.current) {
        stageRef.current.style.transform = `scaleX(${(1 / sx) * imgScale}) scaleY(${(1 / sy) * imgScale})`
      }

      // --- text beats ---
      if (identityRef.current) {
        const out = ramp(p, 0, 0.16)
        identityRef.current.style.opacity = String(1 - out)
        identityRef.current.style.transform = `translateY(${-40 * out}px)`
      }
      if (beat1Ref.current) {
        const inn = ramp(p, 0.22, 0.48)
        const out = ramp(p, 0.54, 0.67)
        beat1Ref.current.style.opacity = String(inn * (1 - out))
        beat1Ref.current.style.transform = `translateY(${24 * (1 - inn)}px)`
      }
      if (beat2Ref.current) {
        const inn = ramp(p, 0.67, 0.8)
        const out = ramp(p, 0.8, 0.88)
        beat2Ref.current.style.opacity = String(inn * (1 - out))
        beat2Ref.current.style.transform = `translateY(${24 * (1 - inn)}px)`
      }
      // Beat three arrives and holds at full opacity through the end.
      if (beat3Ref.current) {
        const inn = ramp(p, 0.84, 0.94)
        beat3Ref.current.style.opacity = String(inn)
        beat3Ref.current.style.transform = `translateY(${24 * (1 - inn)}px)`
        beat3Ref.current.style.pointerEvents = inn > 0.9 ? 'auto' : 'none'
      }
      if (backdropRef.current) {
        backdropRef.current.style.opacity = String(ramp(p, 0.82, 0.94))
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduced])

  // `reduced` starts false, so the rAF loop starts and can write one mid-scroll
  // frame after React has already rendered the reduced-motion state but before
  // the cleanup cancels it. Restore the final state explicitly once we know.
  useEffect(() => {
    if (!reduced) return
    archRef.current?.style.setProperty('transform', 'translate(-50%, -50%)')
    stageRef.current?.style.setProperty('transform', 'none')
    for (const r of [identityRef, beat3Ref, backdropRef]) {
      if (!r.current) continue
      r.current.style.opacity = '1'
      r.current.style.transform = 'none'
    }
    if (beat3Ref.current) beat3Ref.current.style.pointerEvents = 'auto'
  }, [reduced])

  const rise = (y: number, duration: number, delay: number) => ({
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay, ease: EASE_OUT },
  })

  const secondary: React.CSSProperties = {
    color: '#F2E8D8',
    fontWeight: 300,
    letterSpacing: '0.3em',
    fontSize: '0.68rem',
    textTransform: 'uppercase',
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        // Reduced motion gets a single static screen instead of a long scroll.
        height: reduced ? '100svh' : 'var(--hero-h)',
        touchAction: 'pan-y',
      }}
      className="hero-container"
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100svh',
          width: '100%',
          overflow: 'hidden',
          background: 'var(--ivory)',
        }}
      >
        {/* Botanical columns either side of the arch, desktop only. */}
        {column && (
          <>
            <img
              src={column}
              alt=""
              aria-hidden="true"
              className="ornament"
              style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', height: '78svh', opacity: 0.5 }}
            />
            <img
              src={column}
              alt=""
              aria-hidden="true"
              className="ornament"
              style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%) scaleX(-1)', height: '78svh', opacity: 0.5 }}
            />
          </>
        )}

        {/* The arch window. Laid out full bleed, scaled down at progress 0. */}
        <div
          ref={archRef}
            data-hero-arch=""
          className="arch"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: `${BASE_W_VW}vw`,
            height: `${BASE_H_SVH}svh`,
            transformOrigin: 'center center',
            transform: reduced
              ? 'translate(-50%, -50%)'
              : 'translate(-50%, -50%) scaleX(0.47) scaleY(0.4375)',
            overflow: 'hidden',
            background: 'var(--sand)',
            willChange: 'transform',
          }}
        >
          <div
            ref={stageRef}
            data-hero-stage=""
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '100vw',
              height: '100svh',
              marginLeft: '-50vw',
              marginTop: '-50svh',
              transformOrigin: 'center center',
              transform: reduced ? 'none' : 'scaleX(2.51) scaleY(2.70)',
              willChange: 'transform',
            }}
          >
            {hero ? (
              <div className="graded" style={{ position: 'absolute', inset: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero}
                  alt="A sunlit palace courtyard with a marble fountain and strung garlands"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div
                role="img"
                aria-label="Image to be added: a sunlit palace courtyard"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'var(--parchment)',
                }}
              />
            )}

            {/* The scrim carries legibility. The image is never darkened. */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'var(--hero-scrim)',
              }}
            />
          </div>
        </div>

        {/* Overlay. Inert except the CTA. */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div
            ref={backdropRef}
            data-hero-backdrop=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: reduced ? 1 : 0,
              background:
                'radial-gradient(ellipse at center, rgba(59,46,35,0.6) 0%, rgba(59,46,35,0.26) 50%, transparent 78%)',
            }}
          />

          {/* Identity block. Mount entrance is time based and kept separate
              from the scroll linked wrapper below it. */}
          <div
            ref={identityRef}
            data-hero-identity=""
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              padding: '0 1.5rem',
              textAlign: 'center',
            }}
          >
            <div className="identity">
              {/* Monogram and wordmark are separate stacked blocks. Neither is
                  positioned over the other, and the gap below is real. */}
              <motion.div {...rise(24, 1.1, 0.05)} style={{ marginBottom: '2.5rem' }}>
                <Monogram logo={logo} />
              </motion.div>

              <motion.h1
                {...rise(56, 1.3, 0.25)}
                className="display"
                style={{
                  color: '#FBF6EC',
                  fontSize: 'clamp(1.5rem, 5.4vw, 4.1rem)',
                  letterSpacing: '0.16em',
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                AROHI &amp; KARAN
              </motion.h1>

              <motion.div {...rise(36, 1.1, 0.45)} style={{ marginTop: '1.6rem' }}>
                <p style={secondary}>Together with their families</p>
                <p style={{ ...secondary, fontSize: '0.95rem', letterSpacing: '0.28em', margin: '0.9rem 0' }}>
                  2 &amp; 3 February 2027
                </p>
                <p style={secondary}>The Raj Palace · Jaipur</p>
              </motion.div>

              <motion.div
                {...rise(20, 0.9, 0.7)}
                style={{ marginTop: '2.6rem', display: 'grid', justifyItems: 'center', gap: '0.9rem' }}
              >
                <span style={{ display: 'block', width: 1, height: 48, background: 'var(--gold)' }} />
                <span style={{ ...secondary, fontSize: '0.6rem' }}>Scroll to begin</span>
              </motion.div>
            </div>
          </div>

          {!reduced && (
            <>
              <Beat ref={beat1Ref}>For two days this February, a palace in Jaipur becomes ours.</Beat>
              <Beat ref={beat2Ref}>Come and fill it with us.</Beat>
            </>
          )}

          {/* Closing beat. Holds at full opacity to the end of the range. */}
          <div
            ref={beat3Ref}
            data-hero-final=""
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              padding: '0 1.5rem',
              textAlign: 'center',
              opacity: reduced ? 1 : 0,
              pointerEvents: reduced ? 'auto' : 'none',
            }}
          >
            <div>
              <p className="label" style={{ color: 'var(--gold-light)', marginBottom: '1.2rem' }}>
                The favour of a reply
              </p>
              <p
                className="display"
                style={{
                  color: '#FBF6EC',
                  fontSize: 'clamp(1.9rem, 6vw, 4rem)',
                  letterSpacing: '0.12em',
                  marginBottom: '2.2rem',
                }}
              >
                Will you join us?
              </p>
              <a
                href="#rsvp"
                style={{
                  display: 'inline-block',
                  background: 'var(--gold-deep)',
                  color: '#FBF6EC',
                  fontWeight: 400,
                  fontSize: '0.72rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  padding: '1rem 2.8rem',
                  minHeight: 44,
                  lineHeight: '24px',
                  pointerEvents: 'auto',
                }}
              >
                RSVP
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-container { --hero-h: 300vh; }
        /* Sized against the arch window at progress 0 (62vw desktop, 78vw
           mobile) so the names always sit inside it. */
        .identity { width: 54vw; max-width: 760px; margin: 0 auto; }
        @media (max-width: 767px) {
          .hero-container { --hero-h: 180vh; }
          .identity { width: 72vw; }
        }
      `}</style>
    </div>
  )
}

function Monogram({ logo }: { logo: string | null }) {
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} alt="The A K monogram" style={{ height: 120, width: 'auto', margin: '0 auto' }} />
  }
  // PLACEHOLDER: assets/logo.png is absent, so the mark is set in type.
  return (
    <div className="display" style={{ color: '#FBF6EC', lineHeight: 1 }} aria-label="A K monogram">
      <div style={{ fontSize: '2.2rem', letterSpacing: '0.18em' }}>A</div>
      <div style={{ width: 34, height: 1, background: 'var(--gold)', margin: '0.5rem auto' }} />
      <div style={{ fontSize: '2.2rem', letterSpacing: '0.18em' }}>K</div>
    </div>
  )
}

const Beat = ({ ref, children }: { ref: React.Ref<HTMLDivElement>; children: React.ReactNode }) => (
  <div
    ref={ref}
    data-hero-beat=""
    style={{
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      padding: '0 1.5rem',
      textAlign: 'center',
      opacity: 0,
    }}
  >
    <p
      className="display"
      style={{
        color: '#FBF6EC',
        fontSize: 'clamp(1.5rem, 4.5vw, 2.8rem)',
        letterSpacing: '0.08em',
        maxWidth: '20ch',
        lineHeight: 1.4,
      }}
    >
      {children}
    </p>
  </div>
)
