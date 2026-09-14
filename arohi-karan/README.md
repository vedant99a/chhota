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

## A single file you can send

```
npm run bundle:review     # arohi-and-karan-review.html, with a "what is not
                          # finished yet" header for reviewers
npm run bundle            # same page, no header
```

Produces one self-contained `.html`, around 1.7 MB, with every stylesheet,
script and font inlined as data URIs. It opens straight from a phone, an email
attachment or a USB stick with no server and no network. The scroll driven arch,
the live countdown and the form all work offline. The Google map is the one
exception: that iframe needs a connection.

The header only appears when `NEXT_PUBLIC_REVIEW_BANNER` is set at build time,
so it can never reach a real deployment.

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

**2. Imagery.** All thirteen stills were generated and sit in the Runway
library at app.runwayml.com, ready to download. They could not be written into
this repo directly: Runway's CDN is blocked by the egress policy of the
environment this was built in. Download them there, save them under
`public/assets/...` using the filenames below, and add each path to
`AVAILABLE_ASSETS` in `app/assets.ts`. That is the only wiring needed, and
every placeholder is already the right shape so nothing shifts.

| File | Ratio | Status |
|---|---|---|
| `assets/hero.jpg` | 3:4 | Ready. Open courtyard, no arch in the image |
| `assets/events/haldi.jpg` | 3:4 | Ready |
| `assets/events/welcome-dinner.jpg` | 3:4 | Ready |
| `assets/events/sehrabandi.jpg` | 3:4 | Ready |
| `assets/events/baraat.jpg` | 3:4 | Ready |
| `assets/events/pheras.jpg` | 3:4 | Ready |
| `assets/events/soiree.jpg` | 3:4 | Ready |
| `assets/stay.jpg` | 4:3 | Ready |
| `assets/travel.jpg` | 4:3 | Ready |
| `assets/closing.jpg` | 16:9 | Ready |
| `assets/ornament/crest.png` | 1:1 | Usable. Carries an off centre dusty rose wash behind the gold crest |
| `assets/ornament/peacock.png` | 1:1 | **Crop before use.** Trim the grey margin so only the cream sheet remains |
| `assets/ornament/floral-column.png` | 9:16 | **Crop before use.** Keep only the central vertical floral band, roughly the middle fifth of the width; discard the taupe panel border |

The two ornament crops matter because both are composited with
`mix-blend-mode: multiply`. Cream multiplies away invisibly over the ivory
page; the grey margin and the taupe border would not, and would show as the
grey box edge to watch for. Each is a few seconds of work in any image editor.

Two generation notes, in case you re-roll anything. First, negative
instructions do not work on this model: "do not include an archway" produced a
large foreground archway, and "no frame, no scenery" produced a framed plate
three times out of three. Describe what you want present instead, and describe
the camera position rather than negating the object. Second, the ornament
prompts are the ones that need this most, because the model's prior for
"botanical plate" is a framed antique print.

Still missing entirely: `assets/logo.png` (the A K monogram, currently set in
type), three `assets/couple/*.jpg` and two `assets/families/*.jpg`. Those are
deliberate. The brief forbids generating Arohi, Karan or any family member, so
they need real photographs.

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
