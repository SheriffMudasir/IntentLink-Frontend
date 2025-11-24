// components/ui/IntentInput.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface IntentInputProps {
  onExecute: (intent: string) => void;
  isLoading: boolean;
  isConnected: boolean;
}

export function IntentInput({ onExecute, isLoading, isConnected }: IntentInputProps) {
  // Default placeholder intent for the demo
  const [intent, setIntent] = useState('Stake my 100 test-BDAG in the safest farm.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only execute if connected and intent is valid
    if (intent.trim() && isConnected) {
      onExecute(intent);
    }
  };

  // Dynamic button text based on state
  const buttonText = isConnected ? 'Execute Intent' : 'Connect Wallet to Begin';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col items-center gap-6 animate-fade-in">
      <Input
        type="text"
        value={intent}
        onChange={(e) => setIntent(e.target.value)}
        placeholder="e.g., Swap 1 ETH for USDC on the best DEX"
        disabled={isLoading}
        className="h-14 p-4 text-lg font-mono bg-space-800/80 border-glass-stroke backdrop-blur-sm focus:ring-2 focus:ring-cyber-cyan focus:ring-offset-0 focus:ring-offset-space-900 text-center placeholder:text-gray-600"
      />
      
      <Button 
        type="submit" 
        // Disable button if loading, not connected, or input is empty
        disabled={isLoading || !isConnected || !intent.trim()}
        className="font-display uppercase tracking-wider text-lg px-8 py-6 rounded-lg bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink text-space-900 font-bold shadow-lg shadow-cyber-purple/20 hover:shadow-xl hover:shadow-cyber-cyan/30 transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          'Processing...'
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            {buttonText}
          </>
        )}
      </Button>
    </form>
  );
}