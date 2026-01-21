"use client";

import React from "react";
import Link from "next/link";
import { WalletConnect } from "@/components/WalletConnect";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-primary-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                ZK-Vote
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/explore"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Explore
              </Link>
              <Link
                href="/create"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Create Vote
              </Link>
              <Link
                href="/dashboard"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/subscription"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Subscription
              </Link>
              <Link
                href="/about"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                About
              </Link>
              <WalletConnect />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Vote Anonymously.
              <br />
              <span className="text-primary-600">Prove Eligibility.</span>
              <br />
              Verify Results.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up">
              ZK-Vote is a privacy-first voting platform powered by Aleo. 
              Only eligible users can vote. Votes are anonymous. Results are verifiable. 
              No one can see who voted for what.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/create"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Create Your First Vote
              </Link>
              <Link
                href="/vote/demo"
                className="bg-white hover:bg-primary-50 text-primary-600 border-2 border-primary-500 px-8 py-4 rounded-lg font-semibold text-lg transition-all"
              >
                Try Demo Vote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why ZK-Vote?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary-50 rounded-xl p-8 border border-primary-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fully Anonymous</h3>
              <p className="text-gray-600">
                Your vote is encrypted and untraceable. No one can see who voted for what, 
                not even the election creator.
              </p>
            </div>

            <div className="bg-primary-50 rounded-xl p-8 border border-primary-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Eligibility Verified</h3>
              <p className="text-gray-600">
                Zero-knowledge proofs verify eligibility without revealing identities. 
                Support for NFT holders, credentials, and whitelists.
              </p>
            </div>

            <div className="bg-primary-50 rounded-xl p-8 border border-primary-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Publicly Verifiable</h3>
              <p className="text-gray-600">
                Anyone can verify that votes were counted correctly. 
                Cryptographic proofs ensure integrity without compromising privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="space-y-8">
            <div className="flex items-start gap-6 bg-white rounded-xl p-6 border border-primary-200">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Election</h3>
                <p className="text-gray-600">
                  Set up your election with options, eligibility rules, and time window. 
                  The contract is deployed on Aleo blockchain.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 bg-white rounded-xl p-6 border border-primary-200">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Verify Eligibility</h3>
                <p className="text-gray-600">
                  Voters prove their eligibility using zero-knowledge proofs. 
                  The proof verifies eligibility without revealing identity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 bg-white rounded-xl p-6 border border-primary-200">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Cast Vote</h3>
                <p className="text-gray-600">
                  Votes are encrypted and stored on-chain. Nullifiers prevent double voting. 
                  Your vote is completely anonymous.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 bg-white rounded-xl p-6 border border-primary-200">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">View Results</h3>
                <p className="text-gray-600">
                  After the election ends, results are publicly available and verifiable. 
                  Anyone can verify the integrity of the vote count.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">ZK-Vote</h2>
              <p className="text-gray-400 text-sm">
                Privacy-Focused Voting Platform on Aleo. Vote anonymously. Prove eligibility. Verify results.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/create" className="hover:text-white transition-colors">Create Election</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/subscription" className="hover:text-white transition-colors">Subscription</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://developer.aleo.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Aleo Docs</a></li>
                <li><a href="https://docs.leo-lang.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Leo Docs</a></li>
                <li><a href="https://explorer.aleo.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Aleo Explorer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-500">
              Built for the Aleo Privacy Buildathon by AKINDO | Powered by Aleo
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
