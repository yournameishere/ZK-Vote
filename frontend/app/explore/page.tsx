"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { getElectionLocal, getElectionMappings, fetchElectionMetadata } from "@/lib/election-storage";
import { Election } from "@/lib/types";

export default function ExplorePage() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      setLoading(true);
      
      // Load all elections from local storage
      const mappings = getElectionMappings();
      const loadedElections: Election[] = [];
      
      for (const [electionId, ipfsHash] of Object.entries(mappings)) {
        let election = getElectionLocal(electionId);
        
        if (!election && ipfsHash) {
          const metadata = await fetchElectionMetadata(ipfsHash);
          if (metadata) {
            election = {
              id: electionId,
              ...metadata,
              ipfsHash,
            } as Election;
          }
        }
        
        if (election) {
          // Update status
          const now = Math.floor(Date.now() / 1000);
          if (election.endTime < now) {
            election.status = "closed";
          } else if (election.startTime > now) {
            election.status = "pending";
          } else {
            election.status = "active";
          }
          loadedElections.push(election);
        }
      }
      
      // Sort by creation time (newest first)
      loadedElections.sort((a, b) => {
        const timeA = a.startTime || 0;
        const timeB = b.startTime || 0;
        return timeB - timeA;
      });
      
      setElections(loadedElections);
    } catch (error) {
      console.error("Error loading elections:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredElections = elections.filter((election) => {
    if (filter === "all") return true;
    if (filter === "active") return election.status === "active";
    if (filter === "closed") return election.status === "closed";
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Elections</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "active"
                  ? "bg-primary-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("closed")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "closed"
                  ? "bg-primary-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              Closed
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading elections...</p>
          </div>
        ) : filteredElections.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-primary-200 text-center shadow-lg">
            <p className="text-gray-600 mb-4">No elections found.</p>
            <Link
              href="/create"
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Create First Election
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredElections.map((election) => (
              <Link
                key={election.id}
                href={election.status === "active" ? `/vote/${election.id}` : `/results/${election.id}`}
                className="bg-white rounded-xl p-6 border border-primary-200 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {election.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      election.status === "active"
                        ? "bg-green-100 text-green-800"
                        : election.status === "closed"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {election.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {election.description}
                </p>
                <div className="flex gap-4 text-xs text-gray-500 mb-4">
                  <span>{election.options.length} options</span>
                  <span>•</span>
                  <span>{election.eligibilityType}</span>
                </div>
                <div className="text-sm text-primary-600 font-medium">
                  {election.status === "active" ? "Vote Now →" : "View Results →"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
