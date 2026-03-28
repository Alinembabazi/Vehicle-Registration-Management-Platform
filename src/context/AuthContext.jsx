import { createContext, useContext, useState } from 'react';

const VALID_EMAIL = 'test@gmail.com';
const VALID_PASSWORD = 'Password!234';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('isLoggedIn') === 'true'
  );

  const login = (email, password) => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('isLoggedIn', 'true');
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}