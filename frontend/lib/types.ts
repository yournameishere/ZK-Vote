export interface Election {
  id: string;
  name: string;
  description: string;
  creator: string;
  startTime: number;
  endTime: number;
  options: string[];
  eligibilityType: 'nft' | 'credential' | 'whitelist';
  status: 'active' | 'closed' | 'cancelled' | 'pending';
  ipfsHash?: string;
}

export interface VoteResult {
  optionIndex: number;
  count: number;
}

export interface EligibilityRecord {
  owner: string;
  electionId: number;
  eligibilityType: number;
  nullifier: string;
}

export interface Subscription {
  user: string;
  tier: 'free' | 'premium';
  startTime: number;
  endTime: number;
  active: boolean;
}

export interface WalletConnection {
  address: string;
  network: string;
  connected: boolean;
}
