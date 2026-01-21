import { connect as puzzleConnect, getAccount, Network } from "@puzzlehq/sdk-core";

export interface PuzzleWalletConnection {
  address: string;
  network: string;
  balances?: any[];
}

// Check if Puzzle Wallet is available
export function hasPuzzleWallet(): boolean {
  if (typeof window === "undefined") return false;
  return !!window?.aleo?.puzzleWalletClient;
}

// Connect to Puzzle Wallet
export async function connectPuzzleWallet(): Promise<PuzzleWalletConnection | null> {
  try {
    if (!hasPuzzleWallet()) {
      throw new Error("Puzzle Wallet not detected. Please install the Puzzle Wallet extension.");
    }

    const eligibilityProgramId = process.env.NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID || "eligibility_zkvote_4521.aleo";
    const votingProgramId = process.env.NEXT_PUBLIC_VOTING_PROGRAM_ID || "voting_zkvote_4522.aleo";
    const registryProgramId = process.env.NEXT_PUBLIC_REGISTRY_PROGRAM_ID || "registry_zkvote_4521.aleo";
    const subscriptionProgramId = process.env.NEXT_PUBLIC_SUBSCRIPTION_PROGRAM_ID || "subscription_zkvote_4522.aleo";

    const response = await puzzleConnect({
      dAppInfo: {
        name: "ZK-Vote",
        description: "Privacy-Focused Voting Platform on Aleo",
        iconUrl: `${window.location.origin}/icon.svg`,
      },
      permissions: {
        programIds: {
          [Network.AleoTestnet]: [
            eligibilityProgramId,
            votingProgramId,
            registryProgramId,
            subscriptionProgramId,
          ],
        },
      },
    });

    if (response?.connection) {
      return {
        address: response.connection.address,
        network: response.connection.network,
        balances: response.connection.balances,
      };
    }

    return null;
  } catch (error) {
    console.error("Wallet connect error:", error);
    throw error;
  }
}

// Get current account
export async function getPuzzleAccount(): Promise<PuzzleWalletConnection | null> {
  try {
    if (!hasPuzzleWallet()) {
      return null;
    }

    const account = await getAccount();
    if (account) {
      return {
        address: (account as any).address || "",
        network: (account as any).network || "testnet",
      };
    }

    return null;
  } catch (error) {
    console.error("Get account error:", error);
    return null;
  }
}

// Declare global window type for TypeScript
declare global {
  interface Window {
    aleo?: {
      puzzleWalletClient?: any;
    };
  }
}
