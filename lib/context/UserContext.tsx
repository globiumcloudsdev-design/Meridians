"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getProfile } from '@/lib/services/authService';
import { User } from '@/lib/types';

interface UserContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  fetchProfile: (token?: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (storedToken) {
      setToken(storedToken);
      fetchProfile(storedToken).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (tk?: string) => {
    try {
      setLoading(true);
      const t = tk || token;
      if (!t) return;
      const userData = await getProfile(t);
      setUser(userData);
    } catch (e) {
      setUser(null);
      setToken(null);
      if (typeof window !== 'undefined') localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, token, loading, setUser, setToken, fetchProfile, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
