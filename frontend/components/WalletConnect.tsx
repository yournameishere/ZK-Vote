"use client";

import React, { useState } from "react";
import { useWallet } from "./WalletProvider";
import { WalletType } from "@/lib/wallets";

export function WalletConnect() {
  const { wallet, connected, connect, disconnect, loading, availableWallets } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [showWalletSelector, setShowWalletSelector] = useState(false);

  const handleConnect = async (walletType?: WalletType) => {
    try {
      setError(null);
      setShowWalletSelector(false);
      await connect(walletType);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setError(null);
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

  if (connected && wallet) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg px-4 py-2 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getWalletIcon(wallet.walletType)}</span>
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium">{getWalletName(wallet.walletType)}</p>
              <p className="text-sm text-primary-800 font-semibold">
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-6)}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleDisconnect}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
        >
          Disconnect
        </button>
      </div>
    );
  }

  if (availableWallets.length === 0) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
        <p className="text-yellow-800 text-sm font-medium mb-2">
          No wallet detected
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <a
            href="https://puzzle.online"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 underline"
          >
            Install Puzzle
          </a>
          <span className="text-gray-400">•</span>
          <a
            href="https://www.leo.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 underline"
          >
            Install Leo
          </a>
          <span className="text-gray-400">•</span>
          <a
            href="https://foxwallet.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 underline"
          >
            Install Fox
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-2">
      {availableWallets.length === 1 ? (
        <button
          onClick={() => handleConnect(availableWallets[0])}
          disabled={loading}
          className="bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <span>{getWalletIcon(availableWallets[0])}</span>
              <span>Connect {getWalletName(availableWallets[0])}</span>
            </>
          )}
        </button>
      ) : (
        <>
          <button
            onClick={() => setShowWalletSelector(!showWalletSelector)}
            disabled={loading}
            className="bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
          {showWalletSelector && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowWalletSelector(false)}
              />
              <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-xl p-2 z-50 min-w-[220px]">
                {availableWallets.map((walletType) => (
                  <button
                    key={walletType}
                    onClick={() => handleConnect(walletType)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <span className="text-xl">{getWalletIcon(walletType)}</span>
                    <span className="font-medium text-gray-800">{getWalletName(walletType)}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 shadow-sm">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
