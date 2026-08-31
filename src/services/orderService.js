// Every read and write of the orders collection, plus the counter that gives
// each order its code. Components never talk to Firestore directly.
import {
  collection,
  doc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { nextStatus } from '../lib/orderStatus';

const ordersRef = collection(db, 'orders');
const counterRef = doc(db, 'counters', 'orders');

// 'CC-' + the counter value padded to four digits, e.g. CC-0001.
export function formatOrderCode(value) {
  return `CC-${String(value).padStart(4, '0')}`;
}

function toOrder(snapshot) {
  return { id: snapshot.id, ...snapshot.data() };
}

// Placing an order reads and increments counters/orders and writes the order
// itself inside ONE transaction. That is the whole point: two students
// checking out at the same moment cannot come away with the same code,
// because the transaction retries if the counter changed underneath it.
export async function placeOrder({ studentId, studentName, vendorId, items, total, pickupSlot }) {
  const orderRef = doc(ordersRef); // generate the id up front so we can return it

  await runTransaction(db, async (transaction) => {
    // Every read in a transaction has to happen before every write.
    const counterSnapshot = await transaction.get(counterRef);
    const currentValue = counterSnapshot.exists() ? counterSnapshot.data().value : 0;
    const nextValue = currentValue + 1;

    // set rather than update, so the very first order creates the counter.
    transaction.set(counterRef, { value: nextValue });

    transaction.set(orderRef, {
      code: formatOrderCode(nextValue),
      studentId,
      studentName, // denormalised so the vendor queue needs one read
      vendorId,
      // Name and price are copied in at order time. Editing a menu item later
      // must not rewrite history.
      items: items.map((item) => ({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
      total,
      pickupSlot,
      status: 'placed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  return orderRef.id;
}

// One order, live. This is what makes the student's screen change by itself
// when the vendor advances the status.
export function subscribeToOrder(orderId, onOrder, onError) {
  return onSnapshot(
    doc(db, 'orders', orderId),
    (snapshot) => onOrder(snapshot.exists() ? toOrder(snapshot) : null),
    onError
  );
}

// A student's own orders, newest first. Sorted in JS so the query stays a
// single where clause and needs no composite index.
export function subscribeToStudentOrders(studentId, onOrders, onError) {
  const studentOrders = query(ordersRef, where('studentId', '==', studentId));

  return onSnapshot(
    studentOrders,
    (snapshot) => onOrders(snapshot.docs.map(toOrder).sort(byCreatedAtDescending)),
    onError
  );
}

// Every order for one vendor, live. The queue screen filters out the
// collected and cancelled ones itself, again to avoid a composite index.
export function subscribeToVendorOrders(vendorId, onOrders, onError) {
  const vendorOrders = query(ordersRef, where('vendorId', '==', vendorId));

  return onSnapshot(
    vendorOrders,
    (snapshot) => onOrders(snapshot.docs.map(toOrder).sort(byCreatedAtAscending)),
    onError
  );
}

// Forward only. The next status is worked out from the current one rather
// than passed in, so a stale button cannot skip a step.
export async function advanceOrder(orderId, currentStatus) {
  const target = nextStatus(currentStatus);
  if (!target) return null;

  await updateDoc(doc(db, 'orders', orderId), {
    status: target,
    updatedAt: serverTimestamp(),
  });

  return target;
}

// Cancelling is a sideways move out of the flow, not a step along it, so it is
// its own function rather than part of advanceOrder. The rules enforce that it
// is only legal from placed or preparing.
export async function cancelOrder(orderId) {
  await updateDoc(doc(db, 'orders', orderId), {
    status: 'cancelled',
    updatedAt: serverTimestamp(),
  });
}

// createdAt is null for a moment after placing an order, while the write is
// still pending on the server. Treat those as newest.
function createdAtMillis(order) {
  return order.createdAt ? order.createdAt.toMillis() : Number.MAX_SAFE_INTEGER;
}

function byCreatedAtAscending(a, b) {
  return createdAtMillis(a) - createdAtMillis(b);
}

function byCreatedAtDescending(a, b) {
  return createdAtMillis(b) - createdAtMillis(a);
}
