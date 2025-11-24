"use client";

import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
  const { walletAddress, isConnecting, chainId, connectWallet, disconnectWallet } = useWallet();

  const getChainName = (id: number | null) => {
    if (id === 1043) return "BlockDAG Testnet";
    if (id === 80002) return "Polygon Amoy";
    if (id === 1) return "Ethereum";
    return `Chain ${id}`;
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-black font-bold text-xl">I</span>
          </div>
          <span className="font-heading text-xl font-bold text-white">
            IntentLink
          </span>
        </div>

        {/* Wallet Connection */}
        <div className="flex items-center gap-4">
          {walletAddress ? (
            <>
              {/* Chain Badge */}
              {chainId && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/20 border border-secondary/30">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span className="text-sm text-gray-300">{getChainName(chainId)}</span>
                </div>
              )}
              
              {/* Connected Wallet */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 backdrop-blur-sm">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="font-mono text-sm text-white">
                  {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
                </span>
                <button
                  onClick={disconnectWallet}
                  className="ml-2 p-1 hover:bg-white/10 rounded transition-colors"
                  title="Disconnect"
                >
                  <LogOut className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
              </div>
            </>
          ) : (
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="font-display uppercase tracking-wider bg-linear-to-r from-primary to-secondary text-black font-bold hover:opacity-90 transition-opacity"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
