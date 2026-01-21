"use client";

import React from "react";
import Link from "next/link";
import { useWallet } from "./WalletProvider";
import { WalletConnect } from "./WalletConnect";

export function Navbar() {
  const { connected } = useWallet();

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-primary-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center group">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent group-hover:from-primary-700 group-hover:to-primary-500 transition-all">
              ZK-Vote
            </h1>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/explore"
              className="text-primary-600 hover:text-primary-700 font-medium transition-all hover:scale-105"
            >
              Explore
            </Link>
            <Link
              href="/create"
              className="text-primary-600 hover:text-primary-700 font-medium transition-all hover:scale-105"
            >
              Create Vote
            </Link>
            {connected && (
              <>
                <Link
                  href="/dashboard"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-all hover:scale-105"
                >
                  Dashboard
                </Link>
                <Link
                  href="/subscription"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-all hover:scale-105"
                >
                  Subscription
                </Link>
              </>
            )}
            <Link
              href="/about"
              className="text-primary-600 hover:text-primary-700 font-medium transition-all hover:scale-105"
            >
              About
            </Link>
          </div>
          <div className="relative">
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
}
