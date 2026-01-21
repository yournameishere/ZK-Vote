"use client";

import React from "react";
import Link from "next/link";
import { useWallet } from "./WalletProvider";
import { WalletConnect } from "./WalletConnect";

export function Navbar() {
  const { connected } = useWallet();

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-primary-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              ZK-Vote
            </h1>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/explore"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/create"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Create Vote
            </Link>
            {connected && (
              <>
                <Link
                  href="/dashboard"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/subscription"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Subscription
                </Link>
              </>
            )}
            <Link
              href="/about"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              About
            </Link>
            <div className="relative">
              <WalletConnect />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
