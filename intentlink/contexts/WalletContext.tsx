"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

/**
 * Context type for wallet connection state and methods
 */
interface WalletContextType {
  walletAddress: string | null;
  isConnecting: boolean;
  chainId: number | null;
  refreshTrigger: number;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
      send: (method: string, params?: unknown[]) => Promise<unknown>;
    };
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /**
   * Connects to the user's Web3 wallet
   * @throws {Error} If wallet connection fails
   */
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask not found', {
        description: 'Please install MetaMask or another Web3 wallet!'
      });
      return;
    }

    setIsConnecting(true);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      }) as string[];

      const provider = new ethers.BrowserProvider(window.ethereum);

      if (accounts && accounts.length > 0) {
        const address = accounts[0] as string;
        setWalletAddress(address);

        const network = await provider.getNetwork();
        const currentChainId = Number(network.chainId);

        setChainId(currentChainId);

        toast.success('Wallet Connected', {
          description: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
        });

        if (currentChainId !== 1043 && currentChainId !== 80002) {
          toast.warning('Wrong Network', {
            description: 'Please switch to BlockDAG Awakening Testnet (1043) or Polygon Amoy (80002)',
            duration: 5000
          });
        }
      }
    } catch (err) {
      const error = err as { code?: string; message?: string };

      if (error.code === 'ACTION_REJECTED' || error.code === '4001') {
        toast.error('Connection rejected', {
          description: 'You rejected the wallet connection request'
        });
      } else {
        toast.error('Failed to connect wallet', {
          description: error.message || 'Please try again'
        });
      }
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Disconnects the wallet and clears state
   */
  const disconnectWallet = () => {
    setWalletAddress(null);
    setChainId(null);
    toast.info('Wallet Disconnected');
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();

          if (accounts.length > 0) {
            const address = accounts[0].address;
            setWalletAddress(address);

            const network = await provider.getNetwork();
            const currentChainId = Number(network.chainId);

            setChainId(currentChainId);

            toast.success('Wallet Restored', {
              description: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
            });
          }
        } catch (err) {
          // Silently fail - user can manually connect
        }
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];

      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        toast.info('Wallet account changed', {
          description: `${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`
        });
      } else {
        setWalletAddress(null);
        setChainId(null);
        toast.info('Wallet disconnected');
      }
    };

    const handleChainChanged = (...args: unknown[]) => {
      const newChainId = args[0] as string;
      const chainIdNum = parseInt(newChainId, 16);

      setChainId(chainIdNum);
      setRefreshTrigger(prev => prev + 1); // Trigger portfolio refresh
      toast.info('Network changed', {
        description: `Chain ID: ${chainIdNum}`
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{
      walletAddress,
      isConnecting,
      chainId,
      refreshTrigger,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
}

/**
 * Hook to access wallet context
 * @throws {Error} If used outside of WalletProvider
 * @returns {WalletContextType} Wallet context value
 */
export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
