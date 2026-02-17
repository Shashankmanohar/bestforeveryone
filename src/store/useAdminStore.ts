import { create } from 'zustand';
import adminApi from '../lib/adminApi';

interface DashboardMetrics {
    totalRevenue: number;
    totalJoiningFees: number;
    totalAdminFees: number;
    totalUserEarnings: number;
    activeUsers: number;
    totalUsers: number;
    blockedUsers: number;
    pendingWithdrawals: number;
    pendingWithdrawalAmount: number;
    matrixCycles: number;
    userWalletHoldings: number;
    reserveFund: number;
    pendingPayments: number;
}

interface User {
    _id: string;
    fullname: string;
    username: string;
    phone: string;
    wallet: {
        balance: number;
        totalEarnings: number;
    };
    status: string;
    verified: boolean;
    createdAt: string;
}

interface Withdrawal {
    _id: string;
    user: {
        _id: string;
        fullname: string;
        phone: string;
    };
    amount: number;
    adminFee: number;
    netPayable: number;
    bankDetails: {
        accountNumber: string;
        ifscCode: string;
        accountHolderName: string;
    };
    status: string;
    createdAt: string;
}

interface Transaction {
    _id: string;
    user: {
        _id: string;
        fullname: string;
        username: string;
        phone: string;
    };
    type: string;
    description: string;
    amount: number;
    status: string;
    createdAt: string;
}

interface AdminState {
    metrics: DashboardMetrics | null;
    users: User[];
    withdrawals: Withdrawal[];
    transactions: Transaction[];
    activities: Transaction[];
    pendingPayments: any[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchMetrics: () => Promise<void>;
    fetchUsers: (params?: { status?: string; search?: string }) => Promise<void>;
    fetchWithdrawals: () => Promise<void>;
    fetchLedger: () => Promise<void>;
    fetchActivity: () => Promise<void>;
    fetchPendingPayments: () => Promise<void>;
    approveWithdrawal: (id: string, status: 'approved' | 'rejected', reason?: string) => Promise<void>;
    adjustWallet: (userId: string, amount: number, type: 'credit' | 'debit', description?: string) => Promise<void>;
    updateUserStatus: (userId: string, status: string) => Promise<void>;
    approvePayment: (userId: string) => Promise<void>;
    rejectPayment: (userId: string, reason?: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
    metrics: null,
    users: [],
    withdrawals: [],
    transactions: [],
    activities: [],
    pendingPayments: [],
    loading: false,
    error: null,

    fetchMetrics: async () => {
        set({ loading: true, error: null });
        try {
            const response = await adminApi.get('/metrics');
            set({ metrics: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch metrics', loading: false });
        }
    },

    fetchUsers: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await adminApi.get('/users', {
                params
            });
            set({ users: response.data.users, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch users', loading: false });
        }
    },

    fetchWithdrawals: async () => {
        set({ loading: true, error: null });
        try {
            const response = await adminApi.get('/withdrawals?status=pending');
            set({ withdrawals: response.data.withdrawals, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch withdrawals', loading: false });
        }
    },

    fetchLedger: async () => {
        set({ loading: true, error: null });
        try {
            const response = await adminApi.get('/ledger');
            set({ transactions: response.data.transactions, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch ledger', loading: false });
        }
    },

    fetchActivity: async () => {
        set({ loading: true, error: null });
        try {
            const response = await adminApi.get('/activity?limit=10');
            set({ activities: response.data.activities, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch activity', loading: false });
        }
    },

    fetchPendingPayments: async () => {
        set({ loading: true, error: null });
        try {
            const response = await adminApi.get('/pending-payments');
            set({ pendingPayments: response.data.pendingUsers, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch pending payments', loading: false });
        }
    },

    approveWithdrawal: async (id, status, reason) => {
        try {
            await adminApi.put(`/withdrawals/${id}/approve`,
                { status, rejectionReason: reason }
            );
            // Refresh withdrawals
            await get().fetchWithdrawals();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to process withdrawal' });
            throw error;
        }
    },

    adjustWallet: async (userId, amount, type, description) => {
        try {
            await adminApi.post(`/users/${userId}/wallet`,
                { amount, type, description }
            );
            // Refresh users
            await get().fetchUsers();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to adjust wallet' });
            throw error;
        }
    },

    updateUserStatus: async (userId, status) => {
        try {
            await adminApi.put(`/users/${userId}/status`,
                { status }
            );
            // Refresh users
            await get().fetchUsers();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update status' });
            throw error;
        }
    },

    approvePayment: async (userId) => {
        try {
            await adminApi.put(`/payment/approve/${userId}`,
                {}
            );
            // Refresh pending payments
            await get().fetchPendingPayments();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to approve payment' });
            throw error;
        }
    },

    rejectPayment: async (userId, reason) => {
        try {
            await adminApi.put(`/payment/reject/${userId}`,
                { reason }
            );
            // Refresh pending payments
            await get().fetchPendingPayments();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to reject payment' });
            throw error;
        }
    },
}));
