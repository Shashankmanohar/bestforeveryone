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
    email: string;
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
        email: string;
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
        email: string;
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
    royaltyStats: any | null;
    matrixTree: any | null;
    completedCycles: any[];
    epins: any[];
    pinStats: any | null;
    loading: boolean;
    error: string | null;

    // Actions
    fetchMetrics: () => Promise<void>;
    fetchRoyaltyStats: () => Promise<void>;
    fetchUsers: (params?: { status?: string; search?: string }) => Promise<void>;
    fetchWithdrawals: () => Promise<void>;
    fetchLedger: () => Promise<void>;
    fetchActivity: () => Promise<void>;
    fetchPendingPayments: () => Promise<void>;
    fetchMatrixTree: (userId: string, cycle?: number) => Promise<void>;
    fetchCompletedCycles: () => Promise<void>;
    fetchEpins: () => Promise<void>;
    fetchEpinStats: () => Promise<void>;
    generateEpins: (count: number, amount: number) => Promise<void>;
    assignEpin: (pinIds: string[], username: string) => Promise<void>;
    approveWithdrawal: (id: string, status: 'approved' | 'rejected', reason?: string) => Promise<void>;
    updateWithdrawalBankDetails: (id: string, bankDetails: { accountNumber?: string; ifscCode?: string; accountHolderName?: string; bankName?: string }) => Promise<void>;
    adjustWallet: (userId: string, amount: number, type: 'credit' | 'debit', description?: string) => Promise<void>;
    updateUserStatus: (userId: string, status: string) => Promise<void>;
    approvePayment: (userId: string) => Promise<void>;
    rejectPayment: (userId: string, reason?: string) => Promise<void>;
    updateUserKycBankDetails: (userId: string, bankDetails: { accountNumber?: string; ifscCode?: string; accountHolderName?: string; bankName?: string }) => Promise<void>;
    approveKyc: (userId: string) => Promise<void>;
    rejectKyc: (userId: string, reason?: string) => Promise<void>;
    distributeRoyalty: () => Promise<any>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
    metrics: null,
    users: [],
    withdrawals: [],
    transactions: [],
    activities: [],
    pendingPayments: [],
    royaltyStats: null,
    matrixTree: null,
    completedCycles: [],
    epins: [],
    pinStats: null,
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

    fetchRoyaltyStats: async () => {
        set({ loading: true, error: null });
        try {
            const response = await adminApi.get('/royalty-stats');
            set({ royaltyStats: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch royalty stats', loading: false });
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
            const response = await adminApi.get('/activity?limit=50');
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

    fetchMatrixTree: async (userId: string, cycle?: number) => {
        set({ loading: true, error: null });
        try {
            const response = await adminApi.get(`/matrix-tree/${userId}`, {
                params: { cycle }
            });
            set({ matrixTree: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch matrix tree', loading: false });
        }
    },

    fetchCompletedCycles: async () => {
        set({ loading: true, error: null });
        try {
            const response = await adminApi.get('/matrix/completions');
            set({ completedCycles: response.data.completions, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch completed cycles', loading: false });
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

    updateWithdrawalBankDetails: async (id, bankDetails) => {
        try {
            const response = await adminApi.patch(`/withdrawals/${id}/bank-details`, bankDetails);
            // Optimistically update local state
            set((state) => ({
                withdrawals: state.withdrawals.map((w) =>
                    w._id === id ? { ...w, bankDetails: { ...w.bankDetails, ...bankDetails } } : w
                )
            }));
            return response.data;
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update bank details' });
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

    updateUserKycBankDetails: async (userId, bankDetails) => {
        try {
            await adminApi.patch(`/kyc/${userId}/bank-details`, bankDetails);
            // Refresh users to sync everything
            await get().fetchUsers();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update KYC bank details' });
            throw error;
        }
    },

    approveKyc: async (userId) => {
        try {
            await adminApi.put(`/kyc/approve/${userId}`);
            await get().fetchUsers();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to approve KYC' });
            throw error;
        }
    },

    rejectKyc: async (userId, reason) => {
        try {
            await adminApi.put(`/kyc/reject/${userId}`, { reason });
            await get().fetchUsers();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to reject KYC' });
            throw error;
        }
    },

    distributeRoyalty: async () => {
        try {
            const response = await adminApi.post('/distribute-royalty');
            // Refresh ledger
            await get().fetchLedger();
            return response.data;
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to distribute royalty' });
            throw error;
        }
    },

    fetchEpins: async () => {
        set({ loading: true, error: null });
        try {
            const response = await adminApi.get('/epin/list');
            set({ epins: response.data.epins, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch e-pins', loading: false });
        }
    },

    fetchEpinStats: async () => {
        set({ loading: true, error: null });
        try {
            const response = await adminApi.get('/epin/stats');
            set({ pinStats: response.data.stats, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch e-pin stats', loading: false });
        }
    },

    generateEpins: async (count, amount) => {
        set({ loading: true, error: null });
        try {
            await adminApi.post('/epin/generate', { count, amount });
            await get().fetchEpins();
            await get().fetchEpinStats();
            set({ loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to generate e-pins', loading: false });
            throw error;
        }
    },

    assignEpin: async (pinIds, username) => {
        set({ loading: true, error: null });
        try {
            await adminApi.post('/epin/assign', { pinIds, targetUsername: username });
            await get().fetchEpins();
            set({ loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to assign e-pins', loading: false });
            throw error;
        }
    },

}));
