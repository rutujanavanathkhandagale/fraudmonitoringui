import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
 
// 1. Create the Context
const AuthContext = createContext(null);
 
/**
 * AuthProvider Component
 * Manages global authentication state and persists it to localStorage.
 */
export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage to persist session on refresh
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('fraud_shield_user');
    return savedUser ? JSON.parse(savedUser) : { name: 'System Admin', role: 'Admin' };
  });
 
  // Sync user state with localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('fraud_shield_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fraud_shield_user');
    }
  }, [user]);
 
  const login = (userData) => {
    // In a real app, you'd verify credentials with an API here
    setUser(userData);
  };
 
  const logout = () => {
    setUser(null);
  };
 
  // The value object is memoized by React internally if passed as a single object
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };
 
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
 
// 2. Custom hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
 
// 3. Prop Validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
 
export default AuthContext;