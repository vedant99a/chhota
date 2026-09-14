# Arohi & Karan · Jaipur · February 2027

A scroll driven single page wedding invitation. Phone first. Next.js 15,
React 19, Framer Motion, no video and no canvas.

Built in this subdirectory rather than the repository root: the root holds an
unrelated Vite + React 18 + Firebase project (Chhota), and a Next.js 15 +
React 19 app cannot share its `package.json`, `index.html`, `src/` or build
config. `postcss.config.mjs` is present only to stop Next walking up and
picking up the parent project's Tailwind PostCSS config.

## Run

```
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

## Verify

Three Playwright suites cover the Step 9 checklist. Start the server, then:

```
npm run verify         # title, hydration, countdown, payload, overflow, contrast
npm run verify:scroll  # arch reveal, text beats, sticky release, reduced motion
npm run verify:form    # RSVP states, validation, mobile ergonomics
```

Each takes a base URL: `node scripts/verify.mjs http://localhost:3000`.
`verify:form` needs a build with `NEXT_PUBLIC_FORM_ENDPOINT` set; the suite
intercepts the request, so the endpoint value can be a dummy.

Hero contrast is measured, not estimated: each line is hidden, the composite
behind it is screenshotted, and the pixels are decoded and compared against the
line's computed colour.

## Before this goes out

**1. The RSVP endpoint.** The form posts to `NEXT_PUBLIC_FORM_ENDPOINT`.
Create a form at formspree.io and set it in `.env.local`. Without it the form
shows its error state rather than pretending to succeed.

**2. Imagery.** No asset files exist yet. Every image renders a marked
placeholder of the correct shape, so nothing shifts when the real files land.
Drop a file into `public/assets/...` and add its path to `AVAILABLE_ASSETS` in
`app/assets.ts`. That is the only wiring needed.

Outstanding, thirteen generated stills:

| File | Ratio |
|---|---|
| `assets/hero.jpg` | 3:4 |
| `assets/events/haldi.jpg` | 3:4 |
| `assets/events/welcome-dinner.jpg` | 3:4 |
| `assets/events/sehrabandi.jpg` | 3:4 |
| `assets/events/baraat.jpg` | 3:4 |
| `assets/events/pheras.jpg` | 3:4 |
| `assets/events/soiree.jpg` | 3:4 |
| `assets/stay.jpg` | 4:3 |
| `assets/travel.jpg` | 4:3 |
| `assets/closing.jpg` | 16:9 |
| `assets/ornament/floral-column.png` | 9:16 |
| `assets/ornament/peacock.png` | 1:1 |
| `assets/ornament/crest.png` | 1:1 |

Plus `assets/logo.png` (the A K monogram, currently set in type), three
`assets/couple/*.jpg` and two `assets/families/*.jpg`.

Ornament renders on flat cream with `mix-blend-mode: multiply`. Check no grey
box edge shows once the real files are in.

**3. Copy awaiting the couple's own words.** The three story beats in
`app/components/OurStory.tsx` (`I. How We Met`, `II. The Question`,
`III. Forever, From Here`) are placeholders, marked in a comment there.
Everything else is final.

## Sourcing fallback

If Runway output is unusable or credits run out:

- Palace, garden and interior photography: Unsplash and Pexels, searching
  `Jaipur palace`, `Rajasthan haveli`, `marigold`, `mandap`, `Indian wedding`.
  Free for commercial use.
- Botanical ornament and the peacock: public domain antique botanical and
  natural history plates from Rawpixel Public Domain and the Biodiversity
  Heritage Library.

Mixed sources will not sit together ungraded. One shared `.graded` class in
`app/globals.css` applies
`sepia(0.16) saturate(0.88) contrast(0.96) brightness(1.05)` plus an ivory
soft-light overlay at 10%. Tune it there, in one place.

## Notes on two places this departs from the brief

**Accent colour.** The brief specifies `--gold #B08D4F` for every interactive
element. Measured, that is 2.88:1 on ivory and 2.88:1 behind ivory button text,
so it fails WCAG AA for small text. `--gold-deep #7F653D` carries all gold
*text* and interactive fills (5.09:1 on ivory, 4.52:1 on parchment, 5.09:1 for
ivory text on it). `--gold` still draws every hairline, rule and ornament.
One accent, one step darker where it has to carry text. `--dim` was darkened
the same way, from `#9A8770` (3.21:1) to `#776654` (5.11:1).

**Hero type size.** `clamp(1.9rem, 7vw, 4.8rem)` overflowed the arch window at
every width, putting cream glyphs on ivory where they vanish, and clipping the
names at 360px. The names are now `clamp(1.5rem, 5.4vw, 4.1rem)` inside a
width-constrained block. `npm run verify` asserts every hero line stays inside
the arch at 360, 390 and 1440.

The arch is also a crown above the RSVP panel rather than a clip on it.
`clipPathUnits="objectBoundingBox"` means the curve scales with the box, and on
a 2100px tall form it spanned roughly 950px and cut through the fields.
