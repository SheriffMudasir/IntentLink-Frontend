/**
 * IntentLink API Type Definitions
 */

/**
 * Request payload for parsing natural language intent
 */
export interface ParseIntentRequest {
  input: string;
  user_wallet: string;
  chain_id: number;
}

/**
 * Response from intent parsing endpoint
 */
export interface ParseIntentResponse {
  intent_id: string;
  status: "parsed" | "clarify";
  intent: Record<string, unknown>;
  clarify_questions?: string[];
}

/**
 * Candidate protocol contract for execution
 */
export interface Candidate {
  address: string;
  apy: number;
  tvl: number;
  safety_score: number;
  utility: number;
  warnings: string[];
  protocol: string;
}

/**
 * Request payload for generating execution plan
 */
export interface PlanRequest {
  intent_id: string;
}

/**
 * Response containing execution plan and candidates
 */
export interface PlanResponse {
  plan_id: string;
  candidates: Candidate[];
  chosen: Candidate;
}

/**
 * Request payload for submitting intent execution
 */
export interface SubmitIntentRequest {
  plan_id: string;
}

/**
 * Response from intent submission
 */
export interface SubmitIntentResponse {
  execution_id: string;
  status: "queued";
}

/**
 * Response containing execution status and transaction details
 */
export interface ExecutionStatusResponse {
  execution_id: string;
  status: "pending" | "submitted" | "confirmed" | "failed";
  tx_hash: string | null;
  logs: string[];
}