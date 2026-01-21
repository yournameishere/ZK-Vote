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
    checkConnection();
  }, []);

  const checkAvailableWallets = () => {
    const wallets: WalletType[] = [];
    if (hasPuzzleWallet()) wallets.push("puzzle");
    if (hasLeoWallet()) wallets.push("leo");
    if (hasFoxWallet()) wallets.push("fox");
    setAvailableWallets(wallets);
  };

  const checkConnection = async () => {
    try {
      // Check Puzzle Wallet first (most common)
      if (hasPuzzleWallet()) {
        const account = await getPuzzleAccount();
        if (account) {
          setWallet({
            address: account.address,
            network: account.network,
            walletType: "puzzle",
            balances: account.balances,
          });
          setLoading(false);
          return;
        }
      }

      // Check Leo Wallet
      if (hasLeoWallet()) {
        const leoWallet = (window as any).leoWallet;
        if (leoWallet?.isConnected?.()) {
          const account = await leoWallet.getAccount();
          if (account) {
            setWallet({
              address: account.address || account.publicKey || "",
              network: account.network || "testnet",
              walletType: "leo",
            });
            setLoading(false);
            return;
          }
        }
      }

      // Check Fox Wallet
      if (hasFoxWallet()) {
        const foxWallet = (window as any).aleo.foxWallet;
        if (foxWallet?.isConnected?.()) {
          const account = await foxWallet.getAccount();
          if (account) {
            setWallet({
              address: account.address || account.publicKey || "",
              network: account.network || "testnet",
              walletType: "fox",
            });
            setLoading(false);
            return;
          }
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
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
    // Disconnect from wallet if needed
    if (wallet?.walletType === "leo" && hasLeoWallet()) {
      (window as any).leoWallet?.disconnect?.();
    } else if (wallet?.walletType === "fox" && hasFoxWallet()) {
      (window as any).aleo?.foxWallet?.disconnect?.();
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
