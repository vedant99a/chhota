# Chhota — PRD

A pre-order and pickup app for a campus canteen. Students order ahead and get a live status; the vendor runs a queue instead of a crowd.

**Working name:** Chhota. Change it if you want — it appears only in the header, the page title, and the README.

---

## 1. Problem

At peak hours the canteen queue is one undifferentiated crowd. Students wait without knowing how long. The vendor takes orders and cooks at the same time, so both jobs get done badly. Nobody knows what's actually ready.

The fix isn't delivery. It's **decoupling ordering from waiting**: place the order from wherever you are, get a code, come when it says ready.

---

## 2. Users and roles

Two roles, chosen at signup, stored on the user document. There is **one** login screen — the role on the user record decides which home screen renders after auth.

| Role | Does |
|---|---|
| `student` | Browses the menu, places orders, tracks status |
| `vendor` | Manages menu items, advances orders through the queue |

No admin or support role. Out of scope.

---

## 3. Data model (Firestore)

Four collections. `menuItems` is the core CRUD entity.

### `users/{uid}`
```
name        string
email       string
role        'student' | 'vendor'
createdAt   timestamp
```

### `menuItems/{id}`  ← core CRUD entity
```
name        string          e.g. "Maggi, extra masala"
price       number          in rupees, integer
category    string          'snacks' | 'meals' | 'beverages' | 'desserts'
available   boolean         soft toggle, separate from delete
vendorId    string          uid of the owning vendor
createdAt   timestamp
updatedAt   timestamp
```

### `orders/{id}`
```
code          string        'CC-0472' — human-facing, shown everywhere
studentId     string
studentName   string        denormalised so the vendor queue needs one read
vendorId      string
items         array of { menuItemId, name, price, qty }
total         number
pickupSlot    string        '16:15' — 15-min slots
status        'placed' | 'preparing' | 'ready' | 'collected' | 'cancelled'
createdAt     timestamp
updatedAt     timestamp
```

Order items are **embedded in the order**, not a subcollection. Name and price are copied in at order time so that editing a menu item later doesn't rewrite history. Say this in the Loom — it's a real modelling decision.

### `counters/orders`
```
value       number
```
Single document. Incremented inside a Firestore transaction to generate sequential order codes. Format: `CC-` + value padded to 4 digits.

---

## 4. Screens

### Shared
| Screen | Route | Contains |
|---|---|---|
| Sign up | `/signup` | Name, email, password, role picker (student / vendor) |
| Log in | `/login` | Email, password |

After auth, `/` redirects by role: student → `/menu`, vendor → `/queue`.
Logout is a header button, not a screen.

### Student
| Screen | Route | Contains |
|---|---|---|
| Browse menu | `/menu` | Items grouped by category. Unavailable items shown greyed and not addable. Add-to-cart with quantity. Cart count badge in header. |
| Cart | `/cart` | Line items with quantity steppers, remove, running total, pickup slot picker, "Place order" button |
| Live order status | `/order/:id` | Large order code, current status, 4-step progress track, item list, pickup slot, total |
| Order history | `/orders` | Past orders, newest first, code + date + total + final status. Tap to reopen the status screen. |

### Vendor
| Screen | Route | Contains |
|---|---|---|
| Live order queue | `/queue` | Open orders oldest-first. Each row: code, student name, item count, total, current status, and a single button advancing to the next status. Collected orders drop off the list. |
| Menu manager | `/manage` | All own items grouped by category. Per row: availability toggle, edit, delete (with confirm). "Add item" button. |
| Add or edit item | `/manage/new`, `/manage/:id` | Name, price, category, available. Same component for both. |
| Today's summary | `/summary` | Orders today, revenue today, count by status |

---

## 5. Core business flow

This is the part being graded on logic. The status machine:

```
placed → preparing → ready → collected
```

Forward-only. No skipping, no going back. `cancelled` is reachable from `placed` or `preparing` only.

**Student side:** browse → add to cart → pick a pickup slot → place order → land on the status screen and watch it change.

**Vendor side:** new order appears in the queue at `placed` → tap to advance to `preparing` → tap to advance to `ready` → tap to advance to `collected`, at which point it leaves the queue.

Both sides read the same order document. Use Firestore's `onSnapshot` listener so the student's screen updates without a refresh when the vendor advances the status. This live-update behaviour is the single most demo-able thing in the app — put it in the Loom with two browser windows side by side.

**Pickup slots:** 15-minute slots generated from the current time to closing (assume 21:00). Slots less than 15 minutes out are not offered. No capacity limits per slot — out of scope.

**Order codes:** generated in a Firestore transaction that reads and increments `counters/orders`, so two simultaneous orders can't collide on the same code.

---

## 6. Explicitly out of scope

Do not build these, even if there's time left:

- Payments of any kind. Order is recorded as placed; money changes hands at the counter.
- Image uploads for menu items. Firebase Storage requires a billing account. Use a category colour block instead.
- Search, filters, recommendations, ratings, reviews
- Push notifications, email, SMS
- Multiple vendors or vendor discovery — one canteen
- Slot capacity limits, order editing after placement, refunds
- Phone / OTP authentication — email and password only
- Dark/light mode toggle. The app is dark. That's the design.

---

## 7. Definition of done

1. A student signs up, logs in, browses the menu, adds two items, picks a slot, places an order, sees `CC-0001` at status `placed`.
2. In a second browser, a vendor logs in, sees that order in the queue, and advances it to `preparing`. The student's screen updates without a refresh.
3. The vendor adds a new menu item, edits its price, toggles it unavailable, and deletes a different one. The student's menu reflects each change.
4. The vendor advances the order to `ready` and then `collected`. It leaves the queue and appears in the student's order history.
5. All of the above works on the deployed URL, not just locally.
