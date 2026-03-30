import { useState } from "react";
import AuthContext from "./auth-context";

const VALID_EMAIL = "test@gmail.com";
const VALID_PASSWORD = "Password!234";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem("isLoggedIn") === "true"
  );

  const login = (email, password) => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      setIsAuthenticated(true);
      window.localStorage.setItem("isLoggedIn", "true");
      return { success: true };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    window.localStorage.removeItem("isLoggedIn");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
