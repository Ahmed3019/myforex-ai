/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Load token from localStorage on init
  useEffect(() => {
    try {
      const saved = localStorage.getItem("myforexai_token");
      if (saved) {
        setToken(saved);
      }
    } finally {
      setLoadingAuth(false); // انتهينا من التحميل
    }
  }, []);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("myforexai_token", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("myforexai_token");
  };

  const value = {
    token,
    login,
    logout,
    isAuthenticated: !!token,
    loadingAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
