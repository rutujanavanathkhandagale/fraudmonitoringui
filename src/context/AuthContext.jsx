import React, { createContext, useState, useContext } from "react";
 
// Create the Context
const AuthContext = createContext();
 
// Create a Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ name: "System Admin", role: "Admin" });
 
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
 
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
 
// Custom hook to use the AuthContext easily in any component
export const useAuth = () => useContext(AuthContext);
 