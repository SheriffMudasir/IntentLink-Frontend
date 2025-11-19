// app/page.tsx (REVISED)
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { IntentInput } from '@/components/ui/IntentInput';
import { ExecutionModal } from '@/components/ui/ExecutionModal';
import { SuccessDisplay } from '@/components/ui/SuccessDisplay';
import { PlanResponse } from '@/lib/types';
import { ChainSelector } from '@/components/ui/ChainSelector';

export type AppStatus =
  | 'idle'
  | 'parsing'
  | 'planning'
  | 'submitting'
  | 'polling'
  | 'success'
  | 'error';

export default function HomePage() {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [planDetails, setPlanDetails] = useState<PlanResponse['chosen'] | null>(null);
  const [finalTxHash, setFinalTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- handleExecute and resetState logic remains the same ---
  const handleExecute = async (intent: string) => {
    console.log('Simulating execution for intent:', intent);
    setError(null);

    try {
      setStatus('parsing');
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setStatus('planning');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const mockPlanDetails: PlanResponse['chosen'] = {
        address: '0x1b227DF9c8D34CaB880774737FBf426E66Ba98Ed',
        apy: 0.12,
        tvl: 500000.0,
        safety_score: 98,
        utility: 0.535,
        warnings: [],
        protocol: 'staking',
      };
      setPlanDetails(mockPlanDetails);

      setStatus('submitting');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.info('Intent submitted to the execution queue.');

      setStatus('polling');
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const mockTxHash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      setFinalTxHash(mockTxHash);
      setStatus('success');
      toast.success('Transaction Confirmed!', {
        description: 'Your intent was successfully executed on-chain.',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error during demo execution';
      setError(message);
      setStatus('error');
      toast.error('Execution failed: ' + message);
    }
  };

  const resetState = () => {
    setStatus('idle');
    setPlanDetails(null);
    setFinalTxHash(null);
    setError(null);
  };

  return (
    // Main container uses flexbox to center the content vertically
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 relative">
      <ChainSelector />

      {/* Glassmorphism Card as the main content wrapper */}
      <div className="w-full max-w-3xl p-8 md:p-12 backdrop-blur-md bg-space-800/60 border border-glass-stroke rounded-2xl shadow-2xl shadow-cyber-purple/10">
        <header className="text-center mb-10">
          {/* CORRECTED GRADIENT CLASS */}
          <h1 className="text-5xl md:text-6xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink">
            IntentLink
          </h1>
          <p className="text-lg text-gray-400 mt-3 font-body">
            Tell your wallet what you want. We handle the rest.
          </p>
        </header>

        {/* Conditional Rendering based on state */}
        <div className="min-h-[150px] flex items-center justify-center">
          {status === 'success' ? (
            <SuccessDisplay txHash={finalTxHash} onReset={resetState} />
          ) : (
            <IntentInput onExecute={handleExecute} isLoading={status !== 'idle'} />
          )}
        </div>
      </div>

      <ExecutionModal
        isOpen={status !== 'idle' && status !== 'success'}
        status={status}
        planDetails={planDetails}
        error={error}
      />
    </div>
  );
}