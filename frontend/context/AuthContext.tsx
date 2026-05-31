import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authService, type AuthInput, type RegisterInput, type AuthResponse } from '../services/api';

interface User {
  uuid: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: AuthInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      uuid: payload.uuid || payload.sub,
      firstName: payload.firstName,
      lastName: payload.lastName,
      username: payload.username,
      email: payload.email,
      role: payload.role || 'BASIC',
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('hawapi_token');
    if (stored) {
      const decoded = decodeToken(stored);
      if (decoded && decoded.email) {
        setToken(stored);
        setUser(decoded);
      } else {
        localStorage.removeItem('hawapi_token');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (data: AuthInput) => {
    const res: AuthResponse = await authService.authenticate(data);
    localStorage.setItem('hawapi_token', res.token);
    setToken(res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (data: RegisterInput) => {
    const res: AuthResponse = await authService.register(data);
    localStorage.setItem('hawapi_token', res.token);
    setToken(res.token);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('hawapi_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
