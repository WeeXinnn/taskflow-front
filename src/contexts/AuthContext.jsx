// React state management for logged-in user

import { createContext, useContext, useState } from "react"; // Import necessary hooks and functions from React

const AuthContext = createContext(); // Create a new context for authentication

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  ); // Initialize user state from localStorage or set to null
  const [token, setToken] = useState(localStorage.getItem("token") || null); // Initialize token state from localStorage or set to null

  const login = (userData, tokenData) => {
    setUser(userData); // Update user state with the provided user data
    setToken(tokenData); // Update token state with the provided token data
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData); // Store user data and token in localStorage for persistence
  };

  const logout = () => {
    setUser(null); // Clear user state
    setToken(null); // Clear token state
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}{" "}
      {/* Render child components that will have access to the authentication context */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // Custom hook to access the authentication context
