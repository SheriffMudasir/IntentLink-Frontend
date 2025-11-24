import { useState } from 'react';
import apiService from '@/lib/apiService';
import { Candidate } from '@/lib/types';
import { toast } from 'sonner';

export type IntentStatus = 'idle' | 'parsing' | 'planning' | 'review' | 'executing' | 'success' | 'error';

/**
 * Custom hook for managing DeFi intent processing workflow
 * @returns {Object} Intent state and control methods
 */
export function useIntent() {
    const [status, setStatus] = useState<IntentStatus>('idle');
    const [intentId, setIntentId] = useState<string | null>(null);
    const [planId, setPlanId] = useState<string | null>(null);
    const [chosenCandidate, setChosenCandidate] = useState<Candidate | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);

    /**
     * Processes a natural language intent through parsing and planning
     * @param {string} input - Natural language intent description
     * @param {string} userWallet - User's wallet address
     * @param {number} chainId - Blockchain chain ID
     */
    const processIntent = async (
        input: string, 
        userWallet: string = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B", 
        chainId: number = 1043
    ) => {
        try {
            setStatus('parsing');

            const parseRes = await apiService.parseIntent({
                input,
                user_wallet: userWallet,
                chain_id: chainId
            });

            if (parseRes.status === 'clarify') {
                toast.info("Please clarify your intent.");
                setStatus('idle');
                return;
            }

            setIntentId(parseRes.intent_id);
            setStatus('planning');

            const planRes = await apiService.getPlan({ intent_id: parseRes.intent_id });
            
            setPlanId(planRes.plan_id);
            setChosenCandidate(planRes.chosen);
            setStatus('review');

        } catch (error) {
            setStatus('error');
            toast.error("Failed to process intent. Is the backend running?");
        }
    };

    /**
     * Confirms and executes the chosen plan on-chain
     */
    const confirmExecution = async () => {
        if (!planId) {
            return;
        }

        try {
            setStatus('executing');

            const submitRes = await apiService.submitIntent({ plan_id: planId });
            const executionId = submitRes.execution_id;

            let pollCount = 0;
            const pollInterval = setInterval(async () => {
                pollCount++;
                
                try {
                    const statusRes = await apiService.getExecutionStatus(executionId);

                    if (statusRes.status === 'confirmed') {
                        clearInterval(pollInterval);
                        setTxHash(statusRes.tx_hash);
                        setLogs(statusRes.logs);
                        setStatus('success');
                        
                        const explorerUrl = `https://awakening.bdagscan.com/tx/${statusRes.tx_hash}`;
                        toast.success("Intent executed successfully!", {
                            description: "Click to view transaction on block explorer",
                            action: {
                                label: "View Transaction",
                                onClick: () => window.open(explorerUrl, '_blank')
                            },
                            duration: 10000
                        });
                    } else if (statusRes.status === 'failed') {
                        clearInterval(pollInterval);
                        setStatus('error');
                        toast.error("Execution failed on-chain.");
                    }
                } catch (e) {
                    // Continue polling on error
                }
            }, 2000);

        } catch (error) {
            setStatus('error');
            toast.error("Failed to submit execution.");
        }
    };

    /**
     * Resets the intent workflow to initial state
     */
    const reset = () => {
        setStatus('idle');
        setIntentId(null);
        setPlanId(null);
        setChosenCandidate(null);
        setTxHash(null);
        setLogs([]);
    };

    return {
        status,
        chosenCandidate,
        txHash,
        logs,
        processIntent,
        confirmExecution,
        reset
    };
}
