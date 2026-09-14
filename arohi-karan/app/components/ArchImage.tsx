import { assetUrl, hasAsset } from '../assets'

type Props = {
  src: string
  alt: string
  /** width / height, e.g. 3/4. Drives the reserved box. */
  ratio?: number
  /** Retained for call sites; each slot ships one correctly sized file. */
  sizes?: string
  priority?: boolean
  caption?: string
  className?: string
  style?: React.CSSProperties
}

/**
 * An arch topped image. When the file is not present yet it renders a marked
 * parchment placeholder of the same shape, so layout never shifts when the
 * real asset lands.
 */
export default function ArchImage({
  src,
  alt,
  ratio = 3 / 4,
  sizes = '(max-width: 767px) 90vw, 420px',
  priority = false,
  caption = 'Image to be added',
  className = '',
  style,
}: Props) {
  const shared: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: String(ratio),
    maxWidth: '100%',
    overflow: 'hidden',
    ...style,
  }

  if (!hasAsset(src)) {
    return (
      <div
        className={`arch ${className}`}
        style={{
          ...shared,
          background: 'var(--parchment)',
          border: '1px solid var(--border)',
          display: 'grid',
          placeItems: 'center',
          padding: '1.5rem',
        }}
        role="img"
        aria-label={`${caption}: ${alt}`}
      >
        <span
          style={{
            color: 'var(--umber)',
            fontSize: '0.68rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          {caption}
        </span>
      </div>
    )
  }

  // A plain <img> rather than next/image: every asset is pre-sized to exactly
  // what this slot renders, so there is no srcset to pick from. next/image
  // emits src plus a srcset naming the same file twice, which in the single
  // file build embeds each photograph three times over as base64.
  return (
    <div className={`arch graded ${className}`} style={shared}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={assetUrl(src)}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  )
}
