"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "./WalletProvider";
import { WalletType } from "@/lib/wallets";

export function WalletConnect() {
  const { wallet, connected, connect, disconnect, loading, availableWallets } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [connectingWallet, setConnectingWallet] = useState<WalletType | null>(null);

  useEffect(() => {
    // Auto-connect if only one wallet available and not connected
    // Only auto-connect after user interaction (not on page load)
    const handleUserInteraction = () => {
      if (availableWallets.length === 1 && !connected && !loading && !error) {
        handleConnect(availableWallets[0]);
      }
    };
    
    // Listen for click events to trigger auto-connect
    if (availableWallets.length === 1 && !connected) {
      document.addEventListener('click', handleUserInteraction, { once: true });
      return () => document.removeEventListener('click', handleUserInteraction);
    }
  }, [availableWallets.length, connected, loading, error]);

  const handleConnect = async (walletType?: WalletType) => {
    try {
      setError(null);
      setShowWalletSelector(false);
      setConnectingWallet(walletType || availableWallets[0] || null);
      
      // Generate a signature/connection ID for display
      const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      setSignature(connectionId);
      
      await connect(walletType);
      
      // Clear signature after successful connection
      setTimeout(() => {
        setSignature(null);
        setConnectingWallet(null);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
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

  if (availableWallets.length === 0) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-3 shadow-sm">
        <p className="text-yellow-800 text-sm font-semibold mb-2 flex items-center gap-2">
          <span>⚠️</span>
          <span>No wallet detected</span>
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <a
            href="https://puzzle.online"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 underline font-medium hover:scale-105 transition-transform"
          >
            Install Puzzle
          </a>
          <span className="text-gray-400">•</span>
          <a
            href="https://www.leo.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 underline font-medium hover:scale-105 transition-transform"
          >
            Install Leo
          </a>
          <span className="text-gray-400">•</span>
          <a
            href="https://foxwallet.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 underline font-medium hover:scale-105 transition-transform"
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
          className="bg-gradient-to-r from-primary-500 via-blue-500 to-primary-600 hover:from-primary-600 hover:via-blue-600 hover:to-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-105"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <span className="text-lg">{getWalletIcon(availableWallets[0])}</span>
              <span>Connect {getWalletName(availableWallets[0])}</span>
            </>
          )}
        </button>
      ) : (
        <>
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
                {availableWallets.map((walletType) => (
                  <button
                    key={walletType}
                    onClick={() => handleConnect(walletType)}
                    className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-primary-50 hover:to-blue-50 rounded-lg transition-all duration-200 flex items-center gap-3 group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{getWalletIcon(walletType)}</span>
                    <span className="font-semibold text-gray-800 group-hover:text-primary-700">{getWalletName(walletType)}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 shadow-sm animate-fade-in">
          <p className="text-red-700 text-sm font-semibold flex items-center gap-2">
            <span>❌</span>
            <span>{error}</span>
          </p>
        </div>
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
