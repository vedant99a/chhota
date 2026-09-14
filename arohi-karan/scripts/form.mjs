import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'
const URL = process.env.BASE_URL ?? process.argv[2] ?? 'http://127.0.0.1:3000'
let fail = 0
const check = (ok, l, d = '') => { if (!ok) fail++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${l}${d ? '  ' + d : ''}`) }
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } })
const p = await ctx.newPage()

const fill = async () => {
  await p.fill('#name', 'Meera Dalwadi')
  await p.fill('#email', 'meera@example.com')
  await p.fill('#phone', '+91 98765 43210')
  await p.fill('#guests', '2')
  await p.fill('#party', 'Meera Dalwadi, Rohan Dalwadi')
  await p.fill('#dietary', 'One vegetarian')
  await p.fill('#arrivalFlight', 'AI 611')
}

// ---------- validation ----------
await p.goto(URL, { waitUntil: 'networkidle' })
await p.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })
await p.evaluate(() => document.getElementById('rsvp').scrollIntoView())
await p.waitForTimeout(700)

const boxes = await p.$$eval('#rsvp input[type=checkbox]', els => els.map(e => e.checked))
check(boxes.length === 6 && boxes.every(Boolean), 'all six celebrations are checked by default', `${boxes.length} boxes`)

await p.click('#rsvp button[type=submit]')
await p.waitForTimeout(300)
const errs = await p.$$eval('#rsvp p[id$="-error"]', els => els.map(e => e.textContent))
check(errs.length === 3, 'inline validation fires beneath each empty required field', errs.join(' | '))
const sent = await p.evaluate(() => window.__posted || false)
check(!sent, 'invalid form does not post')

// ---------- failure path retains values ----------
await p.route('**/formspree.io/**', r => r.fulfill({ status: 500, body: 'nope' }))
await fill()
await p.click('#rsvp button[type=submit]')
await p.waitForTimeout(600)
const errText = await p.textContent('#rsvp p[role=alert]').catch(() => null)
check(/did not send/.test(errText || ''), 'failure shows the error message', JSON.stringify(errText))
const retained = await p.evaluate(() => ({
  name: document.querySelector('#name').value,
  email: document.querySelector('#email').value,
  phone: document.querySelector('#phone').value,
  guests: document.querySelector('#guests').value,
  party: document.querySelector('#party').value,
  dietary: document.querySelector('#dietary').value,
  flight: document.querySelector('#arrivalFlight').value,
}))
const allKept = retained.name === 'Meera Dalwadi' && retained.email === 'meera@example.com' &&
  retained.phone === '+91 98765 43210' && retained.guests === '2' &&
  retained.party.startsWith('Meera') && retained.dietary === 'One vegetarian' && retained.flight === 'AI 611'
check(allKept, 'every entered value is retained on failure', JSON.stringify(retained.name + ' / ' + retained.flight))

// ---------- success path ----------
let posted = null
await p.unroute('**/formspree.io/**')
await p.route('**/formspree.io/**', async r => {
  posted = r.request().postDataJSON()
  await r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
})
await p.click('#rsvp button[type=submit]')
await p.waitForTimeout(700)
const success = await p.textContent('#rsvp').catch(() => '')
check(/Thank you\. We have you down\. See you in Jaipur\./.test(success), 'success state replaces the form')
check(posted && posted.name === 'Meera Dalwadi' && /Haldi Lunch/.test(posted.events || ''),
  'the submission carries the real field values', posted ? `${posted.guests} guests, events: ${String(posted.events).slice(0,40)}...` : 'no post')

// ---------- mobile ergonomics ----------
await p.goto(URL, { waitUntil: 'networkidle' })
await p.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })
await p.evaluate(() => document.getElementById('rsvp').scrollIntoView())
await p.waitForTimeout(600)
const small = await p.$$eval('#rsvp input, #rsvp textarea', els =>
  els.filter(e => parseFloat(getComputedStyle(e).fontSize) < 16).length)
check(small === 0, 'no input under 16px, so iOS does not zoom on focus', `${small} offenders`)

// A checkbox wrapped in a label is tapped via the label, so the label's box
// is the effective target. Measure that, not the raw 18px input.
const tiny = await p.$$eval('a, button, input[type=checkbox], label:has(input)', els => els
  .map(e => { const t = (e.tagName === 'INPUT' && e.closest('label')) ? e.closest('label') : e; return { t, r: t.getBoundingClientRect() } })
  .filter(({ r }) => r.width > 0 && r.height > 0 && r.height < 44)
  .map(({ t, r }) => `${t.tagName}:${(t.textContent||'').trim().slice(0,22)}|${Math.round(r.height)}px`))
check(tiny.length === 0, 'every tappable target is at least 44px tall (label box for wrapped checkboxes)', tiny.slice(0, 6).join('  '))

const gaps = await p.$$eval('#rsvp label:has(input[type=checkbox])', els => {
  const rs = els.map(e => e.getBoundingClientRect()).sort((a, b) => a.top - b.top)
  return rs.slice(1).map((r, i) => Math.round(r.top - rs[i].bottom))
})
check(gaps.every(g => g >= 8), 'at least 8px between adjacent tap targets', `gaps ${gaps.join(',')}px`)

const snap = await p.$$eval('.snap-row', els => els.map(e => getComputedStyle(e).scrollSnapType))
check(snap.length >= 3 && snap.every(s => s.includes('x mandatory')), 'card rows snap horizontally on mobile', snap.join(' | '))

const safe = await p.evaluate(() => getComputedStyle(document.querySelector('.sticky-rsvp')).paddingBottom)
check(parseFloat(safe) >= 14, 'sticky bar respects the safe area inset', safe)

await b.close()
console.log(`\n${fail === 0 ? 'ALL FORM + MOBILE CHECKS PASSED' : fail + ' FAILED'}`)
process.exit(fail ? 1 : 0)
