'use client';

import { useState } from 'react';
import { Button } from './button';
import { toast } from 'sonner';
import apiService from '@/lib/apiService';

export function ApiTestButton() {
  const [testing, setTesting] = useState(false);

  const testBackendConnection = async () => {
    setTesting(true);
    console.log('🧪 [Test] Starting backend connection test...');
    
    try {
      // Test health check
      console.log('🧪 [Test] Step 1: Testing health endpoint...');
      const isHealthy = await apiService.healthCheck();
      
      if (!isHealthy) {
        toast.error('Backend is not responding. Check console for details.');
        console.error('❌ [Test] Health check failed - backend may be down');
        setTesting(false);
        return;
      }

      toast.success('Backend is responding!');
      console.log('✅ [Test] Health check passed');

      // Test parse intent
      console.log('🧪 [Test] Step 2: Testing parse intent endpoint...');
      const parseResult = await apiService.parseIntent({
        input: 'Stake 1000 BDAG in the safest farm',
        user_wallet: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
        chain_id: 1043
      });
      console.log('✅ [Test] Parse intent successful:', parseResult);
      toast.success('Parse intent successful!');

      // Test plan endpoint
      console.log('🧪 [Test] Step 3: Testing plan endpoint...');
      const planResult = await apiService.getPlan({
        intent_id: parseResult.intent_id
      });
      console.log('✅ [Test] Plan endpoint successful:', planResult);
      toast.success('Plan endpoint successful!');

      console.log('🎉 [Test] All API tests passed!');
      toast.success('All API endpoints working correctly!');

    } catch (error) {
      console.error('❌ [Test] API test failed:', error);
      toast.error('API test failed. Check console for details.');
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
      {testing ? '🧪 Testing...' : '🔧 Test Backend API'}
    </Button>
  );
}
