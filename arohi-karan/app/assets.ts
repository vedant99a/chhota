/**
 * Which image files actually exist in /public/assets.
 *
 * Nothing is listed yet, so every <ArchImage> renders a marked placeholder.
 * When you drop a real file into /public/assets, add its path here and the
 * placeholder is replaced by the image. That is the only change needed.
 *
 * Example once you have the hero:
 *   export const AVAILABLE_ASSETS = new Set<string>(['/assets/hero.jpg'])
 */
export const AVAILABLE_ASSETS = new Set<string>([])

export const hasAsset = (src: string) => AVAILABLE_ASSETS.has(src)
