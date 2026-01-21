/**
 * Aleo Contract Integration Layer
 * Handles all on-chain contract interactions via Puzzle Wallet SDK
 */

import { PROGRAMS } from "./aleo";
import { Election, VoteResult } from "./types";
import { getMappingValue } from "./aleo";

// Note: In production, contract calls are made through Puzzle Wallet SDK
// The wallet handles signing and broadcasting transactions
// This file provides helper functions to prepare transaction data

export interface ContractCall {
  programId: string;
  functionName: string;
  inputs: string[];
}

/**
 * Prepare transaction data for creating an election
 */
export function prepareCreateElection(
  creator: string,
  startTime: number,
  endTime: number,
  optionCount: number
): ContractCall {
  return {
    programId: PROGRAMS.voting,
    functionName: "create_election",
    inputs: [
      creator,
      `${startTime}u64`,
      `${endTime}u64`,
      `${optionCount}u8`,
    ],
  };
}

/**
 * Prepare transaction data for registering election metadata
 */
export function prepareRegisterElection(
  electionId: number,
  creator: string,
  nameHash: string,
  descriptionHash: string,
  ipfsHash: string,
  eligibilityType: number
): ContractCall {
  return {
    programId: PROGRAMS.registry,
    functionName: "register_election",
    inputs: [
      `${electionId}u64`,
      creator,
      nameHash,
      descriptionHash,
      ipfsHash,
      `${eligibilityType}u8`,
    ],
  };
}

/**
 * Prepare transaction data for subscribing to premium
 */
export function prepareSubscribePremium(
  user: string,
  durationDays: number
): ContractCall {
  return {
    programId: PROGRAMS.subscription,
    functionName: "subscribe_premium",
    inputs: [
      user,
      `${durationDays}u64`,
    ],
  };
}

/**
 * Prepare transaction data for canceling subscription
 */
export function prepareCancelSubscription(
  user: string
): ContractCall {
  return {
    programId: PROGRAMS.subscription,
    functionName: "cancel_subscription",
    inputs: [user],
  };
}

/**
 * Prepare transaction data for verifying eligibility
 */
export function prepareVerifyEligibility(
  electionId: number,
  voterAddress: string,
  eligibilityType: "whitelist" | "nft" | "credential",
  additionalData?: { nftCollection?: string; credentialHash?: string }
): ContractCall {
  if (eligibilityType === "whitelist") {
    return {
      programId: PROGRAMS.eligibility,
      functionName: "verify_whitelist_eligibility",
      inputs: [`${electionId}u64`, voterAddress],
    };
  } else if (eligibilityType === "nft" && additionalData?.nftCollection) {
    return {
      programId: PROGRAMS.eligibility,
      functionName: "verify_nft_eligibility",
      inputs: [
        `${electionId}u64`,
        voterAddress,
        additionalData.nftCollection,
        "0field", // NFT ID placeholder
      ],
    };
  } else if (eligibilityType === "credential" && additionalData?.credentialHash) {
    return {
      programId: PROGRAMS.eligibility,
      functionName: "verify_credential_eligibility",
      inputs: [
        `${electionId}u64`,
        voterAddress,
        additionalData.credentialHash,
      ],
    };
  }
  throw new Error("Invalid eligibility type or missing data");
}

/**
 * Prepare transaction data for casting a vote
 */
export function prepareCastVote(
  electionId: number,
  optionIndex: number,
  eligibilityNullifier: string,
  voterAddress: string
): ContractCall {
  return {
    programId: PROGRAMS.voting,
    functionName: "cast_vote",
    inputs: [
      `${electionId}u64`,
      `${optionIndex}u8`,
      eligibilityNullifier,
      voterAddress,
    ],
  };
}

/**
 * Get vote count for an option (reads from mapping)
 */
export async function getVoteCount(
  electionId: number,
  optionIndex: number
): Promise<number> {
  try {
    // Calculate the mapping key (hash of election_id + option_index)
    // In production, this would query the contract mapping
    const result = await getMappingValue(
      PROGRAMS.voting,
      "vote_counts",
      `${electionId}_${optionIndex}`
    );
    return result ? parseInt(result) : 0;
  } catch (error) {
    console.error("Error getting vote count:", error);
    return 0;
  }
}

/**
 * Get total votes for an election
 */
export async function getTotalVotes(electionId: number): Promise<number> {
  try {
    const result = await getMappingValue(
      PROGRAMS.voting,
      "total_votes",
      `${electionId}`
    );
    return result ? parseInt(result) : 0;
  } catch (error) {
    console.error("Error getting total votes:", error);
    return 0;
  }
}

/**
 * Get election details
 */
export async function getElection(electionId: number): Promise<any> {
  try {
    const result = await getMappingValue(
      PROGRAMS.voting,
      "elections",
      `${electionId}`
    );
    return result;
  } catch (error) {
    console.error("Error getting election:", error);
    return null;
  }
}

/**
 * Get election metadata from registry
 */
export async function getElectionMetadata(electionId: number): Promise<any> {
  try {
    const result = await getMappingValue(
      PROGRAMS.registry,
      "election_metadata",
      `${electionId}`
    );
    return result;
  } catch (error) {
    console.error("Error getting election metadata:", error);
    return null;
  }
}

/**
 * Get creator's election count
 */
export async function getCreatorElectionCount(creator: string): Promise<number> {
  try {
    const result = await getMappingValue(
      PROGRAMS.registry,
      "creator_election_count",
      creator
    );
    return result ? parseInt(result) : 0;
  } catch (error) {
    console.error("Error getting creator election count:", error);
    return 0;
  }
}

/**
 * Get creator's election by index
 */
export async function getCreatorElection(
  creator: string,
  index: number
): Promise<number> {
  try {
    // Calculate key hash
    const key = `${creator}_${index}`;
    const result = await getMappingValue(
      PROGRAMS.registry,
      "creator_elections",
      key
    );
    return result ? parseInt(result) : 0;
  } catch (error) {
    console.error("Error getting creator election:", error);
    return 0;
  }
}
