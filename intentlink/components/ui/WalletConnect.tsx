// components/ui/WalletConnect.tsx
'use client';

import { useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface WalletConnectProps {
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
}

export function WalletConnect({ walletAddress, setWalletAddress }: WalletConnectProps) {
  
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        // Request account access (returns an array of address strings)
        const accounts = await provider.send("eth_requestAccounts", []);
        
        if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
            toast.success("Wallet Connected");
        }
      } catch {
        toast.error("Failed to connect wallet. Please try again.");
      }
    } else {
      toast.warning("Wallet not found", {
        description: "Please install MetaMask or another Web3 wallet!"
      });
    }
  };

  useEffect(() => {
    // 1. Check for an already connected wallet on page load
    const checkForConnectedWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          // listAccounts in Ethers v6 returns JsonRpcSigner objects, not strings
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            setWalletAddress(accounts[0].address);
          }
        } catch {
          // Silently fail - user can manually connect
        }
      }
    };
    checkForConnectedWallet();

    // 2. Setup Event Listeners for account changes
    const handleAccountsChanged = (params: unknown) => {
      const accounts = params as string[];
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        toast.info("Wallet account changed");
      } else {
        setWalletAddress(null);
        toast.info("Wallet disconnected");
      }
    };

    if (window.ethereum?.on) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    // 3. Cleanup listeners
    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [setWalletAddress]);

  // Render: Connected State
  if (walletAddress) {
    return (
      <div className="flex items-center space-x-2 bg-cyber-purple/20 text-cyber-cyan px-4 py-2 rounded-lg border border-glass-stroke backdrop-blur-sm shadow-sm shadow-cyber-purple/10">
        <div className="w-2 h-2 bg-defi-success rounded-full animate-pulse shadow-lg shadow-defi-success/50"></div>
        <span className="text-sm font-medium text-gray-300">Connected:</span>
        <span className="font-mono text-sm text-white">
          {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
        </span>
      </div>
    );
  }

  // Render: Disconnected State (Button)
  return (
    <Button 
      onClick={connectWallet}
      className="font-display uppercase tracking-wider bg-linear-to-r from-cyber-cyan to-cyber-purple text-space-900 font-bold hover:shadow-cyber-cyan-glow-hover transition-shadow duration-300"
    >
      Connect Wallet
    </Button>
  );
}