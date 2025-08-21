import { createContext, useContext, useState } from 'react';
import { isAuth } from '@/utils/helpers';

export const AuthContext = createContext();

// const token = getCookie('token');
// const user = isAuth();
export const useAuthContext = () => useContext(AuthContext);

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(isAuth());

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

// export const useAuth = () => useContext(AuthContext);

export default AuthContextProvider;
