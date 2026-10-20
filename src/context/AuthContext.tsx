import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, UserRole } from '../types';

interface RegisterData { firstName: string; lastName: string; email: string; password: string; phone?: string; }
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: RegisterData) => Promise<boolean>;
  hasRole: (role: UserRole) => boolean;
}
interface RegisteredAccount { email: string; salt: number[]; passwordHash: number[]; user: User; }

const AUTH_STORAGE = 'bms_customer_session';
const ACCOUNTS_STORAGE = 'bms_demo_accounts';
const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'customer@demo.com': { password: 'demo1234', user: { id: 'u-001', email: 'customer@demo.com', firstName: 'Demo', lastName: 'Customer', phone: '+263 71 000 0000', role: 'customer', isVerified: true, createdAt: '2026-01-01T00:00:00Z' } },
  'admin@demo.com': { password: 'admin1234', user: { id: 'u-002', email: 'admin@demo.com', firstName: 'Admin', lastName: 'User', role: 'admin', isVerified: true, createdAt: '2026-01-01T00:00:00Z' } },
  'driver@demo.com': { password: 'driver1234', user: { id: 'u-003', email: 'driver@demo.com', firstName: 'Driver', lastName: 'Demo', role: 'driver', isVerified: true, createdAt: '2026-01-01T00:00:00Z' } },
  'supplier@demo.com': { password: 'supplier1234', user: { id: 'u-004', email: 'supplier@demo.com', firstName: 'Supplier', lastName: 'Demo', role: 'supplier', isVerified: true, createdAt: '2026-01-01T00:00:00Z' } },
};

function readJson<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || 'null') as T || fallback; } catch { return fallback; }
}

async function hashPassword(password: string, salt: Uint8Array<ArrayBuffer>): Promise<number[]> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const result = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, key, 256);
  return Array.from(new Uint8Array(result));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readJson<User | null>(AUTH_STORAGE, null));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(AUTH_STORAGE, JSON.stringify(user));
      else localStorage.removeItem(AUTH_STORAGE);
    } catch {
      // Keep sign-in usable for this session when browser storage is unavailable.
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const demoAccount = DEMO_USERS[normalizedEmail];
      if (demoAccount && demoAccount.password === password) { setUser(demoAccount.user); return true; }
      const accounts = readJson<RegisteredAccount[]>(ACCOUNTS_STORAGE, []);
      const account = accounts.find((entry) => entry.email === normalizedEmail);
      if (!account) return false;
      const candidateHash = await hashPassword(password, new Uint8Array(account.salt));
      const matched = candidateHash.length === account.passwordHash.length && candidateHash.every((byte, index) => byte === account.passwordHash[index]);
      if (matched) setUser(account.user);
      return matched;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => setUser(null);

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const email = data.email.trim().toLowerCase();
      const accounts = readJson<RegisteredAccount[]>(ACCOUNTS_STORAGE, []);
      if (DEMO_USERS[email] || accounts.some((account) => account.email === email)) return false;
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const newUser: User = { id: `u-${Date.now()}`, email, firstName: data.firstName.trim(), lastName: data.lastName.trim(), phone: data.phone?.trim(), role: 'customer', isVerified: false, createdAt: new Date().toISOString() };
      accounts.push({ email, salt: Array.from(salt), passwordHash: await hashPassword(data.password, salt), user: newUser });
      localStorage.setItem(ACCOUNTS_STORAGE, JSON.stringify(accounts));
      setUser(newUser);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: UserRole) => user?.role === role;
  return <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, register, hasRole }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
