"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to safely get user from localStorage
function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  
  if (token && storedUser) {
    try {
      return JSON.parse(storedUser) as User;
    } catch (e) {
      console.error("Failed to parse user from local storage", e);
    }
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize state lazily from localStorage
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const router = useRouter();

  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    router.push("/");
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(() => ({
    user,
    login,
    logout,
    isAuthenticated: !!user
  }), [user, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
