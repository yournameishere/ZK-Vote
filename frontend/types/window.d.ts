// Global window type declarations for Aleo wallets
declare global {
  interface Window {
    aleo?: {
      puzzleWalletClient?: any;
      foxWallet?: any;
    };
    leoWallet?: any;
  }
}

export {};
