import axios from 'axios';

// --- TypeScript Interfaces ---

// 1. Parse Intent
export interface ParseIntentRequest {
    input: string;        // e.g., "Stake 1000 BDAG in the safest farm"
    user_wallet: string;  // User's connected EVM address
    chain_id: number;     // 1043 (BlockDAG) or 80002 (Polygon Amoy)
}

export interface ParseIntentResponse {
    intent_id: string;    // UUID
    status: 'parsed' | 'clarify';
    intent: {
        intent_type: string;
        asset: string;
        amount: number;
        amount_unit: 'token' | 'usd';
        target: string;
    };
    clarify_questions: string[];
}

// 2. Plan
export interface PlanRequest {
    intent_id: string; // UUID from Parse response
}

export interface Candidate {
    address: string;      // Contract address
    apy: number;          // e.g., 0.12 for 12%
    tvl: number;          // Total Value Locked
    safety_score: number; // 0-100 (GoPlus Security Score)
    utility: number;      // Internal ranking score
    warnings: string[];   // List of security warnings (if any)
    protocol: 'staking' | 'lending';
}

export interface PlanResponse {
    plan_id: string;      // UUID
    candidates: Candidate[];
    chosen: Candidate;    // The recommended option (highest utility)
}

// 3. Submit
export interface SubmitIntentRequest {
    plan_id: string; // UUID from Plan response
}

export interface SubmitIntentResponse {
    execution_id: string; // UUID
    status: 'pending' | 'submitted' | 'confirmed' | 'failed';
}

// 4. Status
export interface ExecutionStatusResponse {
    execution_id: string;
    status: 'pending' | 'submitted' | 'confirmed' | 'failed';
    tx_hash: string | null; // Available when status is 'confirmed'
    logs: string[];
}

// --- API Service ---

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const apiService = {
    parseIntent: async (data: ParseIntentRequest): Promise<ParseIntentResponse> => {
        const response = await api.post<ParseIntentResponse>('/parse-intent/', data);
        return response.data;
    },

    getPlan: async (data: PlanRequest): Promise<PlanResponse> => {
        const response = await api.post<PlanResponse>('/plan/', data);
        return response.data;
    },

    submitIntent: async (data: SubmitIntentRequest): Promise<SubmitIntentResponse> => {
        const response = await api.post<SubmitIntentResponse>('/submit-intent/', data);
        return response.data;
    },

    getExecutionStatus: async (executionId: string): Promise<ExecutionStatusResponse> => {
        const response = await api.get<ExecutionStatusResponse>(`/execution/${executionId}/status/`);
        return response.data;
    },
};
