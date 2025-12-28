import axios from 'axios';
import { 
  ParseIntentRequest, ParseIntentResponse,
  PlanRequest, PlanResponse,
  PrepareSignatureResponse,
  SubmitIntentRequest, SubmitIntentResponse,
  ExecutionStatusResponse,
  // V2 Types
  PortfolioResponse,
  QuickActionsResponse,
  PricesResponse,
  SecurityReportResponse,
  EnhancedPlanResponse,
  ChainsResponse,
  RelayerStatusResponse
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001/api/v1';
const API_V2_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '/v2') || 'http://127.0.0.1:8001/api/v2';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * API service for IntentLink backend communication
 */
const apiService = {
  /**
   * Checks if the backend API is healthy
   * @returns {Promise<boolean>} True if backend is responsive
   */
  healthCheck: async (): Promise<boolean> => {
    try {
      await axiosInstance.get('/health/', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Parses a natural language intent into structured data
   * @param {ParseIntentRequest} data - Intent parsing request
   * @returns {Promise<ParseIntentResponse>} Parsed intent response
   */
  parseIntent: async (data: ParseIntentRequest): Promise<ParseIntentResponse> => {
    const response = await axiosInstance.post<ParseIntentResponse>('/parse-intent/', data);
    return response.data;
  },

  /**
   * Generates an execution plan with security validation
   * @param {PlanRequest} data - Plan request with intent ID
   * @returns {Promise<PlanResponse>} Execution plan with candidates
   */
  getPlan: async (data: PlanRequest): Promise<PlanResponse> => {
    const response = await axiosInstance.post<PlanResponse>('/plan/', data);
    return response.data;
  },

  /**
   * Prepares EIP-712 typed data for signature generation
   * @param {string} planId - Plan UUID
   * @returns {Promise<PrepareSignatureResponse>} EIP-712 typed data for signing
   */
  prepareSignature: async (planId: string): Promise<PrepareSignatureResponse> => {
    const response = await axiosInstance.post<PrepareSignatureResponse>('/prepare-signature/', {
      plan_id: planId
    });
    return response.data;
  },

  /**
   * Submits an intent for on-chain execution with EIP-712 signature
   * @param {SubmitIntentRequest} data - Submit request with plan ID, signature, nonce, and expiry
   * @returns {Promise<SubmitIntentResponse>} Execution tracking response
   */
  submitIntent: async (data: SubmitIntentRequest): Promise<SubmitIntentResponse> => {
    const response = await axiosInstance.post<SubmitIntentResponse>('/submit-intent/', data);
    return response.data;
  },

  /**
   * Gets the current status of an execution
   * @param {string} executionId - Execution UUID
   * @returns {Promise<ExecutionStatusResponse>} Current execution status
   */
  getExecutionStatus: async (executionId: string): Promise<ExecutionStatusResponse> => {
    const response = await axiosInstance.get<ExecutionStatusResponse>(`/execution/${executionId}/status/`);
    return response.data;
  },

  // ============================================================================
  // V2 API Methods
  // ============================================================================

  /**
   * V2: Fetches portfolio dashboard data (uses IntentWalletV2.getPortfolio() - single RPC call)
   * @param {number} chainId - Blockchain chain ID
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<PortfolioResponse>} Portfolio data with balances and positions
   */
  getPortfolio: async (chainId: number, walletAddress: string): Promise<PortfolioResponse> => {
    const response = await axios.get<PortfolioResponse>(
      `${API_V2_BASE_URL}/portfolio/${chainId}/${walletAddress}/`,
      { timeout: 15_000 }
    );
    return response.data;
  },

  /**
   * V2: Fetches dynamic quick actions for the chain
   * @param {number} chainId - Blockchain chain ID
   * @returns {Promise<QuickActionsResponse>} Available quick actions
   */
  getQuickActions: async (chainId: number): Promise<QuickActionsResponse> => {
    const response = await axios.get<QuickActionsResponse>(
      `${API_V2_BASE_URL}/quick-actions/${chainId}/`,
      { timeout: 10_000 }
    );
    return response.data;
  },

  /**
   * V2: Fetches live token prices
   * @returns {Promise<PricesResponse>} Current token prices in USD
   */
  getPrices: async (): Promise<PricesResponse> => {
    const response = await axios.get<PricesResponse>(
      `${API_V2_BASE_URL}/prices/`,
      { timeout: 10_000 }
    );
    return response.data;
  },

  /**
   * V2: Fetches security report for contracts
   * @param {number} chainId - Blockchain chain ID
   * @param {string[]} targets - Contract addresses to scan
   * @param {string} intent - Intent description for context
   * @returns {Promise<SecurityReportResponse>} Security scan results
   */
  getSecurityReport: async (
    chainId: number,
    targets: string[],
    intent: string
  ): Promise<SecurityReportResponse> => {
    const response = await axios.post<SecurityReportResponse>(
      `${API_V2_BASE_URL}/security-report/`,
      { chain_id: chainId, targets, intent },
      { timeout: 20_000 }
    );
    return response.data;
  },

  /**
   * V2: Gets enhanced plan with return projections
   * @param {string} intentId - Intent ID from parse step
   * @returns {Promise<EnhancedPlanResponse>} Plan with estimated returns and projections
   */
  getEnhancedPlan: async (intentId: string): Promise<EnhancedPlanResponse> => {
    const response = await axios.post<EnhancedPlanResponse>(
      `${API_BASE_URL}/plan-enhanced/`,
      { intent_id: intentId },
      { timeout: 20_000 }
    );
    return response.data;
  },

  /**
   * V2: Fetches supported chains list
   * @returns {Promise<ChainsResponse>} List of supported chains with metadata
   */
  getChains: async (): Promise<ChainsResponse> => {
    const response = await axios.get<ChainsResponse>(
      `${API_V2_BASE_URL}/chains/`,
      { timeout: 10_000 }
    );
    return response.data;
  },

  /**
   * V2: Fetches relayer status for a chain
   * @param {number} chainId - Blockchain chain ID
   * @returns {Promise<RelayerStatusResponse>} Relayer health and balance info
   */
  getRelayerStatus: async (chainId: number): Promise<RelayerStatusResponse> => {
    const response = await axios.get<RelayerStatusResponse>(
      `${API_V2_BASE_URL}/relayer-status/${chainId}/`,
      { timeout: 10_000 }
    );
    return response.data;
  },
};

export default apiService;