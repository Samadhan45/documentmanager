'use client';

import {createContext, useContext, useEffect, useState} from 'react';
import type {User} from 'firebase/auth';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {firebaseApp} from '@/lib/firebase/config';

const auth = getAuth(firebaseApp);

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
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

  return (
    <AuthContext.Provider value={{user, loading}}>
      {children}
    </AuthContext.Provider>
  );
}
