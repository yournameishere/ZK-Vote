/**
 * Election Storage Layer
 * Manages election metadata storage on IPFS and local cache
 */

import { uploadToPinata, fetchFromPinata } from "./pinata";
import { Election } from "./types";

// Local storage key prefix
const STORAGE_PREFIX = "zkvote_election_";

/**
 * Store election metadata locally (for quick access)
 */
export function storeElectionLocal(election: Election): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}${election.id}`,
      JSON.stringify(election)
    );
  } catch (error) {
    console.error("Error storing election locally:", error);
  }
}

/**
 * Get election from local storage
 */
export function getElectionLocal(electionId: string): Election | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${electionId}`);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error getting election from local storage:", error);
    return null;
  }
}

/**
 * Upload election metadata to IPFS and return hash
 */
export async function uploadElectionMetadata(
  election: Omit<Election, "id" | "ipfsHash">
): Promise<string> {
  try {
    const metadata = {
      name: election.name,
      description: election.description,
      options: election.options,
      eligibilityType: election.eligibilityType,
      creator: election.creator,
      startTime: election.startTime,
      endTime: election.endTime,
      createdAt: Date.now(),
    };

    const ipfsHash = await uploadToPinata(metadata);
    return ipfsHash;
  } catch (error) {
    console.error("Error uploading election metadata:", error);
    throw error;
  }
}

/**
 * Fetch election metadata from IPFS
 */
export async function fetchElectionMetadata(
  ipfsHash: string
): Promise<Omit<Election, "id" | "ipfsHash"> | null> {
  try {
    const metadata = await fetchFromPinata(ipfsHash);
    return metadata as any;
  } catch (error) {
    console.error("Error fetching election metadata:", error);
    return null;
  }
}

/**
 * Store election ID to IPFS hash mapping locally
 */
export function storeElectionMapping(electionId: string, ipfsHash: string): void {
  if (typeof window === "undefined") return;
  try {
    const mappings = getElectionMappings();
    mappings[electionId] = ipfsHash;
    localStorage.setItem("zkvote_election_mappings", JSON.stringify(mappings));
  } catch (error) {
    console.error("Error storing election mapping:", error);
  }
}

/**
 * Get election mappings
 */
export function getElectionMappings(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem("zkvote_election_mappings");
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    return {};
  }
}

/**
 * Get IPFS hash for an election ID
 */
export function getElectionIpfsHash(electionId: string): string | null {
  const mappings = getElectionMappings();
  return mappings[electionId] || null;
}
