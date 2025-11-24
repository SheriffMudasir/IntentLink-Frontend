import axios from 'axios';
import { 
  ParseIntentRequest, ParseIntentResponse,
  PlanRequest, PlanResponse,
  SubmitIntentRequest, SubmitIntentResponse,
  ExecutionStatusResponse
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001/api/v1';

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
    } catch (error) {
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
   * Submits an intent for on-chain execution
   * @param {SubmitIntentRequest} data - Submit request with plan ID
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
};

export default apiService;