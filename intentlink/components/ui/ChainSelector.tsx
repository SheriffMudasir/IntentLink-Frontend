// components/ui/ChainSelector.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Chain = 'BlockDAG' | 'Polygon';

export function ChainSelector() {
  const [activeChain, setActiveChain] = useState<Chain>('BlockDAG');

  return (
    <div className="absolute top-6 right-6 p-1 bg-space-900/80 border border-glass-stroke rounded-lg flex items-center gap-1">
      <Button
        onClick={() => setActiveChain('BlockDAG')}
        variant="ghost"
        className={`px-4 py-1 h-auto font-display ${activeChain === 'BlockDAG' ? 'bg-cyber-purple/50 text-white' : 'text-gray-400'}`}
      >
        BlockDAG
      </Button>
      <Button
        onClick={() => setActiveChain('Polygon')}
        variant="ghost"
        className={`px-4 py-1 h-auto font-display ${activeChain === 'Polygon' ? 'bg-cyber-purple/50 text-white' : 'text-gray-400'}`}
      >
        Polygon
      </Button>
    </div>
  );
}