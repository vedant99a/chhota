import type { NextConfig } from 'next'

/**
 * STATIC_EXPORT=1 produces a self-contained build in out/, used by
 * scripts/bundle.mjs to make a single shareable HTML file. The normal dev and
 * production paths are unaffected.
 */
const nextConfig: NextConfig = process.env.STATIC_EXPORT
  ? { output: 'export', images: { unoptimized: true } }
  : {}

export default nextConfig
