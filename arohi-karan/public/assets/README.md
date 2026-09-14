# Where each image goes

Save the Runway downloads here, using these names. The **extension does not
matter** — `hero.png` satisfies the `hero.jpg` slot, so there is no need to
convert anything. Only the name before the dot is matched.

`app/assets.ts` is regenerated from this folder on every build, so there is no
list to edit. Drop files in, then run `npm run bundle:review`.

## Careful: three prompts were generated twice

Pick the second one in each pair. The first attempt is the rejected one.

| Slot | Use the Runway item starting | NOT this one |
|---|---|---|
| `hero` | "An open sunlit palace courtyard photographed from the middle..." | "A sunlit palace courtyard seen straight on..." (has an archway across the foreground, which collides with the CSS arch) |
| `ornament/floral-column` | "A tall narrow vertical band of botanical ornament..." | "A vertical botanical border in the style of an antique..." (full rectangular page border) |
| `ornament/peacock` | "A single peacock standing in profile, Rajasthani miniature painting style..." | "A single peacock in profile in the style of a Rajasthani min..." (inside a gold picture frame) |

The blush rose ("A single blush pink garden rose...") was the watermark test.
It is not used anywhere.

## The full list

```
public/assets/
├── hero.jpg              An open sunlit palace courtyard photographed from the middle...
├── stay.jpg              A palace suite at golden hour. A carved four poster bed...
├── travel.jpg            A palace entrance at dawn. A vintage cream car waiting...
├── closing.jpg           A palace facade at dusk, every arch and window warmly lit...
├── logo.png              (none generated: the A K monogram, currently set in type)
├── events/
│   ├── haldi.jpg             A palace garden laid for a daytime lunch...
│   ├── welcome-dinner.jpg    A palace hall dressed for a formal dinner...
│   ├── sehrabandi.jpg        A quiet carved stone chamber, morning light through a jali...
│   ├── baraat.jpg            A palace forecourt at midday dressed for a procession...
│   ├── pheras.jpg            A wedding mandap in a formal charbagh garden...
│   └── soiree.jpg            A palace ballroom in the evening. Chandeliers lit...
├── ornament/
│   ├── floral-column.png     A tall narrow vertical band of botanical ornament...
│   ├── peacock.png           A single peacock standing in profile, Rajasthani miniature...
│   └── crest.png             A small symmetrical gold floral crest, fine line work...
├── couple/               real photographs, any names, three of them
└── families/             real photographs, any names, two of them
```

`couple/` and `families/` are wired to `couple/met.jpg`, `couple/question.jpg`,
`couple/forever.jpg`, `families/dalwadi.jpg` and `families/sharma.jpg`. Nothing
is generated for these: the brief forbids depicting Arohi, Karan or any family
member, so they need real photographs.

## Two crops before use

Both composite with `mix-blend-mode: multiply`, where cream disappears over the
ivory page but grey and taupe do not.

- `ornament/peacock.png` — trim the grey margin so only the cream sheet remains.
- `ornament/floral-column.png` — keep only the central vertical floral band and
  discard the taupe panel border.

## Size

Downscale before saving: `hero` to about 1200px on its long edge, everything
else to about 900px, saved as JPEG. The Runway PNGs are large, and the brief
holds the first mobile load under 3 MB. `npm run verify` measures and reports it.
