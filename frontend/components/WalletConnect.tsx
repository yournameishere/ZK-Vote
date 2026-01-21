"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "./WalletProvider";
import { WalletType } from "@/lib/wallets";
import { WalletErrorHandler } from "./WalletErrorHandler";

export function WalletConnect() {
  const { wallet, connected, connect, disconnect, loading, availableWallets } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [connectingWallet, setConnectingWallet] = useState<WalletType | null>(null);


  const handleConnect = async (walletType?: WalletType) => {
    try {
      setError(null);
      setShowWalletSelector(false);
      const selectedWallet = walletType || "puzzle";
      setConnectingWallet(selectedWallet);
      
      // Generate a signature/connection ID for display
      const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      setSignature(connectionId);
      
      // Show signature immediately
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Connect to wallet - this will trigger Puzzle Wallet's signature prompt
      await connect(selectedWallet);
      
      // Keep signature visible for a bit after connection
      setTimeout(() => {
        setSignature(null);
        setConnectingWallet(null);
      }, 3000);
    } catch (err: any) {
      console.error("Wallet connection error:", err);
      const errorMessage = err.message || "Failed to connect wallet. Please ensure Puzzle Wallet extension is installed, unlocked, and try again.";
      setError(errorMessage);
      setSignature(null);
      setConnectingWallet(null);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setError(null);
    setSignature(null);
  };

  const getWalletName = (type: WalletType): string => {
    switch (type) {
      case "puzzle":
        return "Puzzle Wallet";
      case "leo":
        return "Leo Wallet";
      case "fox":
        return "Fox Wallet";
      default:
        return "Wallet";
    }
  };

  const getWalletIcon = (type: WalletType): string => {
    switch (type) {
      case "puzzle":
        return "🧩";
      case "leo":
        return "🦁";
      case "fox":
        return "🦊";
      default:
        return "💼";
    }
  };

  // Show connecting state with signature
  if (loading && connectingWallet) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-r from-primary-100 to-blue-100 border-2 border-primary-300 rounded-lg px-4 py-2 shadow-md animate-pulse">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent"></div>
            <div className="flex flex-col">
              <p className="text-xs text-primary-700 font-semibold">Connecting {getWalletName(connectingWallet)}...</p>
              {signature && (
                <p className="text-xs text-primary-600 font-mono">
                  {signature.slice(0, 12)}...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (connected && wallet) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-2">
            <span className="text-lg animate-bounce">{getWalletIcon(wallet.walletType)}</span>
            <div className="flex flex-col">
              <p className="text-xs text-gray-600 font-medium">{getWalletName(wallet.walletType)}</p>
              <p className="text-sm text-primary-800 font-bold">
                {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleDisconnect}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md hover:scale-105"
        >
          Disconnect
        </button>
      </div>
    );
  }


  // Always show Connect Puzzle Wallet button (don't rely on detection)
  return (
    <div className="relative flex flex-col gap-2">
      <button
        onClick={() => handleConnect("puzzle")}
        disabled={loading}
        className="bg-gradient-to-r from-primary-500 via-blue-500 to-primary-600 hover:from-primary-600 hover:via-blue-600 hover:to-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-105"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <span className="text-lg">🧩</span>
            <span>Connect Puzzle Wallet</span>
          </>
        )}
      </button>
      {error && (
        <WalletErrorHandler error={error} walletType="puzzle" />
      )}
      {signature && !error && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-2 shadow-sm animate-fade-in">
          <p className="text-blue-700 text-xs font-mono flex items-center gap-2">
            <span>🔐</span>
            <span>Signature: {signature}</span>
          </p>
        </div>
      )}
    </div>
  );
}
