"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useWallet } from "./WalletProvider";
import { WalletConnect } from "./WalletConnect";

export function Navbar() {
  const { connected } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-lg border-b-2 border-primary-200 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-blue-600 to-primary-500 bg-clip-text text-transparent group-hover:from-primary-700 group-hover:via-blue-700 group-hover:to-primary-600 transition-all">
                K-Vote
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/explore"
              className="px-4 py-2 text-primary-600 hover:text-primary-700 font-semibold transition-all hover:bg-primary-50 rounded-lg hover:scale-105"
            >
              Explore
            </Link>
            <Link
              href="/create"
              className="px-4 py-2 text-primary-600 hover:text-primary-700 font-semibold transition-all hover:bg-primary-50 rounded-lg hover:scale-105"
            >
              Create Vote
            </Link>
            {connected && (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-primary-600 hover:text-primary-700 font-semibold transition-all hover:bg-primary-50 rounded-lg hover:scale-105"
                >
                  Dashboard
                </Link>
                <Link
                  href="/subscription"
                  className="px-4 py-2 text-primary-600 hover:text-primary-700 font-semibold transition-all hover:bg-primary-50 rounded-lg hover:scale-105"
                >
                  Subscription
                </Link>
              </>
            )}
            <Link
              href="/about"
              className="px-4 py-2 text-primary-600 hover:text-primary-700 font-semibold transition-all hover:bg-primary-50 rounded-lg hover:scale-105"
            >
              About
            </Link>
          </div>

          {/* Wallet Connect & Mobile Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <WalletConnect />
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors"
            >
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-200 animate-slide-up">
            <div className="flex flex-col gap-2">
              <Link
                href="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-primary-600 hover:text-primary-700 font-semibold hover:bg-primary-50 rounded-lg transition-all"
              >
                Explore
              </Link>
              <Link
                href="/create"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-primary-600 hover:text-primary-700 font-semibold hover:bg-primary-50 rounded-lg transition-all"
              >
                Create Vote
              </Link>
              {connected && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-primary-600 hover:text-primary-700 font-semibold hover:bg-primary-50 rounded-lg transition-all"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/subscription"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-primary-600 hover:text-primary-700 font-semibold hover:bg-primary-50 rounded-lg transition-all"
                  >
                    Subscription
                  </Link>
                </>
              )}
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-primary-600 hover:text-primary-700 font-semibold hover:bg-primary-50 rounded-lg transition-all"
              >
                About
              </Link>
              <div className="pt-2 border-t border-primary-200">
                <WalletConnect />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
