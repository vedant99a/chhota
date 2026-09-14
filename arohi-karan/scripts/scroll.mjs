import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'
const URL = process.env.BASE_URL ?? process.argv[2] ?? 'http://127.0.0.1:3000'
let fail = 0
const check = (ok, l, d = '') => { if (!ok) fail++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${l}${d ? '  ' + d : ''}`) }
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })

// ---------- desktop scroll choreography ----------
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
const p = await ctx.newPage()
await p.goto(URL, { waitUntil: 'networkidle' })
await p.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })
await p.waitForTimeout(1600)

const hero = await p.evaluate(() => document.querySelector('.hero-container').offsetHeight)
const travel = hero - 900
const sample = async (prog) => {
  await p.evaluate(y => window.scrollTo(0, y), Math.round(travel * prog))
  await p.waitForTimeout(420)
  return p.evaluate(() => {
    const g = el => el ? Number(getComputedStyle(el).opacity).toFixed(2) : 'n/a'
    const ps = [...document.querySelectorAll('.hero-container p')]
    const arch = document.querySelector('.hero-container .arch')
    const m = new DOMMatrixReadOnly(getComputedStyle(arch).transform)
    const stage = arch.firstElementChild
    const sm = new DOMMatrixReadOnly(getComputedStyle(stage).transform)
    // identity = the wrapper holding the h1; beats are the absolute overlays
    const overlays = [...document.querySelectorAll('.hero-container > div > div > div')]
    return {
      archX: m.a.toFixed(3), archY: m.d.toFixed(3),
      stageX: sm.a.toFixed(3),
      opacities: overlays.map(o => g(o)).join(' '),
      h1op: g(document.querySelector('h1').closest('div').parentElement),
    }
  })
}
console.log('\nARCH + BEATS across the hero range (1440x900):')
for (const prog of [0, 0.1, 0.25, 0.35, 0.45, 0.6, 0.75, 0.9, 1.0]) {
  const s = await sample(prog)
  console.log(`  p=${prog.toFixed(2)}  archScale ${s.archX}x${s.archY}  stageScaleX ${s.stageX}  overlayOpacities [${s.opacities}]`)
}

const at0 = await sample(0), at45 = await sample(0.45), at1 = await sample(1.0)
check(Number(at0.archX) < 0.6 && Number(at45.archX) > 0.99, 'arch opens from a framed window to full bleed',
  `${at0.archX} -> ${at45.archX}`)
check(Math.abs(Number(at45.archX) - Number(at1.archX)) < 0.01, 'arch holds full bleed from 0.45 to 1.0')
check(Number(at0.stageX) > 2.0 && Math.abs(Number(at45.stageX) - 1.0) < 0.02,
  'image settles from scale 1.18 to 1.00 as the window grows', `stage counter-scale ${at0.stageX} -> ${at45.stageX}`)

// beat 3 must hold at full opacity to the very end
const tail = await p.evaluate(() => {
  const els = [...document.querySelectorAll('.hero-container a[href="#rsvp"]')]
  const block = els[0].closest('div').parentElement
  return Number(getComputedStyle(block).opacity)
})
check(tail > 0.99, 'closing beat holds at full opacity through the end of the range', `opacity ${tail}`)

// sticky hero releases
await p.evaluate(() => document.getElementById('rsvp').scrollIntoView())
await p.waitForTimeout(900)
const released = await p.evaluate(() => {
  const sticky = document.querySelector('.hero-container > div')
  return sticky.getBoundingClientRect().bottom <= 1
})
check(released, 'sticky hero releases cleanly once its container is passed')

// sticky RSVP affordance
await p.evaluate(() => window.scrollTo(0, document.querySelector('.hero-container').offsetHeight + 200))
await p.waitForTimeout(600)
const pill = await p.evaluate(() => Number(getComputedStyle(document.querySelector('.sticky-rsvp')).opacity))
check(pill > 0.9, 'sticky RSVP appears once the hero is passed', `opacity ${pill}`)
await p.evaluate(() => document.getElementById('rsvp').scrollIntoView())
await p.waitForTimeout(1400)
const hidden = await p.evaluate(() => Number(getComputedStyle(document.querySelector('.sticky-rsvp')).opacity))
check(hidden < 0.1, 'sticky RSVP hides once the RSVP section is in view', `opacity ${hidden}`)

// ---------- reduced motion ----------
const rctx = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
const rp = await rctx.newPage()
await rp.goto(URL, { waitUntil: 'networkidle' })
await rp.waitForTimeout(800)
const rm = await rp.evaluate(() => {
  const c = document.querySelector('.hero-container')
  const arch = c.querySelector('.arch')
  const m = new DOMMatrixReadOnly(getComputedStyle(arch).transform)
  return {
    heroH: c.offsetHeight, vh: window.innerHeight,
    scaleX: m.a, scaleY: m.d,
    h1Visible: Number(getComputedStyle(document.querySelector('h1')).opacity),
    ctaVisible: Number(getComputedStyle(document.querySelector('.hero-container a[href="#rsvp"]').closest('div').parentElement).opacity),
  }
})
check(Math.abs(rm.scaleX - 1) < 0.01 && Math.abs(rm.scaleY - 1) < 0.01, 'reduced motion: hero renders at its final state, no transforms', `scale ${rm.scaleX}x${rm.scaleY}`)
check(rm.heroH <= rm.vh + 2, 'reduced motion: hero collapses to one screen', `${rm.heroH}px vs ${rm.vh}px viewport`)
check(rm.h1Visible > 0.99 && rm.ctaVisible > 0.99, 'reduced motion: names and the RSVP call are both visible')

await b.close()
console.log(`\n${fail === 0 ? 'ALL SCROLL CHECKS PASSED' : fail + ' FAILED'}`)
process.exit(fail ? 1 : 0)
