"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl p-8 border border-primary-200 shadow-lg">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About ZK-Vote</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What is ZK-Vote?</h2>
              <p className="text-gray-600 mb-4">
                ZK-Vote is a privacy-focused voting platform built on Aleo blockchain. It enables anonymous, 
                verifiable voting where votes are encrypted and untraceable, while ensuring only eligible users can participate.
              </p>
              <p className="text-gray-600">
                Unlike traditional voting systems that expose voter identities and choices, ZK-Vote uses 
                zero-knowledge proofs to verify eligibility without revealing who you are.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
              <div className="space-y-4">
                <div className="bg-primary-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">1. Create Election</h3>
                  <p className="text-gray-600 text-sm">
                    Admins create elections with voting options and eligibility rules. 
                    Metadata is stored on IPFS, and the election is registered on-chain.
                  </p>
                </div>
                <div className="bg-primary-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">2. Verify Eligibility</h3>
                  <p className="text-gray-600 text-sm">
                    Voters prove their eligibility using zero-knowledge proofs. The proof confirms 
                    eligibility without revealing identity, wallet address, or membership details.
                  </p>
                </div>
                <div className="bg-primary-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">3. Cast Vote</h3>
                  <p className="text-gray-600 text-sm">
                    Votes are encrypted and stored on-chain. A nullifier system prevents double voting 
                    while maintaining complete anonymity.
                  </p>
                </div>
                <div className="bg-primary-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">4. Verify Results</h3>
                  <p className="text-gray-600 text-sm">
                    Anyone can verify that votes were counted correctly using cryptographic proofs. 
                    Individual votes remain anonymous, but the integrity of the election is provable.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy Features</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Zero-knowledge proofs verify eligibility without revealing identity</li>
                <li>Votes are encrypted before being stored on-chain</li>
                <li>Nullifier system prevents double voting while maintaining anonymity</li>
                <li>No one, including election creators, can see individual votes</li>
                <li>Public verification ensures transparency without compromising privacy</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use Cases</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">College Elections</h3>
                  <p className="text-gray-600 text-sm">Student council, class representatives, club leadership</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">DAO Governance</h3>
                  <p className="text-gray-600 text-sm">Private voting on proposals without revealing member positions</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Corporate Voting</h3>
                  <p className="text-gray-600 text-sm">Board decisions, employee surveys, internal polls</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Community Polls</h3>
                  <p className="text-gray-600 text-sm">Neighborhood decisions, community center votes</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technology</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-2 text-gray-600">
                  <li><strong>Blockchain:</strong> Aleo - The only Layer-1 with programmable privacy</li>
                  <li><strong>Smart Contracts:</strong> Leo 3.4.0</li>
                  <li><strong>Frontend:</strong> Next.js 14, React, TypeScript, Tailwind CSS</li>
                  <li><strong>Wallet:</strong> Puzzle Wallet SDK</li>
                  <li><strong>Storage:</strong> IPFS (Pinata) for metadata, Aleo for votes</li>
                </ul>
              </div>
            </section>

            <div className="flex gap-4 mt-8">
              <Link
                href="/create"
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Create Your First Election
              </Link>
              <Link
                href="/"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
