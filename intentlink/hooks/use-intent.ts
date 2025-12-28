import { useState } from 'react';
import { ethers } from 'ethers';
import apiService from '@/lib/apiService';
import { Candidate, ProjectionData, ParsedIntent } from '@/lib/types';
import { toast } from 'sonner';
import { CONTRACTS } from '@/config/contracts';

export type IntentStatus = 'idle' | 'parsing' | 'planning' | 'review' | 'executing' | 'success' | 'error';

/**
 * Enhanced plan data with earnings projections
 */
export interface EnhancedPlanData {
    estimatedApy: string;
    projectedEarnings: ProjectionData[];
    inputAmount: string;
    inputAmountUsd: string;
    summary: string;
}

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
    const [originalWallet, setOriginalWallet] = useState<string | null>(null);
    const [parsedIntent, setParsedIntent] = useState<ParsedIntent | null>(null);
    const [enhancedPlan, setEnhancedPlan] = useState<EnhancedPlanData | null>(null);
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [isApproving, setIsApproving] = useState<boolean>(false);

    /**
     * ERC20 ABI Subset for Approval
     */
    const ERC20_ABI = [
        "function allowance(address owner, address spender) view returns (uint256)",
        "function approve(address spender, uint256 amount) returns (bool)"
    ];

    /**
     * Checks if the user has sufficient allowance for the token
     */
    const checkAllowance = async (
        tokenAddress: string,
        spenderAddress: string,
        amount: string,
        userAddress: string
    ) => {
        if (!window.ethereum) return;
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

            // Assuming 18 decimals for simplicity in this demo
            const requiredAmount = ethers.parseUnits(amount, 18);
            const allowance = await tokenContract.allowance(userAddress, spenderAddress);

            const hasAllowance = allowance >= requiredAmount;
            setIsApproved(hasAllowance);
            return hasAllowance;
        } catch {
            return false;
        }
    };

    /**
     * Approves the spender to spend tokens
     */
    const approveToken = async (tokenAddress: string, spenderAddress: string) => {
        if (!window.ethereum) return;
        try {
            setIsApproving(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

            const tx = await tokenContract.approve(spenderAddress, ethers.MaxUint256);

            toast.info("Approving Token...", {
                description: "Transaction sent. Waiting for confirmation..."
            });

            await tx.wait();

            setIsApproved(true);
            toast.success("Token Approved!", {
                description: "You can now proceed with the execution."
            });
        } catch {
            toast.error("Approval Failed", {
                description: "Please try again."
            });
        } finally {
            setIsApproving(false);
        }
    };

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
            setOriginalWallet(userWallet);

            const parseRes = await apiService.parseIntent({
                input,
                user_wallet: userWallet,
                chain_id: chainId
            });

            if (parseRes.status === 'clarify') {
                toast.info("Please clarify your intent.", {
                    description: parseRes.clarify_questions?.join(', ') || "Could you provide more details?"
                });
                setStatus('idle');
                return;
            }

            setIntentId(parseRes.intent_id);
            setParsedIntent(parseRes.intent);
            setStatus('planning');

            try {
                const enhancedRes = await apiService.getEnhancedPlan(parseRes.intent_id);

                setPlanId(enhancedRes.plan_id);
                setChosenCandidate(enhancedRes.chosen);
                setEnhancedPlan({
                    estimatedApy: enhancedRes.estimated_apy,
                    projectedEarnings: enhancedRes.projected_earnings,
                    inputAmount: enhancedRes.input_amount,
                    inputAmountUsd: enhancedRes.input_amount_usd,
                    summary: enhancedRes.summary
                });
            } catch {
                const planRes = await apiService.getPlan({ intent_id: parseRes.intent_id });

                setPlanId(planRes.plan_id);
                setChosenCandidate(planRes.chosen);
            }

            setStatus('review');

        } catch {
            setStatus('error');
            toast.error("Connection Failed", {
                description: "Could not connect to the intent engine. Please try again later."
            });
        }
    };

    /**
     * Confirms and executes the chosen plan on-chain with EIP-712 signature
     * @param {number} userChainId - Current wallet chain ID for validation
     * @param {string} currentWallet - Current connected wallet address for validation
     */
    const confirmExecution = async (userChainId: number, currentWallet: string) => {
        if (!planId) {
            toast.error("No plan ID found");
            return;
        }

        try {
            setStatus('executing');

            // Validate wallet address hasn't changed
            if (originalWallet && currentWallet.toLowerCase() !== originalWallet.toLowerCase()) {
                setStatus('error');
                toast.error("Wallet address changed!", {
                    description: `Please switch back to ${originalWallet.substring(0, 6)}...${originalWallet.substring(originalWallet.length - 4)} or restart the flow`,
                    duration: 8000
                });
                return;
            }

            // Prepare signature data
            toast.info("Preparing signature request...", {
                description: "Fetching execution parameters..."
            });
            const prepData = await apiService.prepareSignature(planId);

            // Validate chain ID matches
            const backendChainId = Number(prepData.typed_data.domain.chainId);
            const walletChainId = Number(userChainId);

            if (backendChainId !== walletChainId) {
                setStatus('error');
                const chainName = backendChainId === 1043 ? 'BlockDAG Awakening Testnet' : 'Polygon Amoy';
                toast.error("Wrong Network!", {
                    description: `Please switch to ${chainName} (Chain ID: ${backendChainId})`,
                    duration: 8000
                });
                return;
            }

            // Get signer from wallet
            if (!window.ethereum) {
                setStatus('error');
                toast.error("Wallet not found", {
                    description: "Please install MetaMask or another Web3 wallet",
                    duration: 5000
                });
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // Use frontend config for verifyingContract (V2 address)
            const chainContracts = CONTRACTS[walletChainId];
            if (!chainContracts) {
                setStatus('error');
                toast.error("Unsupported Chain", {
                    description: `Chain ID ${walletChainId} is not configured`,
                    duration: 5000
                });
                return;
            }

            const correctVerifyingContract = chainContracts.IntentWallet;

            const domain = {
                name: String(prepData.typed_data.domain.name),
                version: String(prepData.typed_data.domain.version),
                chainId: Number(prepData.typed_data.domain.chainId),
                verifyingContract: correctVerifyingContract
            };

            const message = {
                planId: String(prepData.typed_data.message.planId),
                planHash: String(prepData.typed_data.message.planHash),
                nonce: Number(prepData.typed_data.message.nonce),
                expiry: Number(prepData.typed_data.message.expiry)
            };

            toast.info("Signature Required", {
                description: "Please review and sign the transaction in your wallet",
                duration: 30000
            });

            // Remove EIP712Domain from types (ethers handles it)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { EIP712Domain, ...cleanTypes } = prepData.typed_data.types;

            const signature = await signer.signTypedData(
                domain,
                cleanTypes,
                message
            );

            toast.success("Signature Verified!", {
                description: "Submitting transaction to blockchain..."
            });
            const submitRes = await apiService.submitIntent({
                plan_id: planId,
                signature: signature,
                nonce: prepData.nonce,
                expiry: prepData.expiry
            });

            const executionId = submitRes.execution_id;

            toast.info("Transaction Submitted", {
                description: "Waiting for blockchain confirmation...",
                duration: 5000
            });

            // Poll for confirmation
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
                        toast.success("Transaction Confirmed!", {
                            description: `Your intent has been executed successfully on-chain`,
                            action: {
                                label: "View on Explorer",
                                onClick: () => window.open(explorerUrl, '_blank')
                            },
                            duration: 15000
                        });
                    } else if (statusRes.status === 'failed') {
                        clearInterval(pollInterval);
                        setStatus('error');
                        toast.error("Transaction Failed", {
                            description: "The on-chain execution failed. Please check the logs and try again.",
                            duration: 8000
                        });
                    } else if (pollCount > 60) {
                        clearInterval(pollInterval);
                        setStatus('error');
                        toast.error("Execution Timeout", {
                            description: "Transaction is taking longer than expected. Check status manually.",
                            duration: 8000
                        });
                    }
                } catch {
                    if (pollCount > 60) {
                        clearInterval(pollInterval);
                        setStatus('error');
                    }
                }
            }, 2000);

        } catch (error: unknown) {
            setStatus('error');

            const err = error as { code?: string; message?: string; response?: { status?: number; data?: { detail?: string } } };

            if (err.code === 'ACTION_REJECTED' || err.code === '4001') {
                toast.error("Signature Rejected", {
                    description: "You cancelled the signature request. No funds were moved.",
                    duration: 5000
                });
            } else if (err.response?.status === 401) {
                toast.error("Signature Verification Failed", {
                    description: err.response.data?.detail || "The signature could not be verified. Please ensure you're using the correct wallet and network.",
                    duration: 8000
                });
            } else if (err.response?.status === 400) {
                toast.error("Invalid Request", {
                    description: err.response.data?.detail || "The request could not be processed. Please try again.",
                    duration: 6000
                });
            } else {
                let userMessage = "An unexpected error occurred. Please try again.";

                if (err.message && err.message.length < 100) {
                    // Only show short messages that might be readable
                    userMessage = err.message;
                } else if (err.message?.includes('user rejected')) {
                    userMessage = "Transaction rejected by user.";
                } else if (err.message?.includes('Internal JSON-RPC error')) {
                    userMessage = "Blockchain network error. Please try again later.";
                }

                toast.error("Execution Failed", {
                    description: userMessage,
                    duration: 6000
                });
            }
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
        setOriginalWallet(null);
        setParsedIntent(null);
        setEnhancedPlan(null);
    };

    return {
        status,
        chosenCandidate,
        txHash,
        logs,
        parsedIntent,
        enhancedPlan,
        isApproved,
        isApproving,
        processIntent,
        confirmExecution,
        checkAllowance,
        approveToken,
        reset
    };
}
