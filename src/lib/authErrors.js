// Firebase error codes are not readable by a human. design.md says errors
// state what happened and what to do, so this is the whole translation table.
const MESSAGES = {
  'auth/email-already-in-use': 'That email is already registered. Log in instead.',
  'auth/invalid-email': 'That email address is not valid. Check it and try again.',
  'auth/weak-password': 'Password is too short. Use at least 6 characters.',
  'auth/invalid-credential': 'That email and password do not match. Try again.',
  'auth/user-not-found': 'No account with that email. Sign up instead.',
  'auth/wrong-password': 'That email and password do not match. Try again.',
  'auth/too-many-requests': 'Too many attempts. Wait a minute and try again.',
  'auth/network-request-failed': 'No connection to the server. Check your network.',
};

export function authErrorMessage(error) {
  return MESSAGES[error?.code] || 'Something went wrong. Try again.';
}
