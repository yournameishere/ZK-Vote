"use client";

import React, { useState } from "react";
import { useWallet } from "./WalletProvider";
import { hasPuzzleWallet } from "@/lib/puzzle";

export function WalletConnect() {
  const { wallet, connected, connect, disconnect, loading } = useWallet();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setError(null);
      await connect();
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setError(null);
  };

  if (!hasPuzzleWallet()) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">
          Puzzle Wallet not detected. Please{" "}
          <a
            href="https://puzzle.online"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            install Puzzle Wallet
          </a>{" "}
          to continue.
        </p>
      </div>
    );
  }

  if (connected && wallet) {
    return (
      <div className="flex items-center gap-4">
        <div className="bg-primary-50 border border-primary-200 rounded-lg px-4 py-2">
          <p className="text-sm text-primary-800">
            <span className="font-semibold">Connected:</span>{" "}
            {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
          </p>
        </div>
        <button
          onClick={handleDisconnect}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleConnect}
        disabled={loading}
        className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Connecting..." : "Connect Puzzle Wallet"}
      </button>
      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
          {error}
        </p>
      )}
    </div>
  );
}
