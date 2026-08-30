// Every read and write of the menuItems collection lives here.
// Components never talk to Firestore directly.
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const menuItemsRef = collection(db, 'menuItems');

// Live list of one vendor's items. onSnapshot re-fires on every change, so the
// manager screen never has to re-fetch after an edit, a toggle or a delete.
// Returns the unsubscribe function, which the caller must run on unmount.
export function subscribeToVendorItems(vendorId, onItems, onError) {
  const vendorItems = query(menuItemsRef, where('vendorId', '==', vendorId));

  return onSnapshot(
    vendorItems,
    (snapshot) => {
      onItems(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
    },
    onError
  );
}

// The whole menu, live, for the student browse screen. There is one canteen,
// so students see every item rather than filtering by vendor. Unavailable
// items are included: the menu greys them out rather than hiding them.
export function subscribeToMenu(onItems, onError) {
  return onSnapshot(
    menuItemsRef,
    (snapshot) => {
      onItems(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
    },
    onError
  );
}

// One item, for the edit form. Returns null if it does not exist.
export async function getMenuItem(id) {
  const snapshot = await getDoc(doc(db, 'menuItems', id));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

// menuItems/{id} — shape is in PRD.md section 3. Every field is written on
// create so the document is never half-formed.
export async function createMenuItem({ name, price, category, available, vendorId }) {
  const created = await addDoc(menuItemsRef, {
    name,
    price,
    category,
    available,
    vendorId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return created.id;
}

// vendorId and createdAt are deliberately not touched — an item does not change
// owner, and the creation time is history.
export async function updateMenuItem(id, { name, price, category, available }) {
  await updateDoc(doc(db, 'menuItems', id), {
    name,
    price,
    category,
    available,
    updatedAt: serverTimestamp(),
  });
}

// The availability toggle is its own action, separate from delete: taking an
// item off the menu for the day is not the same as removing it for good.
export async function setMenuItemAvailability(id, available) {
  await updateDoc(doc(db, 'menuItems', id), {
    available,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMenuItem(id) {
  await deleteDoc(doc(db, 'menuItems', id));
}
