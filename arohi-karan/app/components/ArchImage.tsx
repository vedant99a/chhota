import Image from 'next/image'
import { assetUrl, hasAsset } from '../assets'

type Props = {
  src: string
  alt: string
  /** width / height, e.g. 3/4. Drives the reserved box. */
  ratio?: number
  /** next/image sizes hint. Mobile caps at 900px for everything but the hero. */
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

  return (
    <div className={`arch graded ${className}`} style={shared}>
      <Image
        src={assetUrl(src)}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        style={{ objectFit: 'cover' }}
      />
    </div>
  )
}
