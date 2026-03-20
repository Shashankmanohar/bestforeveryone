// API Configuration
const API_BASE_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5005' : '')).replace(/\/+$/, '');

if (!API_BASE_URL && import.meta.env.PROD) {
    console.error('CRITICAL: VITE_API_URL is not defined in production environment!');
}

// Token management
const getToken = () => localStorage.getItem('token');
const setToken = (token: string) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

import { useAuthStore } from '../store/useAuthStore';

// API client with auth headers
const apiClient = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();

    const headers: HeadersInit = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    // Only set Content-Type if it's not already set and the body is not FormData
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    // If it is FormData, the browser will automatically set the Content-Type with the boundary
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

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
        email: string;
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

    submitKyc: (formData: FormData) => apiClient('/user/kyc/submit', {
        method: 'POST',
        body: formData,
    }),

    changePassword: (data: any) => apiClient('/user/profile/change-password', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
};

// Admin API
export const adminApi = {
    getDashboard: () => apiClient('/admin/metrics'),
    getUsers: (params?: any) => {
        const query = new URLSearchParams(params).toString();
        return apiClient(`/admin/users?${query}`);
    },
    getPendingKyc: () => apiClient('/admin/kyc/pending'),
    approveKyc: (userId: string) => apiClient(`/admin/kyc/approve/${userId}`, {
        method: 'PUT'
    }),
    rejectKyc: (userId: string, reason: string) => apiClient(`/admin/kyc/reject/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ reason })
    }),
    distributeRoyalty: () => apiClient('/admin/distribute-royalty', { method: 'POST' }),
    // ... other admin methods if needed
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
    getTree: (cycle?: number) => apiClient(`/user/matrix/tree${cycle ? `?cycle=${cycle}` : ''}`),
    getHistory: () => apiClient('/user/matrix/history'),
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

// E-pin API
export const epinApi = {
    buy: (amount: number = 1357) =>
        apiClient('/user/epin/buy', {
            method: 'POST',
            body: JSON.stringify({ amount }),
        }),
    getMyEpins: () => apiClient('/user/epin/my-pins'),
    use: (pin: string, targetUsername: string) =>
        apiClient('/user/epin/use', {
            method: 'POST',
            body: JSON.stringify({ pin, targetUsername }),
        }),
};

export { getToken, setToken, removeToken };
