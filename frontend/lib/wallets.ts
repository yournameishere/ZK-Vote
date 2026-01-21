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
  // Leo Wallet can be accessed via window.leoWallet or window.leo
  return !!(window as any).leoWallet || !!(window as any).leo;
}

// Check if Fox Wallet is available
export function hasFoxWallet(): boolean {
  if (typeof window === "undefined") return false;
  // Fox Wallet uses window.foxwallet.aleo
  return !!(window as any).foxwallet?.aleo || !!(window as any).foxwallet;
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
      throw new Error("Leo Wallet not detected. Please install Leo Wallet extension from https://www.leo.app");
    }

    let address = "";
    let network = "testnet";

    // Try window.leoWallet first (most common)
    if ((window as any).leoWallet) {
      try {
        const leoWallet = (window as any).leoWallet;
        
        // Method 1: Try connect() method
        if (typeof leoWallet.connect === 'function') {
          try {
            const result = await leoWallet.connect();
            if (result && (result.address || result.publicKey)) {
              address = result.address || result.publicKey;
              network = result.network || "testnet";
            }
          } catch (connectError: any) {
            // If connect fails, try other methods
            console.warn("Leo Wallet connect() failed:", connectError);
          }
        }
        
        // Method 2: Check if already connected and get account
        if (!address && typeof leoWallet.getAccount === 'function') {
          try {
            const account = await leoWallet.getAccount();
            if (account && (account.address || account.publicKey)) {
              address = account.address || account.publicKey;
              network = account.network || "testnet";
            }
          } catch (accountError: any) {
            console.warn("Leo Wallet getAccount() failed:", accountError);
          }
        }
        
        // Method 3: Check if publicKey/address is directly available
        if (!address && leoWallet.publicKey) {
          address = leoWallet.publicKey;
        }
        if (!address && leoWallet.address) {
          address = leoWallet.address;
        }
      } catch (e: any) {
        console.error("Leo Wallet access error:", e);
      }
    }

    // Try window.leo as fallback
    if (!address && (window as any).leo) {
      try {
        const leo = (window as any).leo;
        if (leo.publicKey) {
          address = leo.publicKey;
        } else if (leo.address) {
          address = leo.address;
        } else if (typeof leo.connect === 'function') {
          const result = await leo.connect();
          if (result && (result.address || result.publicKey)) {
            address = result.address || result.publicKey;
          }
        }
      } catch (e: any) {
        console.error("Leo fallback error:", e);
      }
    }

    if (!address) {
      throw new Error("Unable to connect to Leo Wallet. Please ensure the extension is installed, unlocked, and try refreshing the page.");
    }

    return {
      address,
      network,
      walletType: "leo",
    };
  } catch (error: any) {
    console.error("Leo Wallet connect error:", error);
    throw new Error(error.message || "Failed to connect to Leo Wallet. Please ensure Leo Wallet is installed and unlocked.");
  }
}

// Connect to Fox Wallet
export async function connectFoxWallet(): Promise<WalletConnection | null> {
  try {
    if (!hasFoxWallet()) {
      throw new Error("Fox Wallet not detected. Please install Fox Wallet extension from https://foxwallet.com");
    }

    let address = "";
    let network = "testnet";

    // Try window.foxwallet.aleo (official API)
    if ((window as any).foxwallet?.aleo) {
      try {
        const foxProvider = (window as any).foxwallet.aleo;
        
        // Method 1: Try connect with chain and network
        if (typeof foxProvider.connect === 'function') {
          try {
            // Connect to Aleo Testnet
            const result = await foxProvider.connect("Aleo", "Testnet");
            if (result && (result.address || result.publicKey)) {
              address = result.address || result.publicKey;
              network = result.network || "testnet";
            }
          } catch (connectError: any) {
            console.warn("Fox Wallet connect() failed:", connectError);
            // Try without parameters
            try {
              const result = await foxProvider.connect();
              if (result && (result.address || result.publicKey)) {
                address = result.address || result.publicKey;
                network = result.network || "testnet";
              }
            } catch (e2: any) {
              console.warn("Fox Wallet connect() without params failed:", e2);
            }
          }
        }
        
        // Method 2: Check if already connected
        if (!address && typeof foxProvider.isConnected === 'function') {
          try {
            const isConnected = await foxProvider.isConnected();
            if (isConnected && typeof foxProvider.getAccount === 'function') {
              const account = await foxProvider.getAccount();
              if (account && (account.address || account.publicKey)) {
                address = account.address || account.publicKey;
                network = account.network || "testnet";
              }
            }
          } catch (accountError: any) {
            console.warn("Fox Wallet getAccount() failed:", accountError);
          }
        }
      } catch (e: any) {
        console.error("Fox Wallet provider error:", e);
      }
    }

    // Try window.foxwallet directly as fallback
    if (!address && (window as any).foxwallet) {
      try {
        const foxwallet = (window as any).foxwallet;
        if (foxwallet.publicKey) {
          address = foxwallet.publicKey;
        } else if (foxwallet.address) {
          address = foxwallet.address;
        } else if (typeof foxwallet.connect === 'function') {
          const result = await foxwallet.connect();
          if (result && (result.address || result.publicKey)) {
            address = result.address || result.publicKey;
          }
        }
      } catch (e: any) {
        console.error("Fox Wallet fallback error:", e);
      }
    }

    if (!address) {
      throw new Error("Unable to connect to Fox Wallet. Please ensure the extension is installed, unlocked, and try refreshing the page.");
    }

    return {
      address,
      network,
      walletType: "fox",
    };
  } catch (error: any) {
    console.error("Fox Wallet connect error:", error);
    throw new Error(error.message || "Failed to connect to Fox Wallet. Please ensure Fox Wallet is installed and unlocked.");
  }
}

// Window types are declared in types/window.d.ts
