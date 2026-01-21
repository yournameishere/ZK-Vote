"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useWallet } from "@/components/WalletProvider";
import { getCreatorElectionCount, getCreatorElection, getElectionMetadata } from "@/lib/aleo-contracts";
import { getElectionLocal, getElectionMappings, fetchElectionMetadata } from "@/lib/election-storage";
import { Election } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const { wallet, connected } = useWallet();
  const [loading, setLoading] = useState(true);
  const [elections, setElections] = useState<Election[]>([]);
  const [stats, setStats] = useState({
    totalElections: 0,
    activeElections: 0,
    totalVotes: 0,
  });

  useEffect(() => {
    if (connected && wallet) {
      loadDashboard();
    }
  }, [connected, wallet]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      
      // Get creator's election count from contract
      const count = await getCreatorElectionCount(wallet?.address || "");
      
      // Load elections
      const loadedElections: Election[] = [];
      
      // Try to load from contract
      for (let i = 0; i < count; i++) {
        const electionId = await getCreatorElection(wallet?.address || "", i);
        if (electionId > 0) {
          // Try to get metadata
          const metadata = await getElectionMetadata(electionId);
          if (metadata) {
            // Try to get IPFS data
            const mappings = getElectionMappings();
            const ipfsHash = mappings[electionId.toString()];
            if (ipfsHash) {
              const ipfsData = await fetchElectionMetadata(ipfsHash);
              if (ipfsData) {
                loadedElections.push({
                  id: electionId.toString(),
                  ...ipfsData,
                  ipfsHash,
                } as Election);
              }
            }
          }
        }
      }

      // Also check local storage for elections created in this session
      const mappings = getElectionMappings();
      for (const [electionId, ipfsHash] of Object.entries(mappings)) {
        const localElection = getElectionLocal(electionId);
        if (localElection && localElection.creator === wallet?.address) {
          // Check if already in loadedElections
          if (!loadedElections.find(e => e.id === electionId)) {
            loadedElections.push(localElection);
          }
        }
      }

      // Sort by creation time (newest first)
      loadedElections.sort((a, b) => {
        const timeA = a.startTime || 0;
        const timeB = b.startTime || 0;
        return timeB - timeA;
      });

      setElections(loadedElections);
      
      // Calculate stats
      const now = Math.floor(Date.now() / 1000);
      const active = loadedElections.filter(
        (e) => e.status === "active" && e.startTime <= now && e.endTime >= now
      ).length;

      setStats({
        totalElections: loadedElections.length,
        activeElections: active,
        totalVotes: 0, // Would need to query each election
      });
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!connected || !wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="bg-white rounded-xl p-8 border border-primary-200 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-6">
              Please connect your Puzzle Wallet to view your dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => router.push("/create")}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            + Create New Election
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-primary-200 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Elections</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.totalElections}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-primary-200 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Active Elections</h3>
            <p className="text-3xl font-bold text-green-600">{stats.activeElections}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-primary-200 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Votes</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalVotes}</p>
          </div>
        </div>

        {/* Elections List */}
        <div className="bg-white rounded-xl border border-primary-200 shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Elections</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading elections...</p>
            </div>
          ) : elections.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-4">You haven't created any elections yet.</p>
              <button
                onClick={() => router.push("/create")}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Create Your First Election
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {elections.map((election) => {
                const now = Math.floor(Date.now() / 1000);
                const isActive = election.status === "active" && election.startTime <= now && election.endTime >= now;
                const isClosed = election.endTime < now;
                
                return (
                  <div key={election.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {election.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">{election.description}</p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>
                            Status:{" "}
                            <span
                              className={`font-semibold ${
                                isActive
                                  ? "text-green-600"
                                  : isClosed
                                  ? "text-gray-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {isActive ? "ACTIVE" : isClosed ? "CLOSED" : "PENDING"}
                            </span>
                          </span>
                          <span>Eligibility: {election.eligibilityType}</span>
                          <span>{election.options.length} options</span>
                          {isClosed && <span>{election.endTime ? new Date(election.endTime * 1000).toLocaleDateString() : ""}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {isActive ? (
                          <button
                            onClick={() => router.push(`/vote/${election.id}`)}
                            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={() => router.push(`/results/${election.id}`)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Results
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
