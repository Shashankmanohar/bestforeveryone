// API Configuration
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5005').replace(/\/+$/, '');

// Token management
const getToken = () => localStorage.getItem('token');
const setToken = (token: string) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

import { useAuthStore } from '../store/useAuthStore';

// API client with auth headers
const apiClient = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        const { logout, logoutAdmin } = useAuthStore.getState();
        if (endpoint.startsWith('/admin')) {
            logoutAdmin();
        } else {
            logout();
        }
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        console.error('API Error Details:', {
            endpoint,
            status: response.status,
            statusText: response.statusText,
            error,
            requestBody: options.body
        });
        throw new Error(error.message || 'API request failed');
    }

    return response.json();
};

// Auth API
export const authApi = {
    signup: async (data: {
        fullname: string;
        username: string;
        phone: string;
        password: string;
        referralCode?: string;
    }) => {
        const response = await apiClient('/user/signup', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        setToken(response.token);
        return response;
    },

    login: async (username: string, password: string) => {
        const response = await apiClient('/user/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        setToken(response.token);
        return response;
    },

    logout: () => {
        removeToken();
    },

    getProfile: () => apiClient('/user/profile'),

    submitPayment: () => apiClient('/user/payment/submit', {
        method: 'POST'
    }),

    activateOther: (targetUsername: string) => apiClient('/user/activate-other', {
        method: 'POST',
        body: JSON.stringify({ targetUsername })
    }),
};

// Wallet API
export const walletApi = {
    getBalance: () => apiClient('/user/wallet'),
    getTransactions: () => apiClient('/user/transactions'),
    getBreakdown: () => apiClient('/user/wallet/breakdown'),
};

// Matrix API
export const matrixApi = {
    getStatus: () => apiClient('/user/matrix'),
    getTree: () => apiClient('/user/matrix/tree'),
};

// Referral API
export const referralApi = {
    getCode: () => apiClient('/user/referral/code'),
    getReferrals: () => apiClient('/user/referrals'),
    getWeeklyStats: () => apiClient('/user/referrals/weekly-stats'),
};

// Withdrawal API
export const withdrawalApi = {
    create: (amount: number, bankDetails: any, walletType: 'current' | 'matrix' = 'current') =>
        apiClient('/user/withdrawal/request', {
            method: 'POST',
            body: JSON.stringify({ amount, bankDetails, walletType }),
        }),
    getHistory: () => apiClient('/user/withdrawals'),
    getLimits: () => apiClient('/user/withdrawal/limits'),
};

// Bonanza API
export const bonanzaApi = {
    getWeekly: () => apiClient('/user/bonanza'),
    getLogs: () => apiClient('/user/bonanza/logs'),
};

// Leadership API
export const leadershipApi = {
    getRoyalty: () => apiClient('/user/leadership'),
    getLogs: () => apiClient('/user/leadership/logs'),
    getDownlineCount: () => apiClient('/user/downline/count'),
};

export { getToken, setToken, removeToken };
