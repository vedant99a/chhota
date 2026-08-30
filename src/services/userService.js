// Every read and write of the users collection lives here.
// Components never talk to Firestore directly.
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// users/{uid} — shape is in PRD.md section 3.
export async function createUserDoc(uid, { name, email, role }) {
  await setDoc(doc(db, 'users', uid), {
    name,
    email,
    role,
    createdAt: serverTimestamp(),
  });
}

// Returns the user document, or null if it does not exist yet.
export async function getUserDoc(uid) {
  const snapshot = await getDoc(doc(db, 'users', uid));
  return snapshot.exists() ? { uid, ...snapshot.data() } : null;
}
