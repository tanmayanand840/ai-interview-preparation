import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const fetchMe = async (currentToken) => {
    if (!currentToken) {
      setUser(null);
      return;
    }
    try {
      setLoadingUser(true);
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMe(token);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    fetchMe(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loadingUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
