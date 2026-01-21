// Global window type declarations for Aleo wallets
declare global {
  interface Window {
    aleo?: {
      puzzleWalletClient?: any;
      foxWallet?: any;
    };
    leoWallet?: {
      connect?: () => Promise<any>;
      getAccount?: () => Promise<any>;
      isConnected?: () => boolean;
      disconnect?: () => void;
      publicKey?: string;
      address?: string;
    };
    leo?: {
      isConnected?: boolean;
      connect?: () => Promise<any>;
    };
    foxwallet?: {
      aleo?: {
        connect?: (chain: string, network: string) => Promise<any>;
        isConnected?: () => Promise<boolean>;
        getAccount?: () => Promise<any>;
        disconnect?: () => void;
      };
    };
  }
}

export {};
