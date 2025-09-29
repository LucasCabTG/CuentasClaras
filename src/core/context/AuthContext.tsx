'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/core/services/firebase';

interface ActiveProfile {
  id: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  activeProfile: ActiveProfile | null; // The seller profile currently in use
  loading: boolean;
  selectProfile: (profile: ActiveProfile) => void;
  clearActiveProfile: () => void; // To go back to the lock screen
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  role: null, 
  activeProfile: null,
  loading: true,
  selectProfile: () => {},
  clearActiveProfile: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState<ActiveProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('[AuthContext] User detected. Starting session fetch...');
        try {
          console.log('[AuthContext] Getting ID token...');
          const idToken = await user.getIdToken();
          console.log('[AuthContext] Token received. Fetching from /api/auth/get-user-session...');
          
          const response = await fetch('/api/auth/get-user-session', {
            headers: {
              'Authorization': `Bearer ${idToken}`,
            }
          });
          console.log('[AuthContext] API response received with status:', response.status);

          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }

          console.log('[AuthContext] Parsing response JSON...');
          const sessionData = await response.json();
          console.log('[AuthContext] Session data parsed:', sessionData);

          console.log('[AuthContext] Setting role and user state...');
          setRole(sessionData.role || 'vendedor');
          setUser(user);
          console.log('[AuthContext] State update complete.');

        } catch (error) {
          console.error('[AuthContext] CRITICAL: Error fetching user session from API:', error);
          await signOut(auth);
        }
      } else {
        setUser(null);
        setRole(null);
        setActiveProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const selectProfile = (profile: ActiveProfile) => {
    setActiveProfile(profile);
  };

  const clearActiveProfile = () => {
    setActiveProfile(null);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
    setActiveProfile(null);
  };

  const value = {
    user,
    role,
    activeProfile,
    loading,
    selectProfile,
    clearActiveProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  return useContext(AuthContext);
};
