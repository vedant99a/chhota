'use client'

import { useState } from 'react'
import Section, { Reveal } from './Section'
import { ALL_EVENTS } from '../data'

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT

type Values = {
  name: string
  email: string
  phone: string
  guests: string
  party: string
  events: string[]
  arrivalAirline: string
  arrivalFlight: string
  arrivalDate: string
  arrivalTime: string
  departureAirline: string
  departureFlight: string
  departureDate: string
  departureTime: string
  dietary: string
  notes: string
}

const INITIAL: Values = {
  name: '', email: '', phone: '', guests: '1', party: '',
  events: ALL_EVENTS.map((e) => e.name), // every celebration checked by default
  arrivalAirline: '', arrivalFlight: '', arrivalDate: '', arrivalTime: '',
  departureAirline: '', departureFlight: '', departureDate: '', departureTime: '',
  dietary: '', notes: '',
}

const validate = (v: Values): Partial<Record<keyof Values, string>> => {
  const e: Partial<Record<keyof Values, string>> = {}
  if (!v.name.trim()) e.name = 'Please tell us your name.'
  if (!v.email.trim()) e.email = 'Please add an email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'That email address does not look right.'
  if (!v.phone.trim()) e.phone = 'Please add a phone number, WhatsApp preferred.'
  const n = Number(v.guests)
  if (!v.guests.trim()) e.guests = 'Please tell us how many of you are coming.'
  else if (!Number.isInteger(n) || n < 1) e.guests = 'Please enter a whole number, one or more.'
  return e
}

export default function Rsvp() {
  const [v, setV] = useState<Values>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const set = <K extends keyof Values>(key: K) => (value: Values[K]) => {
    setV((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const toggleEvent = (name: string) =>
    setV((prev) => ({
      ...prev,
      events: prev.events.includes(name) ? prev.events.filter((x) => x !== name) : [...prev.events, name],
    }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found = validate(v)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    if (!ENDPOINT) {
      // No endpoint configured yet. Fail loudly rather than faking a success.
      setStatus('error')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...v, events: v.events.join(', ') }),
      })
      // Values are never cleared, whatever happens.
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <Section id="rsvp" style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <ArchCrown />
          <div style={panel}>
          <Reveal
            as="p"
            className="script"
            style={{ color: 'var(--ink)', fontSize: 'clamp(1.3rem, 4vw, 2.2rem)', textAlign: 'center', lineHeight: 1.5 }}
          >
            Thank you. We have you down. See you in Jaipur.
          </Reveal>
          </div>
        </div>
      </Section>
    )
  }

  return (
    <Section id="rsvp" style={{ padding: '6rem 1.5rem' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <ArchCrown />
        <div style={panel}>
        <Reveal as="p" className="label" style={{ textAlign: 'center' }}>The favour of a reply</Reveal>
        <Reveal as="p" style={{ textAlign: 'center', color: 'var(--dim)', marginTop: '0.8rem', fontSize: '0.9rem' }}>
          Kindly respond by 15 December 2026.
        </Reveal>

        <form onSubmit={onSubmit} noValidate style={{ marginTop: '2.5rem', display: 'grid', gap: '1.5rem' }}>
          <Field id="name" label="Full name" required value={v.name} onChange={set('name')} error={errors.name} autoComplete="name" />
          <Field id="email" label="Email" type="email" required value={v.email} onChange={set('email')} error={errors.email} autoComplete="email" />
          <Field id="phone" label="Phone, WhatsApp preferred" type="tel" required value={v.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
          <Field id="guests" label="Number of guests, including yourself" type="number" required value={v.guests} onChange={set('guests')} error={errors.guests} min={1} />
          <Field id="party" label="Names of everyone in your party" value={v.party} onChange={set('party')} textarea />

          <fieldset style={{ border: 'none' }}>
            <legend className="label" style={{ marginBottom: '1rem' }}>Which celebrations will you join?</legend>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {ALL_EVENTS.map((ev) => (
                <label key={ev.slug} style={checkRow}>
                  <input
                    type="checkbox"
                    checked={v.events.includes(ev.name)}
                    onChange={() => toggleEvent(ev.name)}
                    style={{ width: 18, height: 18, accentColor: 'var(--gold-deep)' }}
                  />
                  <span style={{ fontSize: '0.95rem' }}>{ev.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <Group title="Arrival">
            <Field id="arrivalAirline" label="Airline" value={v.arrivalAirline} onChange={set('arrivalAirline')} />
            <Field id="arrivalFlight" label="Flight number" value={v.arrivalFlight} onChange={set('arrivalFlight')} />
            <Field id="arrivalDate" label="Date" type="date" value={v.arrivalDate} onChange={set('arrivalDate')} />
            <Field id="arrivalTime" label="Time" type="time" value={v.arrivalTime} onChange={set('arrivalTime')} />
          </Group>

          <Group title="Departure">
            <Field id="departureAirline" label="Airline" value={v.departureAirline} onChange={set('departureAirline')} />
            <Field id="departureFlight" label="Flight number" value={v.departureFlight} onChange={set('departureFlight')} />
            <Field id="departureDate" label="Date" type="date" value={v.departureDate} onChange={set('departureDate')} />
            <Field id="departureTime" label="Time" type="time" value={v.departureTime} onChange={set('departureTime')} />
          </Group>

          <p style={{ color: 'var(--dim)', fontSize: '0.85rem' }}>
            We will arrange your pickup and drop. If your flights are not booked yet, send the rest now and
            these later.
          </p>

          <Field id="dietary" label="Dietary requirements" value={v.dietary} onChange={set('dietary')} textarea />
          <Field id="notes" label="Anything else we should know" value={v.notes} onChange={set('notes')} textarea />

          {status === 'error' && (
            <p role="alert" style={{ color: 'var(--rose)', fontSize: '0.9rem' }}>
              That did not send. Try again, or message us directly.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            style={{
              background: 'var(--gold-deep)',
              color: '#FBF6EC',
              fontWeight: 400,
              fontSize: '0.72rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              padding: '1rem 2.8rem',
              minHeight: 48,
              justifySelf: 'center',
              opacity: status === 'sending' ? 0.7 : 1,
            }}
          >
            {status === 'sending' ? 'Sending' : 'Send our reply'}
          </button>
        </form>
        </div>
      </div>
    </Section>
  )
}

const panel: React.CSSProperties = {
  background: 'var(--parchment)',
  border: '1px solid var(--border)',
  borderTop: 'none',
  padding: '2.5rem 1.5rem 3rem',
}

/**
 * The arch, as a crown above the panel rather than a clip on the whole panel.
 * clipPathUnits are objectBoundingBox, so clipping a 2000px tall form made the
 * curve span roughly 950px and cut straight through the fields.
 */
function ArchCrown() {
  return (
    <div
      aria-hidden="true"
      className="arch"
      style={{
        height: 'clamp(110px, 26vw, 190px)',
        background: 'var(--parchment)',
        width: '100%',
      }}
    />
  )
}

const checkRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  minHeight: 44,
  cursor: 'pointer',
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset style={{ border: 'none' }}>
      <legend className="label" style={{ marginBottom: '1rem' }}>{title}</legend>
      <div className="pair-grid">{children}</div>
      <style>{`
        .pair-grid { display: grid; gap: 1rem; }
        @media (min-width: 520px) { .pair-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </fieldset>
  )
}

function Field({
  id, label, value, onChange, error, type = 'text', required, textarea, min, autoComplete,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  type?: string
  required?: boolean
  textarea?: boolean
  min?: number
  autoComplete?: string
}) {
  const base: React.CSSProperties = {
    width: '100%',
    background: 'var(--ivory)',
    border: `1px solid ${error ? 'var(--rose)' : 'var(--border)'}`,
    padding: '0.8rem 0.9rem',
    minHeight: 44,
    color: 'var(--ink)',
  }
  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--umber)', marginBottom: '0.5rem' }}>
        {label}{required && <span style={{ color: 'var(--gold-deep)' }}> *</span>}
      </label>
      {textarea ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={3} style={{ ...base, resize: 'vertical' }} />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          min={min}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          style={base}
        />
      )}
      {error && (
        <p id={`${id}-error`} style={{ color: 'var(--rose)', fontSize: '0.8rem', marginTop: '0.4rem' }}>{error}</p>
      )}
    </div>
  )
}
