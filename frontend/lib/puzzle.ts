import { connect as puzzleConnect, getAccount, Network } from "@puzzlehq/sdk-core";

export interface PuzzleWalletConnection {
  address: string;
  network: string;
  balances?: any[];
}

// Check if Puzzle Wallet is available
export function hasPuzzleWallet(): boolean {
  if (typeof window === "undefined") return false;
  // Check multiple possible injection points
  return !!(
    window?.aleo?.puzzleWalletClient ||
    (window as any).puzzleWallet ||
    (window as any).aleo?.puzzle ||
    // Also check if SDK functions are available (wallet might be injected but not yet ready)
    typeof (window as any).puzzleConnect !== 'undefined'
  );
}

// Connect to Puzzle Wallet
export async function connectPuzzleWallet(): Promise<PuzzleWalletConnection | null> {
  try {
    // Wait a bit for wallet to be ready if it's still loading
    let retries = 0;
    while (!hasPuzzleWallet() && retries < 5) {
      await new Promise(resolve => setTimeout(resolve, 200));
      retries++;
    }

    const eligibilityProgramId = process.env.NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID || "eligibility_zkvote_4521.aleo";
    const votingProgramId = process.env.NEXT_PUBLIC_VOTING_PROGRAM_ID || "voting_zkvote_4522.aleo";
    const registryProgramId = process.env.NEXT_PUBLIC_REGISTRY_PROGRAM_ID || "registry_zkvote_4521.aleo";
    const subscriptionProgramId = process.env.NEXT_PUBLIC_SUBSCRIPTION_PROGRAM_ID || "subscription_zkvote_4522.aleo";

    // Call connect - this will trigger Puzzle Wallet's signature/approval prompt
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

    throw new Error("Connection response was empty. Please try again.");
  } catch (error: any) {
    console.error("Wallet connect error:", error);
    // Provide helpful error messages
    if (error.message?.includes("not detected") || error.message?.includes("not found")) {
      throw new Error("Puzzle Wallet not detected. Please install Puzzle Wallet extension from https://puzzle.online and refresh the page.");
    }
    if (error.message?.includes("rejected") || error.message?.includes("cancel")) {
      throw new Error("Connection was cancelled. Please try again.");
    }
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

// Window types are declared in types/window.d.ts
