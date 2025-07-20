'use client';

import {createContext, useContext, useEffect, useState} from 'react';
import type {User} from 'firebase/auth';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {firebaseApp} from '@/lib/firebase/config';
import {Loader2} from 'lucide-react';

const auth = getAuth(firebaseApp);

export const AuthContext = createContext<{user: User | null}>({
  user: null,
});

export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>
  );
}
