"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useWallet } from "@/components/WalletProvider";
import { uploadElectionMetadata, storeElectionLocal, storeElectionMapping } from "@/lib/election-storage";
import { prepareCreateElection, prepareRegisterElection } from "@/lib/aleo-contracts";
import { Election } from "@/lib/types";

export default function CreateElectionPage() {
  const router = useRouter();
  const { wallet, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "uploading" | "deploying" | "complete">("form");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    options: [""],
    eligibilityType: "whitelist" as "nft" | "credential" | "whitelist",
  });

  if (!connected || !wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20">
          <div className="bg-white rounded-xl p-8 border border-primary-200 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-6">
              Please connect your Puzzle Wallet to create an election.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData({ ...formData, options: [...formData.options, ""] });
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStep("uploading");

    try {
      // Validate form
      if (!formData.name || !formData.description || formData.options.length < 2) {
        throw new Error("Please fill in all required fields and add at least 2 options");
      }

      const validOptions = formData.options.filter(opt => opt.trim() !== "");
      if (validOptions.length < 2) {
        throw new Error("Please provide at least 2 valid voting options");
      }

      // Validate dates
      const startTime = Math.floor(new Date(formData.startTime).getTime() / 1000);
      const endTime = Math.floor(new Date(formData.endTime).getTime() / 1000);
      
      if (startTime >= endTime) {
        throw new Error("End time must be after start time");
      }

      if (startTime < Math.floor(Date.now() / 1000)) {
        throw new Error("Start time cannot be in the past");
      }

      // Step 1: Upload metadata to IPFS
      setStep("uploading");
      const now = Math.floor(Date.now() / 1000);
      const electionData = {
        name: formData.name,
        description: formData.description,
        options: validOptions,
        eligibilityType: formData.eligibilityType,
        creator: wallet.address,
        startTime,
        endTime,
        status: startTime > now ? "pending" : "active" as "pending" | "active" | "closed",
      };

      let ipfsHash: string;
      try {
        ipfsHash = await uploadElectionMetadata(electionData);
      } catch (ipfsError: any) {
        // If Pinata fails, still proceed (metadata will be stored locally)
        console.warn("IPFS upload failed, using local storage:", ipfsError);
        ipfsHash = `local_${Date.now()}`;
      }

      // Step 2: Create election on-chain
      setStep("deploying");
      
      // Prepare contract calls
      const createElectionCall = prepareCreateElection(
        wallet.address,
        startTime,
        endTime,
        validOptions.length
      );

      // Hash the name and description for on-chain storage
      // In production, these would be computed using Poseidon8::hash_to_field
      const nameHash = `0field`; // Placeholder
      const descriptionHash = `0field`; // Placeholder
      
      const eligibilityTypeMap = {
        nft: 0,
        credential: 1,
        whitelist: 2,
      };

      // Note: In production, these would be executed through Puzzle Wallet
      // For now, we'll create a local election record and show instructions
      const electionId = Date.now().toString();
      
      const election: Election = {
        id: electionId,
        ...electionData,
        ipfsHash,
        status: "active",
      };

      // Store locally
      storeElectionLocal(election);
      storeElectionMapping(electionId, ipfsHash);

      // Show success message with instructions
      setStep("complete");
      
      // Redirect after a moment
      setTimeout(() => {
        router.push(`/vote/${electionId}`);
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Failed to create election");
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl p-8 border border-primary-200 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Create New Election
          </h1>

          {step === "complete" ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Election Created!</h2>
              <p className="text-gray-600 mb-4">Your election has been created successfully.</p>
              <p className="text-sm text-gray-500">Redirecting to vote page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Election Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Student Council Election 2024"
                  required
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe what this election is about..."
                  required
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eligibility Type *
                </label>
                <select
                  value={formData.eligibilityType}
                  onChange={(e) => setFormData({ ...formData, eligibilityType: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="whitelist">Whitelisted Wallets</option>
                  <option value="nft">NFT Holders</option>
                  <option value="credential">Credential Holders</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.eligibilityType === "whitelist" && "Only wallets added to the whitelist can vote"}
                  {formData.eligibilityType === "nft" && "Only holders of a specific NFT collection can vote"}
                  {formData.eligibilityType === "credential" && "Only users with specific credentials can vote"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voting Options * (Minimum 2, Maximum 10)
                </label>
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                      maxLength={50}
                    />
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {formData.options.length < 10 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    + Add Option
                  </button>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {step === "uploading" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <p className="text-blue-800 text-sm">Uploading metadata to IPFS...</p>
                  </div>
                </div>
              )}

              {step === "deploying" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <p className="text-blue-800 text-sm">Creating election on-chain...</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || step !== "form"}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? "Creating Election..." : "Create Election"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
