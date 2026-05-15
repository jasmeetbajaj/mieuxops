"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { api } from "@/lib/api";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get("mieuxflow_token");
      if (token) {
        try {
          const res = await api.get("/auth/me");
          setUser(res.data);
        } catch (error) {
          Cookies.remove("mieuxflow_token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (token: string, userData: User) => {
    Cookies.set("mieuxflow_token", token, { expires: 1 }); // 1 day
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove("mieuxflow_token");
    setUser(null);
    window.location.href = "/login";
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
