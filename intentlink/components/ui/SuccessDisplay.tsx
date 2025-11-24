'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2, ExternalLink } from 'lucide-react';

interface SuccessDisplayProps {
  txHash: string | null;
  onReset: () => void;
}

const BLOCKDAG_EXPLORER_URL = 'https://awakening.bdagscan.com/tx/';

/**
 * Success display component for completed intent executions
 * @param {SuccessDisplayProps} props - Component props
 */
export function SuccessDisplay({ txHash, onReset }: SuccessDisplayProps) {
  const explorerLink = txHash ? `${BLOCKDAG_EXPLORER_URL}${txHash}` : '#';

  return (
    <div className="w-full flex flex-col items-center gap-6 text-center animate-fade-in">
      <div className="flex items-center gap-4">
        <CheckCircle2 className="h-10 w-10 text-defi-success" />
        <h2 className="text-3xl font-display font-bold text-white">Execution Complete</h2>
      </div>
      
      <p className="text-gray-400">
        Your intent has been successfully executed and recorded on-chain.
      </p>

      {txHash && (
        <a
          href={explorerLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-4 bg-space-900/50 border border-glass-stroke rounded-lg flex items-center justify-between hover:border-cyber-cyan transition-colors"
        >
          <span className="font-mono text-sm truncate text-gray-300">{txHash}</span>
          <ExternalLink className="h-5 w-5 text-cyber-cyan shrink-0 ml-4" />
        </a>
      )}

      <Button
        onClick={onReset}
        variant="secondary"
        className="mt-4 font-display uppercase tracking-wider text-lg px-8 py-4 rounded-lg text-white font-bold"
      >
        Execute Another Intent
      </Button>
    </div>
  );
}