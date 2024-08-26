import Header from "@/components/Header/Header";
import React from "react";
import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      <>
        <Header />
        {children}
      </>
    </AuthProvider>
  );
};

export default Layout;
