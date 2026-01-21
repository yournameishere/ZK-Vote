"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { connectPuzzleWallet, getPuzzleAccount, hasPuzzleWallet, PuzzleWalletConnection } from "@/lib/puzzle";

interface WalletContextType {
  wallet: PuzzleWalletConnection | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  loading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<PuzzleWalletConnection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing connection on mount
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      if (hasPuzzleWallet()) {
        const account = await getPuzzleAccount();
        if (account) {
          setWallet(account);
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    } finally {
      setLoading(false);
    }
  };

  const connect = async () => {
    try {
      setLoading(true);
      const connection = await connectPuzzleWallet();
      if (connection) {
        setWallet(connection);
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
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected: !!wallet,
        connect,
        disconnect,
        loading,
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
