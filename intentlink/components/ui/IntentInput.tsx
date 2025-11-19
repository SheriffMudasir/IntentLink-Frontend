// components/ui/IntentInput.tsx (REVISED)
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface IntentInputProps {
  onExecute: (intent: string) => void;
  isLoading: boolean;
}

export function IntentInput({ onExecute, isLoading }: IntentInputProps) {
  const [intent, setIntent] = useState('Stake my 100 test-BDAG in the safest farm.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (intent.trim()) {
      onExecute(intent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col items-center gap-6 animate-fade-in">
      <Input
        type="text"
        value={intent}
        onChange={(e) => setIntent(e.target.value)}
        placeholder="e.g., Swap 1 ETH for USDC on the best DEX"
        className="h-14 p-4 text-lg font-mono bg-space-800/80 border-glass-stroke backdrop-blur-sm focus:ring-2 focus:ring-cyber-cyan focus:ring-offset-0 focus:ring-offset-space-900 text-center"
      />
      <Button 
        type="submit" 
        disabled={isLoading || !intent.trim()}
        /* CORRECTED GRADIENT CLASS AND ADDED GLOW EFFECT */
        className="font-display uppercase tracking-wider text-lg px-8 py-6 rounded-lg bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink text-space-900 font-bold shadow-lg shadow-cyber-purple/20 hover:shadow-xl hover:shadow-cyber-cyan/30 transition-shadow duration-300"
      >
        {isLoading ? (
          'Processing...'
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Execute Intent
          </>
        )}
      </Button>
    </form>
  );
}