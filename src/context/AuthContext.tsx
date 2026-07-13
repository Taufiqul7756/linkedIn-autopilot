"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthUser, LoginResponse } from "@/types/Auth";

const AUTH_KEY = "auth";

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  login: (data: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function readAuthFromStorage(): { token: string | null; user: AuthUser | null } {
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return { token: null, user: null };
  try {
    const data: LoginResponse = JSON.parse(stored);
    return { token: data.token, user: data.user };
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Always start with null so server and client first render match (no hydration mismatch).
  // localStorage is read in useEffect after hydration.
  const [{ token, user }, setAuth] = useState<{ token: string | null; user: AuthUser | null }>({
    token: null,
    user: null,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuth(readAuthFromStorage());
  }, []);

  const login = (data: LoginResponse) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
    setAuth({ token: data.token, user: data.user });
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
