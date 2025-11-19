// intentlink/lib/apiService.ts 
import axios from 'axios';
import { 
  ParseIntentRequest, ParseIntentResponse,
  PlanRequest, PlanResponse,
  SubmitIntentRequest, SubmitIntentResponse,
  ExecutionStatusResponse
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000, // Increased timeout for potentially slow AI responses
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const apiService = {
  parseIntent: async (data: ParseIntentRequest): Promise<ParseIntentResponse> => {
    try {
      const response = await axiosInstance.post<ParseIntentResponse>('/parse-intent/', data);
      return response.data;
    } catch (error) {
      console.error(`API Error: POST /parse-intent/ ->`, error);
      throw error;
    }
  },

  getPlan: async (data: PlanRequest): Promise<PlanResponse> => {
    try {
      const response = await axiosInstance.post<PlanResponse>('/plan/', data);
      return response.data;
    } catch (error) {
      console.error(`API Error: POST /plan/ ->`, error);
      throw error;
    }
  },

  submitIntent: async (data: SubmitIntentRequest): Promise<SubmitIntentResponse> => {
    try {
      const response = await axiosInstance.post<SubmitIntentResponse>('/submit-intent/', data);
      return response.data;
    } catch (error) {
      console.error(`API Error: POST /submit-intent/ ->`, error);
      throw error;
    }
  },

  getExecutionStatus: async (executionId: string): Promise<ExecutionStatusResponse> => {
    try {
      const response = await axiosInstance.get<ExecutionStatusResponse>(`/execution/${executionId}/status/`);
      return response.data;
    } catch (error) {
      console.error(`API Error: GET /execution/${executionId}/status/ ->`, error);
      throw error;
    }
  },
};

export default apiService;