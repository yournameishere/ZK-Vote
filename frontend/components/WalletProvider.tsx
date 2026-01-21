"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { connectPuzzleWallet, getPuzzleAccount, hasPuzzleWallet, PuzzleWalletConnection } from "@/lib/puzzle";
import { connectLeoWallet, connectFoxWallet, hasLeoWallet, hasFoxWallet, WalletConnection, WalletType } from "@/lib/wallets";

interface WalletContextType {
  wallet: WalletConnection | null;
  connected: boolean;
  connect: (walletType?: WalletType) => Promise<void>;
  disconnect: () => void;
  loading: boolean;
  availableWallets: WalletType[];
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableWallets, setAvailableWallets] = useState<WalletType[]>([]);

  useEffect(() => {
    checkAvailableWallets();
    // Only check for existing connection, don't auto-connect
    checkExistingConnection();
    
    // Listen for wallet connection events
    const handleWalletConnect = () => {
      checkExistingConnection();
    };
    
    window.addEventListener('walletConnected', handleWalletConnect);
    return () => window.removeEventListener('walletConnected', handleWalletConnect);
  }, []);

  const checkAvailableWallets = () => {
    // Always allow Puzzle Wallet connection attempt
    // The SDK will handle errors if wallet isn't available
    const wallets: WalletType[] = ["puzzle"];
    setAvailableWallets(wallets);
    
    // Also check periodically in case wallet loads after page load
    if (typeof window !== 'undefined') {
      const checkInterval = setInterval(() => {
        if (hasPuzzleWallet() && wallets.length === 0) {
          setAvailableWallets(["puzzle"]);
          clearInterval(checkInterval);
        }
      }, 1000);
      
      // Stop checking after 10 seconds
      setTimeout(() => clearInterval(checkInterval), 10000);
    }
  };

  const checkExistingConnection = async () => {
    try {
      // Only check localStorage for previous connection (user manually connected before)
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('zkvote_wallet');
        if (stored) {
          try {
            const walletData = JSON.parse(stored);
            // Verify wallet is still connected
            if (walletData.type === 'puzzle' && hasPuzzleWallet()) {
              const account = await getPuzzleAccount();
              if (account && account.address === walletData.address) {
                setWallet({
                  address: account.address,
                  network: account.network,
                  walletType: "puzzle",
                  balances: account.balances,
                });
                setLoading(false);
                return;
              }
            } else if (walletData.type === 'leo' && hasLeoWallet()) {
              const leoWallet = (window as any).leoWallet;
              if (leoWallet?.publicKey || leoWallet?.address) {
                const address = leoWallet.address || leoWallet.publicKey;
                if (address === walletData.address) {
                  setWallet({
                    address: address,
                    network: leoWallet.network || "testnet",
                    walletType: "leo",
                  });
                  setLoading(false);
                  return;
                }
              }
            } else if (walletData.type === 'fox' && hasFoxWallet()) {
              const foxProvider = (window as any).foxwallet?.aleo;
              if (foxProvider) {
                try {
                  const isConnected = await foxProvider.isConnected?.();
                  if (isConnected) {
                    const account = await foxProvider.getAccount?.();
                    if (account && (account.address || account.publicKey) === walletData.address) {
                      setWallet({
                        address: account.address || account.publicKey || "",
                        network: account.network || "testnet",
                        walletType: "fox",
                      });
                      setLoading(false);
                      return;
                    }
                  }
                } catch (e) {
                  // Ignore errors
                }
              }
            }
          } catch (e) {
            // Invalid stored data, clear it
            localStorage.removeItem('zkvote_wallet');
          }
        }
      }
    } catch (error) {
      console.error("Error checking existing connection:", error);
    } finally {
      setLoading(false);
    }
  };

  const connect = async (walletType?: WalletType) => {
    try {
      setLoading(true);
      let connection: WalletConnection | null = null;

      // Determine wallet type
      const type = walletType || availableWallets[0] || "puzzle";

      if (type === "puzzle") {
        const puzzleConn = await connectPuzzleWallet();
        if (puzzleConn) {
          connection = {
            address: puzzleConn.address,
            network: puzzleConn.network,
            walletType: "puzzle",
            balances: puzzleConn.balances,
          };
        }
      } else if (type === "leo") {
        connection = await connectLeoWallet();
      } else if (type === "fox") {
        connection = await connectFoxWallet();
      }

      if (connection) {
        setWallet(connection);
        // Dispatch event for other components
        window.dispatchEvent(new Event('walletConnected'));
        // Store connection in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('zkvote_wallet', JSON.stringify({
            type: connection.walletType,
            address: connection.address,
            network: connection.network,
          }));
        }
      } else {
        throw new Error(`Failed to connect to ${type} wallet`);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setWallet(null);
    // Clear stored connection
    if (typeof window !== 'undefined') {
      localStorage.removeItem('zkvote_wallet');
    }
    // Disconnect from wallet if needed
    if (wallet?.walletType === "leo" && hasLeoWallet()) {
      try {
        (window as any).leoWallet?.disconnect?.();
      } catch (e) {
        console.warn("Leo Wallet disconnect error:", e);
      }
    } else if (wallet?.walletType === "fox" && hasFoxWallet()) {
      try {
        (window as any).foxwallet?.aleo?.disconnect?.();
      } catch (e) {
        console.warn("Fox Wallet disconnect error:", e);
      }
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected: !!wallet,
        connect,
        disconnect,
        loading,
        availableWallets,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
