import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: 'READER' | 'PARTNER' | 'ADMIN';
  avatar?: string;
}

const AUTH_KEY = 'auth_data';

interface StoredAuth {
  token: string;
  user: User;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  /** Lưu session sau khi gọi API đăng nhập / đăng ký thành công */
  setSession: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return;
    try {
      const { token: t, user: u } = JSON.parse(raw) as StoredAuth;
      if (t && u) {
        setToken(t);
        setUser(u);
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.error('Failed to parse auth_data', e);
      localStorage.removeItem(AUTH_KEY);
    }
  }, []);

  const setSession = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem(AUTH_KEY, JSON.stringify({ token: newToken, user: newUser }));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
