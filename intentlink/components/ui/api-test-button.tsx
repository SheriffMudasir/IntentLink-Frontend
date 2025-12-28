'use client';

import { useState } from 'react';
import { Button } from './button';
import { toast } from 'sonner';
import apiService from '@/lib/apiService';

/**
 * Development utility button for testing backend API connectivity.
 * Only visible in development mode.
 */
export function ApiTestButton() {
  const [testing, setTesting] = useState(false);

  const testBackendConnection = async () => {
    setTesting(true);
    
    try {
      const isHealthy = await apiService.healthCheck();
      
      if (!isHealthy) {
        toast.error('Backend is not responding');
        setTesting(false);
        return;
      }

      toast.success('Backend is responding!');

      const parseResult = await apiService.parseIntent({
        input: 'Stake 1000 BDAG in the safest farm',
        user_wallet: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
        chain_id: 1043
      });
      toast.success('Parse intent successful!');

      await apiService.getPlan({
        intent_id: parseResult.intent_id
      });
      toast.success('Plan endpoint successful!');

      toast.success('All API endpoints working correctly!');

    } catch {
      toast.error('API test failed');
    } finally {
      setTesting(false);
    }
  };

  return (
    <Button
      onClick={testBackendConnection}
      disabled={testing}
      variant="outline"
      size="sm"
      className="fixed bottom-4 left-4 z-50 bg-black/50 backdrop-blur-md border-primary/30 text-primary hover:bg-primary/10"
    >
      {testing ? 'Testing...' : 'Test API'}
    </Button>
  );
}
