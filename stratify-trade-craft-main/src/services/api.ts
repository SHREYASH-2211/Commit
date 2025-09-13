import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            'http://localhost:8000/api/v1/users/refresh-token',
            { refreshToken },
            { withCredentials: true }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('stratify-user');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
// TypeScript interfaces for strategy data
export interface StrategyCondition {
  indicator: string;
  operator: string;
  value: number | string;
  timeframe: string;
}

export interface StrategyAction {
  type: 'buy' | 'sell' | 'hold';
  quantity: 'all' | 'half' | 'custom';
  customQuantity?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface StrategyRule {
  id: string;
  name: string;
  type: 'entry' | 'exit';
  conditions: StrategyCondition[];
  action: StrategyAction;
  logicalOperator: 'AND' | 'OR';
  description?: string;
}

export interface RiskManagement {
  stopLoss?: number;
  takeProfit?: number;
  maxPositionSize?: number;
  maxDailyLoss?: number;
  maxDrawdown?: number;
}

export interface ExecutionSettings {
  timeframe: string;
  executionMode: 'live' | 'paper';
  slippage?: number;
  commission?: number;
}

export interface Strategy {
  _id: string;
  userId: string;
  name: string;
  description: string;
  category: string;
  rules: StrategyRule[];
  entryRules: StrategyRule[];
  exitRules: StrategyRule[];
  riskManagement: RiskManagement;
  executionSettings: ExecutionSettings;
  tags: string[];
  isActive: boolean;
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StrategyTemplate {
  _id: string;
  name: string;
  description: string;
  category: string;
  rules: StrategyRule[];
  riskManagement: RiskManagement;
  tags: string[];
}

export interface BuilderComponent {
  id: string;
  name: string;
  description: string;
  params?: string[];
  symbol?: string;
  color?: string;
}

export interface BuilderComponents {
  indicators: BuilderComponent[];
  operators: BuilderComponent[];
  actions: BuilderComponent[];
  quantities: BuilderComponent[];
  timeframes: BuilderComponent[];
  ruleTypes: BuilderComponent[];
}

export interface StrategyListResponse {
  strategies: Strategy[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export const authAPI = {
  // Register user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials: {
    email: string;
    password: string;
  }) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/users/logout');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/users/current-user');
    return response.data;
  },

  // Update user account details
  updateAccount: async (userData: {
    name: string;
    email: string;
  }) => {
    const response = await api.patch('/users/update-account', userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const response = await api.post('/users/change-password', passwordData);
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/users/refresh-token', { refreshToken });
    return response.data;
  },
};

// Backtest API interfaces
export interface BacktestParameters {
  shortMA?: number;
  longMA?: number;
  [key: string]: any;
}

export interface BacktestResult {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  trades: Array<{
    entryDate: string;
    entryPrice: number;
    exitDate: string;
    exitPrice: number;
    profitLoss: number;
  }>;
}

export interface Backtest {
  _id: string;
  user: string;
  ticker: string;
  strategyName: string;
  timeframe: string;
  parameters: BacktestParameters;
  results: BacktestResult;
  createdAt: string;
  updatedAt: string;
}

export interface BacktestListResponse {
  backtests: Backtest[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export const backtestAPI = {
  // Start new backtest
  startBacktest: async (backtestData: {
    ticker: string;
    strategyName: string;
    parameters?: BacktestParameters;
    timeframe?: string;
  }) => {
    const response = await api.post('/backtest/start', backtestData);
    return response.data;
  },

  // Get all user backtests
  getBacktests: async () => {
    const response = await api.get('/backtest');
    return response.data;
  },

  // Get backtest by ID
  getBacktestById: async (id: string) => {
    const response = await api.get(`/backtest/${id}`);
    return response.data;
  },
};

export const strategyAPI = {
  // Get all user strategies
  getUserStrategies: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
  }) => {
    const response = await api.get('/strategies', { params });
    return response.data;
  },

  // Get strategy templates
  getTemplates: async () => {
    const response = await api.get('/strategies/templates');
    return response.data;
  },

  // Seed strategy templates
  seedTemplates: async () => {
    const response = await api.post('/strategies/seed-templates');
    return response.data;
  },

  // Get builder components
  getBuilderComponents: async () => {
    const response = await api.get('/strategies/components');
    return response.data;
  },

  // Create new strategy
  createStrategy: async (strategyData: {
    name: string;
    description: string;
    category: string;
    rules?: StrategyRule[];
    entryRules?: StrategyRule[];
    exitRules?: StrategyRule[];
    riskManagement?: RiskManagement;
    executionSettings?: ExecutionSettings;
    tags?: string[];
  }) => {
    const response = await api.post('/strategies', strategyData);
    return response.data;
  },

  // Get single strategy
  getStrategy: async (id: string) => {
    const response = await api.get(`/strategies/${id}`);
    return response.data;
  },

  // Update strategy
  updateStrategy: async (id: string, strategyData: {
    name?: string;
    description?: string;
    category?: string;
    rules?: StrategyRule[];
    entryRules?: StrategyRule[];
    exitRules?: StrategyRule[];
    riskManagement?: RiskManagement;
    executionSettings?: ExecutionSettings;
    tags?: string[];
    isActive?: boolean;
  }) => {
    const response = await api.put(`/strategies/${id}`, strategyData);
    return response.data;
  },

  // Delete strategy
  deleteStrategy: async (id: string) => {
    const response = await api.delete(`/strategies/${id}`);
    return response.data;
  },

  // Clone strategy from template
  cloneFromTemplate: async (templateId: string, name?: string) => {
    const response = await api.post('/strategies/clone-template', {
      templateId,
      name
    });
    return response.data;
  },

  // Entry rule management
  addEntryRule: async (strategyId: string, rule: StrategyRule) => {
    const response = await api.post(`/strategies/${strategyId}/entry-rules`, { rule });
    return response.data;
  },

  updateEntryRule: async (strategyId: string, ruleId: string, rule: StrategyRule) => {
    const response = await api.put(`/strategies/${strategyId}/entry-rules/${ruleId}`, { rule });
    return response.data;
  },

  deleteEntryRule: async (strategyId: string, ruleId: string) => {
    const response = await api.delete(`/strategies/${strategyId}/entry-rules/${ruleId}`);
    return response.data;
  },

  // Exit rule management
  addExitRule: async (strategyId: string, rule: StrategyRule) => {
    const response = await api.post(`/strategies/${strategyId}/exit-rules`, { rule });
    return response.data;
  },

  updateExitRule: async (strategyId: string, ruleId: string, rule: StrategyRule) => {
    const response = await api.put(`/strategies/${strategyId}/exit-rules/${ruleId}`, { rule });
    return response.data;
  },

  deleteExitRule: async (strategyId: string, ruleId: string) => {
    const response = await api.delete(`/strategies/${strategyId}/exit-rules/${ruleId}`);
    return response.data;
  },
};

export default api;
