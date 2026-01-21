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
      const selectedWallet = walletType || availableWallets[0] || null;
      setConnectingWallet(selectedWallet);
      
      // Generate a signature/connection ID for display
      const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      setSignature(connectionId);
      
      // Add delay to show signature
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await connect(selectedWallet);
      
      // Clear signature after successful connection
      setTimeout(() => {
        setSignature(null);
        setConnectingWallet(null);
      }, 2000);
    } catch (err: any) {
      console.error("Wallet connection error:", err);
      const errorMessage = err.message || "Failed to connect wallet. Please ensure the wallet extension is installed and unlocked.";
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


  // If only Puzzle Wallet available, connect directly without dropdown
  if (availableWallets.length === 1 && availableWallets[0] === "puzzle") {
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
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-2 shadow-sm">
            <p className="text-blue-700 text-xs font-mono flex items-center gap-2">
              <span>🔐</span>
              <span>Signature: {signature}</span>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-2">
      <button
        onClick={() => setShowWalletSelector(!showWalletSelector)}
        disabled={loading}
        className="bg-gradient-to-r from-primary-500 via-blue-500 to-primary-600 hover:from-primary-600 hover:via-blue-600 hover:to-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Connecting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span>💼</span>
            <span>Connect Wallet</span>
          </span>
        )}
      </button>
      {showWalletSelector && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" 
            onClick={() => setShowWalletSelector(false)}
          />
          <div className="absolute top-full mt-2 right-0 bg-white border-2 border-primary-200 rounded-xl shadow-2xl p-3 z-50 min-w-[240px] animate-slide-up">
            <p className="text-xs font-semibold text-gray-500 mb-2 px-2">Select Wallet</p>
            {availableWallets.length > 0 ? (
              availableWallets.map((walletType) => (
                <button
                  key={walletType}
                  onClick={() => handleConnect(walletType)}
                  className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-primary-50 hover:to-blue-50 rounded-lg transition-all duration-200 flex items-center gap-3 group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{getWalletIcon(walletType)}</span>
                  <span className="font-semibold text-gray-800 group-hover:text-primary-700">{getWalletName(walletType)}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">
                <p className="mb-2">Puzzle Wallet not detected.</p>
                <div className="flex flex-col gap-1 text-xs">
                  <a href="https://puzzle.online" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Install Puzzle Wallet</a>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {error && (
        <WalletErrorHandler error={error} walletType={connectingWallet || undefined} />
      )}
      {signature && !error && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-2 shadow-sm">
          <p className="text-blue-700 text-xs font-mono flex items-center gap-2">
            <span>🔐</span>
            <span>Signature: {signature}</span>
          </p>
        </div>
      )}
    </div>
  );
}
