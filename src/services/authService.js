// All Firebase Auth calls live here so the pages only deal with plain values.
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createUserDoc } from './userService';

// Two steps, in this order: create the auth user, then write users/{uid}.
// The Firestore write needs the uid, and the security rules need the user to
// already be signed in, so it cannot happen the other way round.
export async function signUp({ name, email, password, role }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await createUserDoc(credential.user.uid, { name, email, role });
  return credential.user;
}

export async function logIn({ email, password }) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logOut() {
  await signOut(auth);
}
