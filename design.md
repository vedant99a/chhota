# Chhota — design system

The app is a departure board. The product is a queue with states, so it should look like the thing that has always displayed queues with states: a board in a terminal. Dark, monospaced, precise, one warm accent.

This file is authoritative. If a screen looks like a generic food-delivery app, it's wrong.

---

## Colour

Dark only. There is no light mode.

| Token | Hex | Used for |
|---|---|---|
| `canvas` | `#12140F` | Page background. Warm near-black, never pure `#000`. |
| `surface` | `#1A1D16` | Cards, metric tiles, input backgrounds |
| `border` | `#2A2D25` | All hairlines and dividers |
| `text` | `#E8EAE2` | Primary text |
| `muted` | `#6E7466` | Labels, metadata, disabled, placeholder |
| `accent` | `#F2A93C` | Amber. Order codes, active status, primary buttons, progress fill. |
| `accent-dim` | `#7A5A1E` | Amber at rest — inactive progress segments, subtle accent borders |
| `ready` | `#86C34A` | **Semantic only.** The `ready` status, nothing else. |
| `danger` | `#D9553F` | Destructive confirms and errors only |

Rules:
- Amber is the only decorative colour. Everything else is the neutral ramp.
- `ready` green appears in exactly one place in the whole app. Don't spread it.
- No gradients, no glows, no shadows. Depth comes from `surface` sitting on `canvas` and from hairline borders.

---

## Type

Two families, both free on Google Fonts:

- **Inter** — all prose, labels, buttons, item names
- **JetBrains Mono** — every number and identifier

The monospace rule is the whole visual identity. Anything that is a **quantity or an ID** is monospace: order codes, prices, totals, times, slot labels, counts, revenue. Anything that is **language** is Inter.

| Role | Size | Weight | Family |
|---|---|---|---|
| Order code (hero) | 38px | 400 | Mono |
| Screen heading | 20px | 500 | Inter |
| Body / item name | 14px | 400 | Inter |
| Metric number | 20px | 400 | Mono |
| Label / metadata | 11px | 400 | Inter, `letter-spacing: 0.08em` |
| Price / time inline | 13px | 400 | Mono |

Sentence case everywhere. Never all-caps, never title case. Minimum font size 11px.

---

## Layout

- Mobile-first, max content width `420px`, centred. It will be demoed on a phone-shaped window.
- Page padding `16px`. Card padding `14px`.
- Border radius: `8px` on cards and inputs, `22px` only on the outer app frame if you draw one, `50%` on status dots.
- Vertical rhythm in multiples of `4px`. Section gaps `18px` or `22px`.
- Rows in a list are separated by a `0.5px` bottom border, not by gaps or individual cards. Dense list, not floating cards.

---

## Components

**Buttons.** Primary: amber background, `#12140F` text, `8px` radius, `44px` tall, full width where it's the main action. Secondary: transparent, `1px` border in `border`, `text` colour. Destructive: transparent with `danger` text and border. One primary button per screen, maximum.

**Inputs.** `surface` background, `1px` `border`, `44px` tall, `text` colour, `muted` placeholder. Focus: border becomes `accent`. No focus glow.

**Status indicator.** A `7px` filled dot plus a word. Colours: `placed` → `muted`, `preparing` → `accent`, `ready` → `ready`, `collected` → `muted`, `cancelled` → `danger`.

**Progress track.** Four `3px` bars in a row with `4px` gaps, filling left to right as status advances. Filled = `accent`, empty = `border`.

**Metric tile.** `surface` background, no border, `8px` radius, `12px` padding. `11px` `muted` label on top, `20px` mono number below.

**Category block.** Since there are no item images, each category gets a `4px` wide vertical amber bar at `40%` opacity on the left edge of its section header. That is the entire visual treatment. Don't add icons.

**Empty states.** One line of `muted` text and, if there's an action, one secondary button. No illustrations.

---

## Voice

Terse and factual, like a board. "Preparing", not "We're preparing your order!". "4 min", not "About 4 minutes remaining".

- No exclamation marks anywhere.
- No emoji anywhere.
- Errors say what happened and what to do: "That email is already registered. Log in instead."
- Buttons are verb-first and one to three words: "Place order", "Add item", "Mark ready".
- Currency always as `₹` immediately followed by a monospace number, no space.

---

## Don't

- No cards with shadows
- No rounded pill buttons
- No hero images or food photography
- No progress spinners longer than a hairline bar
- No second accent colour
- No animation beyond a `150ms` colour transition on hover and status change
