"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { jwtDecode } from "jwt-decode";
import User from "@/types/User";

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  logIn: (token: string) => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        try {
          const decoded = jwtDecode<{ user: User }>(token);
          setUser(decoded.user);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Failed to decode JWT:", error);
          localStorage.removeItem("jwtToken");
        }
      }
    }
  }, []);

  const logIn = (token: string) => {
    localStorage.setItem("jwtToken", token);
    try {
      const decoded = jwtDecode<{ user: User }>(token);
      setUser(decoded.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Failed to decode JWT during log-in:", error);
    }
  };

  const logOut = () => {
    localStorage.removeItem("jwtToken");
    setUser(null);
    setIsLoggedIn(false);

    console.log(isLoggedIn);
  };

  const value = useMemo(
    () => ({
      isLoggedIn,
      user,
      logIn,
      logOut,
    }),
    [isLoggedIn, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
