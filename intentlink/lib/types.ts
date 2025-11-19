// intentlink/lib/types.ts

// 1. Parse Intent
export interface ParseIntentRequest {
  input: string;
  user_wallet: string; // e.g., "0x..."
  chain_id: number; // e.g., 1043 for BlockDAG
}

export interface ParseIntentResponse {
  intent_id: string; // UUID
  status: "parsed";
  intent: Record<string, unknown>; // Keeping this flexible for now
}

// 2. Generate Secure Plan
export interface PlanRequest {
  intent_id: string;
}

export interface PlanResponse {
  plan_id: string; // UUID
  candidates: unknown[]; // Not used in Wave 2 demo flow, but good to have
  chosen: {
    address: string;
    apy: number;
    tvl: number;
    safety_score: number; // 0-100 from GoPlus
    utility: number;
    warnings: string[]; // e.g., ["Security provider is temporarily unavailable."]
    protocol: string;
  };
}

// 3. Submit Intent for Execution
export interface SubmitIntentRequest {
  plan_id: string;
}

export interface SubmitIntentResponse {
  execution_id: string; // UUID
  status: "queued";
}

// 4. Get Execution Status
export interface ExecutionStatusResponse {
  status: "pending" | "submitted" | "completed" | "failed";
  tx_hash: string | null; // e.g., "0x_simulated_tx_hash_for_wave_2_demo"
}