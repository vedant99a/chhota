# Chhota

Pre-order and pickup for a campus canteen. Students order ahead and watch a
live status; the vendor works a queue instead of a crowd.

The problem is not delivery. At peak hours the canteen queue is one
undifferentiated crowd: students wait without knowing how long, and the vendor
takes orders and cooks at the same time, so both jobs get done badly. Chhota
decouples ordering from waiting — place the order from wherever you are, get a
code, come when it says ready.

Full spec in [PRD.md](PRD.md). Design system in [design.md](design.md).

## Stack

| | |
|---|---|
| Build | Vite |
| UI | React 18, React Router v6 |
| Language | JavaScript (no TypeScript) |
| Styling | Tailwind CSS, with the design.md tokens as named theme colours |
| Backend | Firebase v10 — Auth and Firestore only, no Storage |
| Hosting | Vercel |

## Live

**https://chhota.vercel.app**

### Test accounts

Throwaway accounts created for review. They hold no real data and are used
nowhere else.

| Role | Email | Password |
|---|---|---|
| Student | `demo.student@chhota.test` | `mica123` |
| Vendor | `demo.vendor@chhota.test` | `mica123` |

Sign in at `/login`. One login screen serves both — the role stored on the user
record decides which home screen renders. To see the live status update, open
the student in one browser and the vendor in another (or an incognito window):
Firebase signs one account in per browser profile, so two tabs will not do it.

## Running it locally

```bash
git clone https://github.com/vedant99a/chhota.git
cd chhota
npm install
cp .env.example .env   # then fill it in, see below
npm run dev
```

Open http://localhost:5173.

If the page is blank and says the config is missing, `.env` is not filled in.
Vite only reads `.env` at startup, so restart the dev server after editing it.

### Environment variables

All six come from Firebase console → Project settings → General → Your apps →
Web app → SDK setup and configuration. Vite only exposes variables prefixed
`VITE_`. `.env` is gitignored; `.env.example` is the template.

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

A Firebase web config is public by design — it identifies the project, it does
not authorise anything. Firestore rules do the guarding.

### Firebase setup

1. Authentication → Sign-in method → enable **Email/Password**. Nothing else.
2. Firestore → create the database, then deploy the rules:
   ```bash
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules
   ```
   The project id is already set in `.firebaserc`.
3. Deploying anywhere: Authentication → Settings → Authorized domains → add the
   deployed domain, or login works locally but fails on the live site.

## Structure

```
src/
  lib/          firebase init, plus pure helpers with no Firestore in them
                (pickup slots, the status machine, categories)
  services/     every Firestore read and write, and nothing else
  contexts/     AuthContext (user + role), CartContext (cart before checkout)
  components/   shared UI and the route guards
  pages/        one file per screen
```

The rule that keeps this readable: **no Firestore calls inside components.**
A component calls a service; the service talks to Firebase.

## Screens

| Route | Who | What |
|---|---|---|
| `/signup`, `/login` | anyone | One login screen. The role on the user record decides where you land. |
| `/menu` | student | Menu grouped by category, add to cart with quantity |
| `/cart` | student | Line items, quantity steppers, pickup slot, place order |
| `/order/:id` | student | Live status: order code, progress track, items, total |
| `/orders` | student | Past orders, newest first |
| `/queue` | vendor | Open orders oldest-first, one button advancing each |
| `/manage` | vendor | Full CRUD on menu items, availability toggle, delete confirm |
| `/summary` | vendor | Orders today, revenue today, count by status |

## Data model

Four collections. See [PRD.md](PRD.md) section 3 for the field lists.

- `users/{uid}` — name, email, role, createdAt
- `menuItems/{id}` — the core CRUD entity, owned by a vendor
- `orders/{id}` — items embedded, not referenced
- `counters/orders` — a single document holding the order number

## Decisions worth explaining

**Order items are embedded in the order, not referenced.** Name and price are
copied in at order time, so editing a menu item later does not rewrite history.
A ₹40 Maggi ordered last week stays ₹40 in that order.

**Order codes come from a Firestore transaction.** Placing an order reads and
increments `counters/orders` and writes the order in one transaction, so two
students checking out simultaneously cannot collide on `CC-0001`.

**The live status is `onSnapshot`, not polling.** The student's status screen
and the vendor's queue both hold listeners on the same order document. When the
vendor advances the status, the student's screen changes with no refresh.

**Rules are the security boundary, not the UI.** The route guards are
convenience. Anything the client can do, a person can do from the browser
console, so [firestore.rules](firestore.rules) enforces the real constraints:
a student cannot advance their own order to `ready`, cannot change their role
after signup, and cannot read anybody else's orders. A vendor can change an
order's status and nothing else about it. Orders are never deletable.

**Grouping and sorting happen in JavaScript.** Queries stay single `where`
clauses so the project needs no composite Firestore indexes.

## Not built, deliberately

Payments (money changes hands at the counter), image uploads (Firebase Storage
needs billing; categories get a colour block instead), search, notifications,
multiple vendors, slot capacity limits, and light mode. The app is dark. That
is the design.
