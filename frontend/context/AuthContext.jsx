'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchMe, getToken, loginRequest, registerRequest, setToken } from '@/lib/api';

const AuthContext = createContext(null);

/**
 * Holds the signed-in user and exposes login/register/logout. The JWT is kept in
 * localStorage; on mount we re-validate it against /auth/me so a stale token is
 * cleared rather than trusted.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (!getToken()) {
      setLoading(false);
      return undefined;
    }

    fetchMe()
      .then((me) => {
        if (active) setUser(me);
      })
      .catch(() => {
        setToken(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (payload) => {
    const { user: nextUser, token } = await loginRequest(payload);
    setToken(token);
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async (payload) => {
    const { user: nextUser, token } = await registerRequest(payload);
    setToken(token);
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    const me = await fetchMe();
    setUser(me);
    return me;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
