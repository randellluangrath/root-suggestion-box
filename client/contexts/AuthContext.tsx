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
  isSignedIn: boolean;
  user: User | null;
  signIn: (token: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        try {
          const decoded = jwtDecode<{ user: User }>(token);
          setUser(decoded.user);
          setIsSignedIn(true);
        } catch (error) {
          console.error("Failed to decode JWT:", error);
          localStorage.removeItem("jwtToken");
        }
      }
    }
  }, []);

  const signIn = (token: string) => {
    localStorage.setItem("jwtToken", token);
    try {
      const decoded = jwtDecode<{ user: User }>(token);
      setUser(decoded.user);
      setIsSignedIn(true);
    } catch (error) {
      console.error("Failed to decode JWT during sign-in:", error);
    }
  };

  const signOut = () => {
    localStorage.removeItem("jwtToken");
    setUser(null);
    setIsSignedIn(false);

    console.log(isSignedIn);
  };

  const value = useMemo(
    () => ({
      isSignedIn,
      user,
      signIn,
      signOut,
    }),
    [isSignedIn, user]
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
