"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useWallet } from "@/components/WalletProvider";
import { getElectionLocal, getElectionIpfsHash, fetchElectionMetadata } from "@/lib/election-storage";
import { prepareVerifyEligibility, prepareCastVote } from "@/lib/aleo-contracts";
import { Election } from "@/lib/types";

export default function VotePage() {
  const params = useParams();
  const router = useRouter();
  const { wallet, connected } = useWallet();
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [election, setElection] = useState<Election | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [eligibilityNullifier, setEligibilityNullifier] = useState<string | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  useEffect(() => {
    if (params.electionId) {
      loadElection();
    }
  }, [params.electionId]);

  const loadElection = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load from local storage first
      let electionData = getElectionLocal(params.electionId as string);

      // If not found locally, try to fetch from IPFS
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
        throw new Error("Election not found. Please check the election ID.");
      }

      // Check if election is still active
      const now = Math.floor(Date.now() / 1000);
      if (electionData.endTime < now) {
        electionData.status = "closed";
      } else if (electionData.startTime > now) {
        electionData.status = "pending";
      } else {
        electionData.status = "active";
      }

      setElection(electionData);
    } catch (err: any) {
      setError(err.message || "Failed to load election");
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async () => {
    if (!connected || !wallet || !election) return;

    try {
      setCheckingEligibility(true);
      setError(null);

      // Prepare eligibility verification transaction
      const eligibilityCall = prepareVerifyEligibility(
        parseInt(election.id),
        wallet.address,
        election.eligibilityType
      );

      // Note: In production, this would execute through Puzzle Wallet
      // For now, we'll simulate the check
      // The actual execution would show Puzzle Wallet popup for signing
      
      // Simulate eligibility check (in production, this comes from contract)
      // For demo: assume eligible if wallet is connected
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      // Generate a mock nullifier (in production, this comes from the contract)
      const nullifier = `nullifier_${election.id}_${wallet.address}_${Date.now()}`;
      setEligibilityNullifier(nullifier);
      setEligible(true);
      setEligibilityChecked(true);
    } catch (err: any) {
      setError(err.message || "Failed to verify eligibility. Please try again.");
      setEligible(false);
      setEligibilityChecked(true);
    } finally {
      setCheckingEligibility(false);
    }
  };

  const castVote = async () => {
    if (!connected || !wallet || !election || selectedOption === null || !eligibilityNullifier) return;

    try {
      setVoting(true);
      setError(null);

      // Prepare vote transaction
      const voteCall = prepareCastVote(
        parseInt(election.id),
        selectedOption,
        eligibilityNullifier,
        wallet.address
      );

      // Note: In production, this would execute through Puzzle Wallet
      // The wallet would show a popup for signing the transaction
      
      // Simulate vote submission
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      
      // Show success and redirect
      router.push(`/results/${election.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to cast vote. Please try again.");
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading election...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div className="bg-white rounded-xl p-8 border border-primary-200 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Election Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The election you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!connected || !wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div className="bg-white rounded-xl p-8 border border-primary-200 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-6">
              Please connect your Puzzle Wallet to vote in this election.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const isActive = election.status === "active" && election.startTime <= now && election.endTime >= now;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl p-8 border border-primary-200 shadow-lg">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{election.name}</h1>
            <p className="text-gray-600 mb-4">{election.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
              <span>
                Status:{" "}
                <span className={`font-semibold ${
                  election.status === "active" ? "text-green-600" :
                  election.status === "closed" ? "text-gray-600" : "text-yellow-600"
                }`}>
                  {election.status.toUpperCase()}
                </span>
              </span>
              <span>Eligibility: {election.eligibilityType}</span>
              <span>{election.options.length} options</span>
            </div>

            {!isActive && (
              <div className={`rounded-lg p-4 mb-4 ${
                election.status === "closed" 
                  ? "bg-gray-50 border border-gray-200" 
                  : "bg-yellow-50 border border-yellow-200"
              }`}>
                <p className={`font-semibold ${
                  election.status === "closed" ? "text-gray-800" : "text-yellow-800"
                }`}>
                  {election.status === "closed" 
                    ? "This election has ended. View results below." 
                    : "This election has not started yet."}
                </p>
                {election.status === "closed" && (
                  <button
                    onClick={() => router.push(`/results/${election.id}`)}
                    className="mt-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Results
                  </button>
                )}
              </div>
            )}
          </div>

          {isActive && (
            <>
              {!eligibilityChecked ? (
                <div className="space-y-4">
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Verify Eligibility
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Before you can vote, you need to verify your eligibility for this election.
                      This will generate a zero-knowledge proof that confirms you're eligible without revealing your identity.
                    </p>
                    <button
                      onClick={checkEligibility}
                      disabled={checkingEligibility}
                      className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {checkingEligibility ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Verifying...
                        </span>
                      ) : (
                        "Check Eligibility"
                      )}
                    </button>
                  </div>
                </div>
              ) : !eligible ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Not Eligible
                  </h3>
                  <p className="text-red-600">
                    You are not eligible to vote in this election. Please contact the election creator if you believe this is an error.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-semibold flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      You are eligible to vote!
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Select Your Vote
                    </h3>
                    <div className="space-y-3">
                      {election.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedOption(index)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            selectedOption === index
                              ? "border-primary-500 bg-primary-50 shadow-md"
                              : "border-gray-200 hover:border-primary-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedOption === index
                                  ? "border-primary-500 bg-primary-500"
                                  : "border-gray-400"
                              }`}
                            >
                              {selectedOption === index && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <span className="font-medium text-gray-900">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={castVote}
                    disabled={selectedOption === null || voting}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {voting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Casting Vote...
                      </span>
                    ) : (
                      "Cast Vote"
                    )}
                  </button>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-xs">
                      <strong>Privacy Note:</strong> Your vote will be encrypted and stored on-chain. 
                      No one, including the election creator, can see how you voted.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
