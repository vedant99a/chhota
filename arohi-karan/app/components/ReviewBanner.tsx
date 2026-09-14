/**
 * Rendered only when NEXT_PUBLIC_REVIEW_BANNER is set at build time, so the
 * shareable review copy states what is deliberately unfinished and reviewers
 * do not report known gaps as faults. Never present in a normal build.
 */
export default function ReviewBanner() {
  if (!process.env.NEXT_PUBLIC_REVIEW_BANNER) return null
  return (
    <div
      style={{
        background: 'var(--parchment)',
        borderBottom: '1px solid var(--border)',
        color: 'var(--umber)',
        fontSize: '0.72rem',
        lineHeight: 1.8,
        letterSpacing: '0.04em',
        padding: '1rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <strong
        style={{
          display: 'block',
          color: 'var(--gold-deep)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          fontSize: '0.62rem',
          fontWeight: 400,
          marginBottom: '0.5rem',
        }}
      >
        Draft for review
      </strong>
      <span style={{ display: 'inline-block', maxWidth: '68ch' }}>
        Photographs are not in yet, so every image is a placeholder. The three{' '}
        <em>Our Story</em> paragraphs are stand in wording. The RSVP form is not connected to
        anything yet, so a reply sent from here will not arrive. Everything else, every date, time,
        venue, theme and dress code, is final and worth checking closely.
      </span>
    </div>
  )
}
