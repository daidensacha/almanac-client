// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isAuth } from '@/utils/helpers';

export const AuthContext = createContext(null);
export const useAuthContext = () => useContext(AuthContext);

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    return null;
  }
};

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(() => readUser() || isAuth() || null);

  useEffect(() => {
    const refresh = () => setUser(readUser() || isAuth() || null);
    window.addEventListener('auth:user-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('auth:user-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const value = useMemo(() => ({ user, setUser }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
