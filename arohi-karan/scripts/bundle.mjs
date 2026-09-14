/**
 * Inlines the static export in out/ into a single self-contained .html file:
 * stylesheets, scripts and font files all become inline content or data URIs,
 * so the result opens from a phone, an email attachment or a USB stick with no
 * server and no network.
 *
 *   STATIC_EXPORT=1 npx next build && node scripts/bundle.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'

const OUT = 'out'
const args = process.argv.slice(2)
const DEST = args.find((a) => !a.startsWith('--')) ?? 'arohi-and-karan-preview.html'


const MIME = { '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' }
const local = (url) => url.startsWith('/') && !url.startsWith('//')
const read = (url) => {
  const p = join(OUT, decodeURIComponent(url.split('?')[0]))
  return existsSync(p) ? readFileSync(p) : null
}
const dataUri = (url) => {
  const buf = read(url)
  if (!buf) return null
  return `data:${MIME[extname(url)] ?? 'application/octet-stream'};base64,${buf.toString('base64')}`
}

let html = readFileSync(join(OUT, 'index.html'), 'utf8')
let inlinedCss = 0, inlinedJs = 0, inlinedFonts = 0, missing = []
const processedCss = new Map()

// 1. Stylesheets, with their font files folded in as data URIs.
html = html.replace(/<link[^>]*rel="stylesheet"[^>]*>/g, (tag) => {
  const href = (tag.match(/href="([^"]+)"/) || [])[1]
  if (!href || !local(href)) return tag
  let css = read(href)?.toString('utf8')
  if (css == null) { missing.push(href); return '' }
  css = css.replace(/url\(([^)]+)\)/g, (m, raw) => {
    const url = raw.trim().replace(/^['"]|['"]$/g, '')
    if (!local(url)) return m
    const uri = dataUri(url)
    if (!uri) { missing.push(url); return m }
    inlinedFonts++
    return `url(${uri})`
  })
  inlinedCss++
  processedCss.set(href.split('?')[0], css)
  return `<style>${css}</style>`
})

// 2. Scripts, in place so execution order is preserved. Next's webpack chunks
//    self-register, so inlining them in DOM order resolves without fetching.
html = html.replace(/<script([^>]*)src="([^"]+)"([^>]*)><\/script>/g, (tag, pre, src, post) => {
  if (!local(src)) return tag
  const js = read(src)?.toString('utf8')
  if (js == null) { missing.push(src); return '' }
  inlinedJs++
  // Drop async/defer WITH their values: inline scripts run immediately and must
  // stay ordered. Removing just the word leaves a dangling ="" that makes the
  // parser build a bogus <script =""> element and hydration never runs.
  const attrs = `${pre}${post}`.replace(/\s*\b(?:async|defer)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g, '')
  // A literal </script> inside the bundle would close the tag early.
  return `<script${attrs}>${js.replace(/<\/script>/gi, '<\\/script>')}</script>`
})

// 3. Preloads and prefetches now point at files that will not exist.
html = html.replace(/<link[^>]*rel="(?:preload|prefetch|modulepreload)"[^>]*>/g, '')

// 4. React's runtime preload hints live inside the RSC payload as plain
//    strings, not as href/src attributes, so the passes above miss them and the
//    browser tries to fetch them from file:///_next/... Point them at the same
//    data URIs; a preload of a data URI resolves instantly. Chunk .js paths are
//    deliberately left alone: those scripts are already inlined and executed.
html = html.replace(
  /\/(?:_next\/static\/[A-Za-z0-9/_.-]+\.(?:woff2?|png|jpe?g|svg|gif|webp|css)|icon\.svg)(?:\?[A-Za-z0-9]+)?/g,
  (match) => {
    const clean = match.split('?')[0]
    // The real CSS is already in the <style> above. Re-encoding it here would
    // base64 the font data URIs a second time and triple the file, so this
    // reference is satisfied with an empty stylesheet.
    if (processedCss.has(clean)) return 'data:text/css,'
    const uri = dataUri(clean)
    if (!uri) { missing.push(clean); return match }
    inlinedFonts++
    return uri
  },
)

writeFileSync(DEST, html)
const kb = (Buffer.byteLength(html) / 1024).toFixed(0)
console.log(`${DEST}  ${kb} kB`)
console.log(`inlined: ${inlinedCss} stylesheet(s), ${inlinedJs} script(s), ${inlinedFonts} font file(s)`)
if (missing.length) console.log('MISSING:', [...new Set(missing)].join(', '))
const left = html.match(/\/_next\/static\/[A-Za-z0-9/_.-]+/g)
console.log(left ? `WARNING: ${left.length} unresolved local reference(s): ${[...new Set(left)].slice(0,5).join(', ')}` : 'no unresolved local references')
