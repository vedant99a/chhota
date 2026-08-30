# Chhota

Pre-order and pickup for a campus canteen. Students order ahead and watch a live
status; the vendor works a queue instead of a crowd.

Spec: [PRD.md](PRD.md). Design system: [design.md](design.md).

## What exists so far

Session 1 only: scaffold and authentication.

- Sign up with name, email, password and a student/vendor role
- Log in, log out
- `/` redirects by role — student to `/menu`, vendor to `/queue`
- `/menu` and `/queue` are placeholders

## Running it

1. Copy the Firebase web config into `.env` (see `.env.example` for the keys).
2. `npm install`
3. `npm run dev` and open http://localhost:5173

If the page is blank and says the config is missing, `.env` is not filled in.
Vite only reads `.env` at startup, so restart the dev server after editing it.

## Firebase setup

- Authentication → Sign-in method → enable **Email/Password**.
- Firestore → Rules → paste [firestore.rules](firestore.rules) and publish.
  Firestore in production mode denies everything by default, so without this
  signup fails when it writes `users/{uid}`.
- After deploying: Authentication → Settings → Authorized domains → add the
  deployed domain, or login works locally but not on the live site.

## Structure

```
src/
  lib/firebase.js       Firebase init, reads VITE_* from .env
  lib/authErrors.js     Firebase error codes to readable sentences
  contexts/AuthContext  Current user, their role, loading, logout
  services/             Every Firestore and Auth call lives here
  components/           Shared UI and the route guards
  pages/                One file per screen
```

The rule that keeps this readable: **no Firestore calls inside components.**
Components call a service, the service talks to Firebase.
