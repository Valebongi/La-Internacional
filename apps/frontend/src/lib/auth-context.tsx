import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useUsersStore, type User } from '@/stores/users.store';

export type AuthUser = User;

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login(email: string, password?: string): Promise<AuthUser>;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_TOKEN = 'lid_token';
const STORAGE_USER = 'lid_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(STORAGE_USER);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_TOKEN));

  const login = useCallback(async (email: string, _password?: string) => {
    await new Promise((r) => setTimeout(r, 300));
    const found = useUsersStore.getState().findByEmail(email);
    if (!found) throw new Error('Usuario no encontrado o inactivo');
    const mockToken = 'mock.' + btoa(found.id) + '.token';
    localStorage.setItem(STORAGE_TOKEN, mockToken);
    localStorage.setItem(STORAGE_USER, JSON.stringify(found));
    setUser(found);
    setToken(mockToken);
    return found;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
    setUser(null);
    setToken(null);
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_TOKEN) setToken(e.newValue);
      if (e.key === STORAGE_USER) setUser(e.newValue ? JSON.parse(e.newValue) : null);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, isAuthenticated: !!token && !!user, login, logout }),
    [user, token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
