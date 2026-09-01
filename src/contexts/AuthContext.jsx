import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getUserDoc } from '../services/userService';
import { logOut as logOutService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // the Firebase Auth user, or null
  const [profile, setProfile] = useState(null); // the users/{uid} document, or null
  const [loading, setLoading] = useState(true); // true until we know both

  // Two profile lookups can be in flight at once: the one the auth listener
  // starts, and the one signup asks for straight after writing the document.
  // Only the newest lookup is allowed to write to state, whichever finishes
  // first, so a signing-up vendor never gets stuck with a missing role.
  const latestRequest = useRef(0);

  const loadProfile = useCallback(async (uid) => {
    const requestId = ++latestRequest.current;
    const loaded = uid ? await getUserDoc(uid) : null;
    if (requestId === latestRequest.current) {
      setProfile(loaded);
    }
    return loaded;
  }, []);

  useEffect(() => {
    // Fires once on load and again on every login and logout.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      try {
        await loadProfile(firebaseUser ? firebaseUser.uid : null);
      } catch {
        // Firestore can be unreachable — offline, or a content blocker sitting
        // on firestore.googleapis.com. Signing in still worked; we just do not
        // know the role. Carry on without one rather than hanging.
        setProfile(null);
      } finally {
        // This must run on every path. Leaving loading true renders the
        // "Loading" screen for ever with nothing to act on.
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [loadProfile]);

  // Called by the signup page once users/{uid} has actually been written.
  const refreshProfile = useCallback(
    () => loadProfile(auth.currentUser ? auth.currentUser.uid : null),
    [loadProfile]
  );

  const logout = useCallback(() => logOutService(), []);

  const value = {
    user,
    profile,
    role: profile ? profile.role : null,
    name: profile ? profile.name : '',
    loading,
    refreshProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
