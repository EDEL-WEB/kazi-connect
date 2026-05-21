import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kazi_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('kazi_token'));

  const login = (tokenVal, userData) => {
    localStorage.setItem('kazi_token', tokenVal);
    localStorage.setItem('kazi_user', JSON.stringify(userData));
    setToken(tokenVal);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('kazi_token');
    localStorage.removeItem('kazi_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
