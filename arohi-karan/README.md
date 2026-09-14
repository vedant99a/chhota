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

Produces one self-contained `.html`, around 3.6 MB, with every stylesheet,
script, font and image inlined as data URIs. It opens straight from a phone, an
email attachment or a USB stick with no server and no network. The scroll driven
arch, the live countdown and the form all work offline. The Google map is the one
exception: that iframe needs a connection.

Three things keep it phone-sized. Images are WebP rather than JPEG, which is
about 40% smaller at the same quality. The bundler drops the 22 `@font-face`
blocks covering Cyrillic, Vietnamese and Latin-Extended, keeping only basic
Latin: a browser never downloads unused subsets, but this bundle inlines
everything it can see. And `app/assets.ts` is generated, so it is gitignored,
because `bundle` writes a 1.2 MB data URI version of it that must never be
committed.

**The page must stay readable with JavaScript disabled.** Phone attachment
previews in WhatsApp, Gmail and Files do not run scripts. Framer Motion renders
its `initial` state into the server markup, so without the `<noscript>` override
in `app/layout.tsx` every revealed block sits at `opacity: 0` and the entire
page below the hero is blank. `npm run verify` asserts this; it fails with
"39 revealed blocks, 39 still hidden" if the override is removed.

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

**2. Imagery is in.** All thirteen generated stills are cropped, downscaled and
in `public/assets`. `app/assets.ts` is regenerated from that folder on every
build, and lookups ignore the file extension, so replacing any image is a matter
of dropping the new file in.

Two ornaments needed work before they would composite. Both use
`mix-blend-mode: multiply`, where pure white is a no-op but cream is not:

- `ornament/peacock.jpg` was a cream sheet photographed on grey. Cropped to the
  sheet, detected at 114,90 to 966,994, with a further 12px inset so no fringe
  survives.
- `ornament/floral-column.jpg` comes from the page-border generation, not the
  one prompted as a band. The band version put its flowers on taupe, which
  multiply cannot hide; the page border put them on cream, and its left edge
  inside the ruled frame is exactly the vertical column this needs.

All three ornaments then had their white point stretched per channel so the
paper reads as 255 and disappears under multiply. Without it the crest showed
as a visible pale square against the ivory page.

Still missing, deliberately: `logo.png` (the A K monogram, currently set in
type), three `couple/*.jpg` and two `families/*.jpg`. The brief forbids
generating Arohi, Karan or any family member, so those need real photographs.

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
