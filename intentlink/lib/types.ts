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
 * Parsed intent structure from AI (Gemini 3 Pro)
 */
export interface ParsedIntent {
  intent_type: "stake" | "unstake" | "swap" | "lend" | "claim_rewards" | "transfer" | "compound";
  asset: string;           // "BDAG"
  amount: number;          // 1000 or -1 for "all"
  amount_unit: string;     // "token"
  to_asset?: string;       // For swaps: "USDT"
  target?: string;         // "best_yield", "safest", "balanced"
}

/**
 * Response from intent parsing endpoint
 */
export interface ParseIntentResponse {
  intent_id: string;
  status: "parsed" | "clarify";
  intent: ParsedIntent | null;
  clarify_questions: string[];
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
 * Response from prepare-signature endpoint containing EIP-712 typed data
 */
export interface PrepareSignatureResponse {
  typed_data: {
    domain: {
      name: string;
      version: string;
      chainId: number;
      verifyingContract: `0x${string}`;
    };
    types: Record<string, Array<{ name: string; type: string }>>;
    primaryType: string;
    message: {
      planId: string;
      planHash: string;
      nonce: number;
      expiry: number;
    };
  };
  plan_hash: string;
  nonce: number;
  expiry: number;
}

/**
 * Request payload for submitting intent execution
 */
export interface SubmitIntentRequest {
  plan_id: string;
  signature: string;
  nonce: number;
  expiry: number;
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

// ============================================================================
// V2 API Types
// ============================================================================

/**
 * V2 Portfolio aggregated data from IntentWalletV2.getPortfolio() - single RPC call
 */
export interface PortfolioV2Data {
  wallet_balance: string;      // USDT balance
  staked_balance: string;      // Staked amount
  pending_rewards: string;     // Unclaimed rewards
  current_apy: string;         // APY percentage (e.g., "12.0")
  eth_balance: string;         // Native token balance (BDAG)
}

/**
 * Token balance in portfolio
 */
export interface TokenBalance {
  symbol: string;           // "BDAG", "USDT", "POL"
  name: string;             // "BDAG (Native)", "Mock USDT"
  balance: string;          // "49.591039521067486535"
  balance_usd: string;      // "$2.48"
  contract_address: string; // Token contract address
  decimals: number;         // 18
  icon: string;             // "⛽", "💵", "🟣"
}

/**
 * Individual staking position
 */
export interface StakingPosition {
  protocol_address: string;
  protocol_name: string;
  staked_amount: string;
  staked_amount_usd?: string;
  pending_rewards: string;
  pending_rewards_usd?: string;
  apy: string;
  staked_at?: number;
  unlock_time?: number;  // Unix timestamp for locked positions
}

/**
 * Complete portfolio response from V2 API
 */
export interface PortfolioResponse {
  wallet_address: string;
  chain_id: number;
  chain_name: string;
  native_balance: string;
  native_balance_usd?: string;
  native_symbol?: string;
  token_balances?: TokenBalance[];
  staking_positions: StakingPosition[];
  lending_positions: unknown[];
  total_staked_value: string;
  total_staked_value_usd?: string;
  total_lending_value: string;
  total_lending_value_usd?: string;
  total_pending_rewards: string;
  total_pending_rewards_usd?: string;
  total_portfolio_value_usd: string;
  usdt_balance: string;
  v2_aggregated?: PortfolioV2Data;  // Present when V2 contract is used
}

/**
 * Quick action button configuration
 */
export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  intent_template: string;
  category: string;
  estimated_apy?: string;
  risk_level: string;
}

/**
 * Response from quick-actions endpoint
 */
export interface QuickActionsResponse {
  actions: QuickAction[];
  featured_action: string;
}

/**
 * Token price data
 */
export interface PriceData {
  symbol: string;
  price_usd: string;
  change_24h: string;
}

/**
 * Response from prices endpoint
 */
export interface PricesResponse {
  prices: PriceData[];
  last_updated: string;
}

/**
 * Individual security check result
 */
export interface SecurityCheck {
  name: string;
  status: 'passed' | 'warning' | 'failed';
  details: string;
}

/**
 * Response from security-report endpoint
 */
export interface SecurityReportResponse {
  overall_risk: 'low' | 'medium' | 'high';
  risk_score: number;
  checks: SecurityCheck[];
  recommendations: string[];
}

/**
 * Plan step for execution
 */
export interface PlanStep {
  type: "approve" | "stake" | "unstake" | "swap" | "lend" | "compound";
  action?: string;  // Legacy field
  protocol?: string;  // Legacy field
  amount?: string | number;
  token?: string;
  asset?: string;  // Asset symbol
  contract?: string;  // Contract address
  spender?: string;  // For approve steps
  lockType?: number;  // 0=Flexible, 1=7days, 2=30days (for stake steps)
}

/**
 * Projection data for earnings estimates
 */
export interface ProjectionData {
  period: string;       // "daily", "weekly", "monthly", "yearly"
  amount: string;       // "0.3288 BDAG"
  amount_usd: string;   // "$0.02"
}

/**
 * Enhanced plan response with return projections
 */
export interface EnhancedPlanResponse {
  plan_id: string;
  candidates: Candidate[];
  chosen: Candidate;
  estimated_apy: string;           // "12.0%"
  projected_earnings: ProjectionData[];
  input_amount: string;            // "1,000 BDAG"
  input_amount_usd: string;        // "$50.00"
  summary: string;                 // "Stake 1,000 BDAG at 12% APY → Earn $6.00/month"
}

// ============================================================================
// V2 Chain Types
// ============================================================================

/**
 * Chain information from /v2/chains/ endpoint
 */
export interface ChainInfo {
  chain_id: number;
  name: string;
  currency: string;
  features: string[];
}

/**
 * Response from /v2/chains/ endpoint
 */
export interface ChainsResponse {
  chains: ChainInfo[];
}

/**
 * Relayer status response
 */
export interface RelayerStatusResponse {
  chain_id: number;
  relayer_address: string;
  balance: string;
  balance_usd: string;
  status: 'healthy' | 'low_balance' | 'offline';
  estimated_gas_price: string;
}