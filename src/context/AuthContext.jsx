// src/context/AuthContext.js
import React, { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ v4 import style

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded); // ✅ Debug log

      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const userId = decoded["RegistrationId"];
      const customerId = decoded.CustomerId || decoded.customerId; // ✅ safer fallback
      const name = decoded.Name;

      const userData = { name, role, userId, customerId };
      setUser(userData);

      // Persist in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      if (customerId) localStorage.setItem("customerId", customerId);
      if (name) localStorage.setItem("name", name);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
