'use client';

import { User, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth as rawAuth } from './firebase';

// firebase auth is initialized only in the browser and exported as unknown from firebase.ts
const auth = rawAuth as any;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase was not initialized (auth is null), skip subscribing.
    if (!auth || typeof window === 'undefined') {
      // No firebase auth available (env not set) — don't subscribe
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth as any, (user: User | null) => {
      if (user) setUser(user);
      else setUser(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}

export async function getIdToken(): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
}

export { auth };
