// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '@/utils/axiosClient';
import { signout as helperSignout } from '@/utils/helpers';
import { useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext(null);
AuthContext.displayName = 'AuthContext';

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within <AuthProvider>');
  return ctx;
}

export default function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  // hydrate from localStorage so reloads stay logged in
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token') || null;
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  // keep axios Authorization in sync
  useEffect(() => {
    if (token) {
      try {
        localStorage.setItem('token', token);
      } catch {}
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      try {
        localStorage.removeItem('token');
      } catch {}
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  // listen for “global” auth events fired by helpers
  useEffect(() => {
    function onSignedOut() {
      setUser(null);
      setToken(null);
      delete api.defaults.headers.common.Authorization;
    }
    function onUserUpdated() {
      try {
        const u = JSON.parse(localStorage.getItem('user') || 'null');
        setUser(u);
      } catch {
        setUser(null);
      }
    }
    window.addEventListener('auth:signedout', onSignedOut);
    window.addEventListener('auth:user-updated', onUserUpdated);
    return () => {
      window.removeEventListener('auth:signedout', onSignedOut);
      window.removeEventListener('auth:user-updated', onUserUpdated);
    };
  }, []);

  // central signin: expects server to return { token, user }
  async function signin(email, password) {
    const res = await api.post('/signin', { email, password });
    const { token: t, user: u } = res.data || {};
    if (!t || !u) throw new Error('Malformed signin response');

    // persist for the rest of the app that still reads localStorage
    try {
      localStorage.setItem('user', JSON.stringify(u));
    } catch {}
    setUser(u);
    setToken(t);
    return { user: u };
  }

  // central signout: delegate to helper (clears cookies/localStorage) and clear context state
  function signout() {
    try {
      helperSignout();
    } catch {}
    // belt & suspenders: also clear localStorage here
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } catch {}
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common.Authorization;
    // clear any cached data that depends on the user (weather, sunrise, profile, etc.)
    try {
      queryClient.removeQueries({
        predicate: (q) => {
          const k = q.queryKey?.[0];
          return ['weather', 'sun', 'sunrise', 'sunset', 'me', 'profile'].includes(k);
        },
      });
    } catch {}

    // notify any listeners (Navbar, ticker, etc.) that rely on this event
    try {
      window.dispatchEvent(new CustomEvent('auth:signedout'));
    } catch {}
  }

  const value = useMemo(() => ({ user, token, signin, signout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
