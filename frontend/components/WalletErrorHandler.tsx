"use client";

import React from "react";

interface WalletErrorHandlerProps {
  error: string | null;
  walletType?: string;
}

export function WalletErrorHandler({ error, walletType }: WalletErrorHandlerProps) {
  if (!error) return null;

  // Parse error to provide helpful messages
  const getHelpfulMessage = (errorMsg: string): string => {
    const lowerError = errorMsg.toLowerCase();
    
    if (lowerError.includes("not detected") || lowerError.includes("not found")) {
      return `Please install ${walletType || "the wallet"} extension and refresh the page.`;
    }
    
    if (lowerError.includes("unlocked") || lowerError.includes("lock")) {
      return "Please unlock your wallet extension and try again.";
    }
    
    if (lowerError.includes("user rejected") || lowerError.includes("cancel")) {
      return "Connection was cancelled. Please try again.";
    }
    
    if (lowerError.includes("network") || lowerError.includes("chain")) {
      return "Network error. Please check your connection and try again.";
    }
    
    return errorMsg;
  };

  const helpfulMessage = getHelpfulMessage(error);
  const isInstallError = error.toLowerCase().includes("not detected") || error.toLowerCase().includes("install");

  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 shadow-lg animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-red-800 font-semibold mb-1">Connection Error</p>
          <p className="text-red-700 text-sm">{helpfulMessage}</p>
          {isInstallError && (
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-xs text-red-600 font-medium mb-2">Install Links:</p>
              <div className="flex flex-wrap gap-2">
                {walletType?.toLowerCase().includes("leo") && (
                  <a
                    href="https://www.leo.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-red-700 hover:text-red-900 underline font-medium"
                  >
                    Install Leo Wallet
                  </a>
                )}
                {walletType?.toLowerCase().includes("fox") && (
                  <a
                    href="https://foxwallet.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-red-700 hover:text-red-900 underline font-medium"
                  >
                    Install Fox Wallet
                  </a>
                )}
                {walletType?.toLowerCase().includes("puzzle") && (
                  <a
                    href="https://puzzle.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-red-700 hover:text-red-900 underline font-medium"
                  >
                    Install Puzzle Wallet
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
