'use client'

import { useEffect, useState } from 'react'

/**
 * Appears once the hero is passed, hides again when the RSVP section itself
 * is on screen. Uses IntersectionObserver, not a scroll listener.
 */
export default function StickyRsvp() {
  const [show, setShow] = useState(false)
  const [rsvpVisible, setRsvpVisible] = useState(false)

  useEffect(() => {
    const heroWatch = new IntersectionObserver(
      ([e]) => setShow(!e.isIntersecting),
      { threshold: 0 },
    )
    const hero = document.querySelector('.hero-container')
    if (hero) heroWatch.observe(hero)

    const rsvpWatch = new IntersectionObserver(([e]) => setRsvpVisible(e.isIntersecting), { threshold: 0.15 })
    const rsvp = document.getElementById('rsvp')
    if (rsvp) rsvpWatch.observe(rsvp)

    return () => {
      heroWatch.disconnect()
      rsvpWatch.disconnect()
    }
  }, [])

  const visible = show && !rsvpVisible

  return (
    <a
      href="#rsvp"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className="sticky-rsvp"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.4s var(--ease)',
      }}
    >
      <span>RSVP</span>
      <style>{`
        .sticky-rsvp {
          position: fixed;
          z-index: 40;
          background: var(--gold-deep);
          color: #FBF6EC;
          font-size: 0.72rem;
          font-weight: 400;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          display: grid;
          place-items: center;
          text-align: center;
        }
        /* Mobile: full width bar clearing the home indicator. */
        @media (max-width: 767px) {
          .sticky-rsvp {
            left: 0; right: 0; bottom: 0;
            min-height: 48px;
            padding: 0.9rem 1rem;
            padding-bottom: calc(0.9rem + env(safe-area-inset-bottom));
          }
        }
        /* Desktop: a small pill, bottom right. */
        @media (min-width: 768px) {
          .sticky-rsvp {
            right: 2rem; bottom: 2rem;
            min-height: 48px;
            padding: 0.9rem 2rem;
            border-radius: 999px;
          }
        }
      `}</style>
    </a>
  )
}
