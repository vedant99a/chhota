import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'

const URL = process.env.BASE_URL ?? process.argv[2] ?? 'http://127.0.0.1:3000'
const out = []
const log = (...a) => { const s = a.join(' '); out.push(s); console.log(s) }
let failures = 0
const check = (ok, label, detail = '') => {
  if (!ok) failures++
  log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? '  ' + detail : ''}`)
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })

// ---------- 1. console cleanliness + title + countdown on a phone ----------
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
const page = await ctx.newPage()
const errors = [], warnings = []
page.on('console', m => {
  if (m.type() === 'error') errors.push(m.text())
  if (m.type() === 'warning') warnings.push(m.text())
})
page.on('pageerror', e => errors.push('pageerror: ' + e.message))

// measure transferred bytes for the first mobile load
let bytes = 0
const perResource = []
page.on('response', async r => {
  try {
    const h = r.headers()
    const len = Number(h['content-length'] || 0)
    const body = len || (await r.body().catch(() => Buffer.alloc(0))).length
    bytes += body
    if (body > 20000) perResource.push(`${(body/1024).toFixed(0)}kB ${r.url().split('/').pop().slice(0,48)}`)
  } catch {}
})

await page.goto(URL, { waitUntil: 'networkidle' })

const domTitle = await page.evaluate(() => document.title)
check(domTitle.includes('&') && !domTitle.includes('&amp;'), 'DOM <title> uses a real ampersand', JSON.stringify(domTitle))
const h1 = await page.evaluate(() => document.querySelector('h1').textContent)
check(h1.includes('&') && !h1.includes('&amp;'), 'h1 uses a real ampersand', JSON.stringify(h1))

// countdown: middle dots are the SSR state; after a tick they must be numbers
const ssrHtml = await (await fetch(URL)).text()
const ssrDots = (ssrHtml.match(/>·</g) || []).length
check(ssrDots >= 4, 'countdown renders middle dots in the SSR payload', `found ${ssrDots}`)
await page.waitForTimeout(1200)
const nums = await page.evaluate(() => [...document.querySelectorAll('section')]
  .flatMap(s => [...s.querySelectorAll('div')])
  .map(d => d.textContent.trim()).filter(t => /^\d{2,}$/.test(t)).slice(0, 4))
check(nums.length > 0, 'countdown shows live numerals after the first tick', nums.join(' '))

const target = await page.evaluate(() => new Date('2027-02-02T12:00:00+05:30').toISOString())
check(target === '2027-02-02T06:30:00.000Z', 'countdown target resolves to 2 Feb 2027 12:00 IST', target)

check(errors.length === 0, 'zero console errors', errors.slice(0, 3).join(' | '))
const hydration = warnings.filter(w => /hydrat|did not match|server HTML/i.test(w))
check(hydration.length === 0, 'zero hydration warnings', hydration.slice(0, 2).join(' | '))

log(`\nINFO  first mobile load transferred ${(bytes / 1048576).toFixed(2)} MB (${bytes} bytes)`)
perResource.sort().reverse().slice(0, 6).forEach(r => log('      ' + r))
check(bytes < 3 * 1048576, 'first mobile load under 3 MB')

// ---------- 2. monogram vs names clearance, overflow ----------
for (const w of [360, 390, 1440]) {
  await page.setViewportSize({ width: w, height: 900 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(1600) // let the mount entrance settle
  const r = await page.evaluate(() => {
    const mono = document.querySelector('[aria-label="A K monogram"], img[alt="The A K monogram"]')
    const h1 = document.querySelector('h1')
    const a = mono.getBoundingClientRect(), b = h1.getBoundingClientRect()
    const overlap = !(a.bottom <= b.top || b.bottom <= a.top || a.right <= b.left || b.right <= a.left)
    return { gap: b.top - a.bottom, overlap,
             ow: document.documentElement.scrollWidth, iw: window.innerWidth }
  })
  check(!r.overlap && r.gap >= 40, `${w}px: monogram clears the names`, `gap ${r.gap.toFixed(1)}px`)
  check(r.ow <= r.iw, `${w}px: no horizontal overflow`, `scrollWidth ${r.ow} vs innerWidth ${r.iw}`)

  // Cream text outside the arch sits on ivory and is invisible, so every line
  // of the identity block must be inside the arch window at progress 0.
  const inside = await page.evaluate(() => {
    const arch = document.querySelector('.hero-container .arch').getBoundingClientRect()
    const lines = [document.querySelector('h1'), ...document.querySelectorAll('.identity p')]
    return lines.map(el => {
      const b = el.getBoundingClientRect()
      return { t: el.textContent.trim().slice(0, 26),
               ok: b.left >= arch.left - 0.5 && b.right <= arch.right + 0.5,
               slackL: Math.round(b.left - arch.left), slackR: Math.round(arch.right - b.right) }
    })
  })
  const spill = inside.filter(l => !l.ok)
  check(spill.length === 0, `${w}px: every hero line sits inside the arch`,
        spill.length ? spill.map(l => `"${l.t}" L${l.slackL} R${l.slackR}`).join('  ')
                     : `tightest margin ${Math.min(...inside.flatMap(l => [l.slackL, l.slackR]))}px`)
}

// ---------- 3. hero contrast against the real composited pixels ----------
await page.setViewportSize({ width: 390, height: 844 })
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(1600)

const decoder = await ctx.newPage()
await decoder.goto('about:blank')

async function backdropExtremes(sel, nth = 0) {
  const box = await page.evaluate(([s, n]) => {
    const el = document.querySelectorAll(s)[n]
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { x: r.x, y: r.y, w: r.width, h: r.height,
             color: getComputedStyle(el).color, text: el.textContent.trim().slice(0, 34) }
  }, [sel, nth])
  if (!box || box.w < 2 || box.h < 2) return null
  // hide just the glyphs so the screenshot captures what is actually behind them
  await page.evaluate(([s, n]) => { document.querySelectorAll(s)[n].style.visibility = 'hidden' }, [sel, nth])
  const shot = await page.screenshot({ clip: { x: Math.max(0, box.x), y: Math.max(0, box.y), width: Math.min(box.w, 390), height: box.h } })
  await page.evaluate(([s, n]) => { document.querySelectorAll(s)[n].style.visibility = '' }, [sel, nth])

  const px = await decoder.evaluate(async (b64) => {
    const img = new Image()
    img.src = 'data:image/png;base64,' + b64
    await img.decode()
    const c = document.createElement('canvas')
    c.width = img.width; c.height = img.height
    const g = c.getContext('2d')
    g.drawImage(img, 0, 0)
    const d = g.getImageData(0, 0, c.width, c.height).data
    const lum = []
    for (let i = 0; i < d.length; i += 4) {
      const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
      lum.push(0.2126 * f(d[i]) + 0.7152 * f(d[i+1]) + 0.0722 * f(d[i+2]))
    }
    lum.sort((a, z) => a - z)
    return { median: lum[Math.floor(lum.length / 2)], p95: lum[Math.floor(lum.length * 0.95)], max: lum[lum.length - 1] }
  }, shot.toString('base64'))
  return { ...box, ...px }
}

const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
const textLum = css => {
  const [r, g, b] = css.match(/\d+/g).map(Number)
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const cr = (a, b) => { const [x, y] = [a, b].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05) }

log('\nHERO CONTRAST, sampled from the rendered composite (text hidden to expose the backdrop):')
const targets = [['h1', 0], ['p', 0], ['p', 1], ['p', 2], ['p', 3]]
for (const [sel, n] of targets) {
  const s = await backdropExtremes(sel, n)
  if (!s) continue
  const tl = textLum(s.color)
  const rMed = cr(tl, s.median), rP95 = cr(tl, s.p95)
  check(rMed >= 4.5, `hero "${s.text}"`, `median ${rMed.toFixed(2)}:1, p95-lightest ${rP95.toFixed(2)}:1, colour ${s.color}`)
}

// ---------- 4. readable with no JavaScript ----------
// Framer Motion renders its `initial` state into the server markup, so without
// the noscript override every revealed block stays at opacity 0 and the page
// below the hero is blank. Phone attachment previews do not run scripts.
const noJs = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false })
const np = await noJs.newPage()
await np.goto(URL, { waitUntil: 'load' })
await np.waitForTimeout(600)
const readable = await np.evaluate(() => {
  const visible = (el) => {
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    return Number(cs.opacity) > 0.9 && cs.visibility !== 'hidden' && cs.display !== 'none' && r.height > 0
  }
  const wanted = ['How We Got Here', 'The Raj Palace, Jaipur', 'What to wear', 'Two families']
  const found = wanted.map((t) => {
    const el = [...document.querySelectorAll('h2, h3, p')].find((e) => e.textContent.trim().startsWith(t))
    return { t, present: !!el, visible: el ? visible(el) : false }
  })
  const hidden = [...document.querySelectorAll('[data-reveal]')].filter((e) => Number(getComputedStyle(e).opacity) < 0.9)
  return { found, revealsStillHidden: hidden.length, totalReveals: document.querySelectorAll('[data-reveal]').length }
})
const allReadable = readable.found.every((f) => f.present && f.visible) && readable.revealsStillHidden === 0
check(allReadable, 'page is readable with JavaScript disabled',
  `${readable.totalReveals} revealed blocks, ${readable.revealsStillHidden} still hidden` +
  (allReadable ? '' : ' | ' + readable.found.filter(f => !f.visible).map(f => f.t).join(', ')))
await noJs.close()

await ctx.close()
await browser.close()
log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'}`)
process.exit(failures === 0 ? 0 : 1)
