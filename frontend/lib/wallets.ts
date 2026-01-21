/**
 * Multi-Wallet Support for ZK-Vote
 * Supports Puzzle, Leo, and Fox wallets
 */

export type WalletType = "puzzle" | "leo" | "fox";

export interface WalletConnection {
  address: string;
  network: string;
  walletType: WalletType;
  balances?: any[];
}

// Check if Puzzle Wallet is available
export function hasPuzzleWallet(): boolean {
  if (typeof window === "undefined") return false;
  return !!window?.aleo?.puzzleWalletClient;
}

// Check if Leo Wallet is available
export function hasLeoWallet(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window as any).leoWallet;
}

// Check if Fox Wallet is available
export function hasFoxWallet(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window as any).aleo?.foxWallet;
}

// Get available wallets
export function getAvailableWallets(): WalletType[] {
  const wallets: WalletType[] = [];
  if (hasPuzzleWallet()) wallets.push("puzzle");
  if (hasLeoWallet()) wallets.push("leo");
  if (hasFoxWallet()) wallets.push("fox");
  return wallets;
}

// Connect to Leo Wallet
export async function connectLeoWallet(): Promise<WalletConnection | null> {
  try {
    if (!hasLeoWallet()) {
      throw new Error("Leo Wallet not detected. Please install Leo Wallet extension.");
    }

    const leoWallet = (window as any).leoWallet;
    const account = await leoWallet.connect();
    
    if (account) {
      return {
        address: account.address || account.publicKey || "",
        network: account.network || "testnet",
        walletType: "leo",
      };
    }
    return null;
  } catch (error: any) {
    console.error("Leo Wallet connect error:", error);
    throw error;
  }
}

// Connect to Fox Wallet
export async function connectFoxWallet(): Promise<WalletConnection | null> {
  try {
    if (!hasFoxWallet()) {
      throw new Error("Fox Wallet not detected. Please install Fox Wallet extension.");
    }

    const foxWallet = (window as any).aleo.foxWallet;
    const account = await foxWallet.connect();
    
    if (account) {
      return {
        address: account.address || account.publicKey || "",
        network: account.network || "testnet",
        walletType: "fox",
      };
    }
    return null;
  } catch (error: any) {
    console.error("Fox Wallet connect error:", error);
    throw error;
  }
}

// Declare global window types
declare global {
  interface Window {
    aleo?: {
      puzzleWalletClient?: any;
      foxWallet?: any;
    };
    leoWallet?: any;
  }
}
