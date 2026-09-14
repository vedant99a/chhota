'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const EASE = [0.25, 0, 0, 1] as const

/** Wraps a block so its children rise and fade in once, staggered. */
export default function Section({
  children,
  id,
  className,
  style,
}: {
  children: React.ReactNode
  id?: string
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? 'shown' : 'hidden'}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {children}
    </motion.section>
  )
}

/** A single staggered child of <Section>. */
export function Reveal({
  children,
  className,
  style,
  as = 'div',
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  as?: 'div' | 'h2' | 'h3' | 'p' | 'li' | 'figure'
}) {
  const Tag = motion[as]
  return (
    <Tag
      data-reveal=""
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y: 24 },
        shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
    >
      {children}
    </Tag>
  )
}
