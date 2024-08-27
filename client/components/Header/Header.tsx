"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { signIn } from "@/services/ClientService";

const handleLogIn = async (logIn: (token: string) => void) => {
  const token = await signIn(1); // hard-coding user here
  logIn(token);
};

const handleLogOut = async (logOut: () => void) => {
  logOut();
};

const Header: React.FC = () => {
  const { isLoggedIn, user, logIn, logOut } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [isLoggedIn]);

  if (loading) {
    return null;
  }

  return (
    <header className="bg-black">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <Link href="/" className="-m-1.5 p-1.5">
          <div className="text-white text-2xl font-bold flex gap-1">
            <Image
              src="https://assets.website-files.com/63a9635f2eee22fd925b0554/63a98817a014a567a7106c2b_Mask%20Group.svg"
              alt="Root Suggestion Box"
              width={75}
              height={75}
            />
          </div>
        </Link>

        <div className="lg:flex lg:flex-1 lg:justify-end">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm font-semibold leading-6 text-white hover:text-gray-300 cursor-pointer">
                  {user.firstName} {user.lastName}
                </span>
              )}
              <div className="text-white">|</div>
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-white hover:text-gray-300 cursor-pointer"
                onClick={() => handleLogOut(logOut)}
              >
                Sign Out <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          ) : (
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-white hover:text-gray-300 cursor-pointer"
              onClick={() => handleLogIn(logIn)}
            >
              Sign In <span aria-hidden="true">&rarr;</span>
            </a>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
