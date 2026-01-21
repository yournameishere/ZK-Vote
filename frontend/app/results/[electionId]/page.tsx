"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ResultsChart } from "@/components/ResultsChart";
import { getElectionLocal, getElectionIpfsHash, fetchElectionMetadata } from "@/lib/election-storage";
import { getVoteCount, getTotalVotes } from "@/lib/aleo-contracts";
import { Election, VoteResult } from "@/lib/types";

export default function ResultsPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState<Election | null>(null);
  const [results, setResults] = useState<VoteResult[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.electionId) {
      loadResults();
    }
  }, [params.electionId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      
      // Load election metadata
      let electionData = getElectionLocal(params.electionId as string);
      
      if (!electionData) {
        const ipfsHash = getElectionIpfsHash(params.electionId as string);
        if (ipfsHash) {
          const metadata = await fetchElectionMetadata(ipfsHash);
          if (metadata) {
            electionData = {
              id: params.electionId as string,
              ...metadata,
              ipfsHash,
            } as Election;
          }
        }
      }

      if (!electionData) {
        throw new Error("Election not found");
      }

      setElection(electionData);

      // Load vote results from contract
      const electionIdNum = parseInt(electionData.id);
      const total = await getTotalVotes(electionIdNum);
      setTotalVotes(total);

      // Get counts for each option
      const voteResults: VoteResult[] = [];
      for (let i = 0; i < electionData.options.length; i++) {
        const count = await getVoteCount(electionIdNum, i);
        voteResults.push({ optionIndex: i, count });
      }

      setResults(voteResults);
    } catch (err: any) {
      setError(err.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !election) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="bg-white rounded-xl p-8 border border-primary-200 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error ? "Error Loading Results" : "Election Not Found"}
            </h2>
            <p className="text-gray-600 mb-6">{error || "The election you're looking for doesn't exist."}</p>
            <button
              onClick={() => window.history.back()}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const winner = results.length > 0 
    ? results.reduce((max, result) => result.count > max.count ? result : max, results[0])
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl p-8 border border-primary-200 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{election.name}</h1>
          <p className="text-gray-600 mb-6">{election.description}</p>

          <div className="mb-8">
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Election Results</h2>
              <p className="text-gray-600 mb-4">
                Total Votes: <span className="font-semibold text-primary-600">{totalVotes}</span>
              </p>
              {winner && winner.count > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <p className="text-green-800 font-semibold text-lg">
                    🏆 Winner: {election.options[winner.optionIndex]} ({winner.count} votes)
                  </p>
                </div>
              )}
              {totalVotes === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-yellow-800">No votes have been cast yet.</p>
                </div>
              )}
            </div>
          </div>

          {results.length > 0 && totalVotes > 0 && (
            <>
              <div className="mb-8">
                <ResultsChart results={results} options={election.options} />
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Vote Breakdown</h3>
                {results.map((result, index) => {
                  const percentage = totalVotes > 0 ? (result.count / totalVotes) * 100 : 0;
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">
                          {election.options[result.optionIndex]}
                        </span>
                        <span className="text-gray-600 font-semibold">
                          {result.count} votes ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🔐 Verification & Transparency
            </h3>
            <p className="text-gray-600 mb-4">
              All votes are stored on the Aleo blockchain and can be publicly verified. 
              The cryptographic proofs ensure that:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>All votes were counted correctly</li>
              <li>No fake votes were added</li>
              <li>No votes were removed</li>
              <li>Each eligible voter voted only once</li>
              <li>Individual votes remain completely anonymous</li>
            </ul>
            <div className="flex gap-2">
              <a
                href={`https://explorer.aleo.org/program/${process.env.NEXT_PUBLIC_VOTING_PROGRAM_ID || "voting_zkvote_4522.aleo"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Verify on Explorer
              </a>
              <a
                href={`https://explorer.aleo.org/program/${process.env.NEXT_PUBLIC_REGISTRY_PROGRAM_ID || "registry_zkvote_4521.aleo"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                View Registry
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
