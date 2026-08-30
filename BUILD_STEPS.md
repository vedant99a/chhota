# Chhota — build runbook

Target: deployed, working, submitted by 28 August. Realistic build window is 21–27 August, after the SIP goes in.

The structure below is five short Claude Code sessions rather than one long one. This matters more than it sounds. One giant prompt produces an app that half-works everywhere and fully works nowhere, and you won't be able to tell which part broke. Five sessions each end with something you can see working.

---

## Session 0 — Accounts and tools (60–90 min, no coding)

Do this the evening before. It is entirely setup friction and it will take longer than you expect.

1. **Node.js** — install the LTS build from nodejs.org. Verify in a terminal: `node -v` should print v20 or higher.
2. **GitHub account**, then create an empty **public** repo called `chhota`. Don't initialise it with any files.
3. **Vercel account** at vercel.com — sign up with GitHub, which authorises the connection between the two in one step. Nothing else to configure yet.
4. **Firebase project** at console.firebase.google.com:
   - Create a project called `chhota`. Decline Google Analytics.
   - Build → Authentication → Get started → enable **Email/Password** only. Do not enable phone.
   - Build → Firestore Database → Create database → **production mode** → region `asia-south1` (Mumbai).
   - Project settings → General → scroll down → Add app → **Web** (the `</>` icon) → register it → copy the `firebaseConfig` object into a scratch file. You need those six values shortly.
   - Ignore Storage entirely. You are not using it.
5. **Claude Code** (or Gemini CLI if you're going free) installed and logged in.
6. Create a working folder and put three files in it: `PRD.md`, `design.md`, and this file.

Do not skip the config copy in step 4. Every session after this needs those six values.

---

## Session 1 — Scaffold and auth

**Goal:** you can sign up, log out, log in, and land on a different empty page depending on your role.

Open Claude Code in the folder and give it this:

> Read PRD.md and design.md in this folder before doing anything. They are the specification — follow them exactly, especially the colour tokens and typography rules in design.md.
>
> This session, build only the scaffold and authentication. Do not build the menu, cart, orders, or queue yet.
>
> Stack: React with Vite, JavaScript not TypeScript, React Router v6, Tailwind CSS, Firebase v10 (auth and firestore only, no storage). Keep it simple and readable — this is a student project that I need to be able to explain out loud, so prefer obvious code over clever code.
>
> Structure it as: `src/lib/firebase.js` for the Firebase init, `src/contexts/AuthContext.jsx` for auth state and the current user's role, `src/pages/` for screens, `src/components/` for shared UI, `src/services/` for all Firestore reads and writes. No Firestore calls inside components — they go in services.
>
> Build:
> 1. Project scaffold, Tailwind configured with the design.md colour tokens as named theme colours, Inter and JetBrains Mono loaded from Google Fonts.
> 2. `src/lib/firebase.js` reading config from a `.env` file with `VITE_` prefixed variables. Add `.env` to `.gitignore` and commit a `.env.example`.
> 3. Sign up page: name, email, password, and a student/vendor role picker. On submit, create the auth user and a matching `users/{uid}` document with the role.
> 4. Log in page.
> 5. `AuthContext` exposing current user, their role, loading state, and a logout function.
> 6. A `ProtectedRoute` that redirects to `/login` when logged out, and a `/` route that redirects to `/menu` for students and `/queue` for vendors.
> 7. Placeholder pages at `/menu` and `/queue` that just show the role and a working logout button.
>
> Stop there. Tell me what to put in `.env` and how to run it.

Then: fill in `.env` with your Firebase config, run `npm run dev`, and sign up twice — once as a student, once as a vendor, using two different emails. Confirm you land on different pages.

Commit and push to GitHub before moving on.

---

## Session 2 — Deploy immediately

**Goal:** the app is on the internet. It does almost nothing, and that's fine.

Deploy now, while there are four files, rather than on the 27th when there are forty. If the pipeline is broken you want to find out cheaply.

No terminal needed for this one — it's four browser steps.

1. Push your Session 1 work to GitHub if you haven't.
2. On vercel.com, click **Add New → Project**, and import the `chhota` repo. Vercel detects Vite on its own; don't change the build settings.
3. Before clicking Deploy, expand **Environment Variables** and add all six `VITE_` variables from your `.env`, with their values. This is the step everyone forgets — `.env` is gitignored, so without this you get a blank white page.
4. Deploy. You'll get a URL like `chhota.vercel.app` in about a minute.

Then one thing in the Firebase console, and it is not optional:

**Authentication → Settings → Authorized domains → Add domain → `chhota.vercel.app`**

Skip this and login fails on the live site while working perfectly on localhost, which is a genuinely confusing hour to lose.

Now open the live URL and sign up on it. If that works, your pipeline is done.

**From here, deploys are automatic.** Every push to your main branch rebuilds and redeploys within a minute or two. So the rule for the rest of the build is just: commit and push at the end of every session, and the live URL is never stale. If you add any new environment variable later, add it in the Vercel dashboard too and redeploy.

---

## Session 3 — CRUD on menu items

**Goal:** the vendor can fully manage a menu. This is the graded CRUD requirement, so make it clean.

> Now build the vendor menu management from PRD.md — the `/manage` and `/manage/new` and `/manage/:id` screens.
>
> Full CRUD on the `menuItems` collection: create, read, update, delete, plus the availability toggle as a separate action from delete. Delete needs a confirm step. One reusable form component serving both create and edit.
>
> All Firestore access goes in `src/services/menuService.js`. Group items by category on the manager screen. Follow the list-row styling in design.md — hairline dividers, not individual cards.
>
> Only show items where `vendorId` matches the current user.

Test every letter of CRUD before moving on: add three items across two categories, edit a price, toggle one unavailable, delete one.

---

## Session 4 — The order flow

**Goal:** the demo from section 7 of the PRD works end to end. This is the biggest session — expect it to take the longest and to need the most correction.

> Now build the order flow from PRD.md: the student menu, cart, order placement, live status screen, and the vendor queue.
>
> Key requirements:
> - Order codes generated inside a Firestore transaction on `counters/orders`, formatted `CC-0001`.
> - Cart state lives in a React context, not in Firestore, until the order is placed.
> - Pickup slots are 15-minute intervals from now until 21:00, excluding any slot less than 15 minutes away.
> - The student's status screen and the vendor's queue both use `onSnapshot` listeners so they update live without a refresh. This is the most important behaviour in the app.
> - Status advances forward only: placed → preparing → ready → collected. The vendor's advance button should show the next status as its label. Collected orders leave the queue.
> - Order items are copied into the order document with their name and price at time of order.
>
> All Firestore access in `src/services/orderService.js`.

Then test it properly: two browser windows side by side, one logged in as each role. Place an order in one, advance it in the other, watch the first update. If that doesn't work live, fix it before anything else — it's the centrepiece of your video.

---

## Session 5 — Security rules, history, summary, polish

**Goal:** submittable.

> Three things:
>
> 1. Write `firestore.rules` and deploy them. Required behaviour: only signed-in users read anything; a user can only write their own `users` document and can't change their own role after creation; only vendors can write `menuItems`; students can create orders and read only their own; vendors can read all orders and update only the `status` and `updatedAt` fields; nobody can delete an order.
> 2. Build the student order history at `/orders` and the vendor today's summary at `/summary` from the PRD.
> 3. Write the README: what the app is, the stack, setup instructions with the `.env.example` variables, the live URL, and test credentials for both roles.

The security rules matter more than they look. Firestore's test-mode rules expire after 30 days and lock the database, and a reviewer opening your app to a permission error is the worst possible outcome. Write real rules.

Then create clean demo accounts — something like `student@chhota.app` and `vendor@chhota.app` with a simple shared password — and seed the vendor account with 6–8 realistic menu items. Those are the credentials you put in the Google Form.

---

## Session 6 — Loom (27 August)

Five to eight minutes. Script it roughly; don't wing it.

- **0:00–1:00 — Problem.** Lead with your Chhota Canteen observation. You did ethnographic fieldwork there; use it. The queue is undifferentiated, the vendor is doing two jobs at once, nobody knows what's ready. That opening is worth real marks under "clarity of explanation" and almost nobody else will have one.
- **1:00–4:00 — Demo.** Two windows side by side. Vendor adds an item; student sees it. Student orders; code appears. Vendor advances; student's screen changes live. Advance to collected; it leaves the queue and lands in history.
- **4:00–6:00 — How it's built.** Stack, then the three decisions worth naming: one login screen with role-based routing rather than separate portals; order items denormalised into the order document so price history survives menu edits; the counter transaction for collision-free order codes.
- **6:00–7:00 — Tools.** Be specific, they've asked for it. PRD written in Claude, screens referenced from Mobbin, visual direction specified in a design.md, built with Claude Code against those two documents, Firebase for auth and data, Firebase Hosting for deploy.
- **Close** with known issues. Naming them yourself reads as judgement, not weakness.

---

## When it breaks

It will. The loop is always the same: copy the entire error — terminal output or browser console, whichever is red — paste it to Claude Code, and add one sentence about what you were doing when it happened. Don't paraphrase the error. Don't fix it yourself by guessing.

Three specific things that will probably bite:

- **A blank white page on the live URL, but fine on localhost.** Your `VITE_` environment variables aren't set in the Vercel dashboard, or you added one after the last deploy. Set them, then redeploy.
- **Login works locally but fails on the live URL.** The Vercel domain isn't in Firebase's authorized domains list. This one gives an unhelpful error, so check it first.
- **"Missing or insufficient permissions."** Your Firestore rules. Check them against what the code is actually trying to read.

And commit after every working session. A working state you can return to is worth more than any single feature.
