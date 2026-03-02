import { create } from 'zustand';
import { walletApi, withdrawalApi, referralApi, epinApi } from '@/lib/api';

export interface Transaction {
  _id: string;
  type: string;
  description: string;
  amount: number;
  status: 'credit' | 'debit';
  createdAt: string;
}

export interface BonanzaLog {
  id: number;
  amount: number;
  referral: string;
  date: string;
}

export interface LeadershipLog {
  id: number;
  amount: number;
  trigger: string;
  date: string;
}

export interface ReferralMember {
  id: number;
  name: string;
  joined: string;
  status: 'active' | 'pending' | 'inactive';
  verified: boolean;
  rewardCredited: boolean;
}

export interface WeeklyReferralStats {
  weekStart: string;
  weekEnd: string;
  directReferrals: number;
  bonusThreshold: number;
  bonusUnlocked: boolean;
  baseEarnings: number;
  bonusEarnings: number;
  totalEarnings: number;
}

export interface AppState {
  // User
  user: {
    name: string;
    id: string;
    joined: string;
    status: string;
  };

  // Wallet
  wallet: {
    balance: number;
    total_earnings: number;
    withdrawn: number;
    pending: number;
    matrix_income: number;
    referral_income: number;
    royalty: number;
    matrixWallet: number;
  };

  // Weekly Stats
  weekly: {
    withdrawalUsed: number;
    withdrawalLimit: number;
    weeklyBonanza: number;
    leadershipIncome: number;
  };

  // Matrix
  matrix: {
    level1: { total: number; filled: number };
    level2: { total: number; filled: number };
    cycle: number;
  };

  // Transactions
  transactions: Transaction[];

  // Logs
  bonanzaLogs: BonanzaLog[];
  leadershipLogs: LeadershipLog[];

  // Referral System
  referralMembers: ReferralMember[];
  weeklyReferralStats: WeeklyReferralStats;

  // Sidebar State
  isSidebarOpen: boolean;

  // Actions
  toggleSidebar: () => void;
  closeSidebar: () => void;
  processWithdrawal: (amount: number, bankDetails: any, walletType?: 'current' | 'matrix') => Promise<void>;
  updateBalance: (amount: number) => void;
  buyEpin: (amount?: number) => Promise<any>;
  fetchWalletData: () => Promise<void>;
  fetchMatrixStatus: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  setWallet: (walletData: any) => void;
  setWeekly: (weeklyData: any) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: {
    name: "",
    id: "",
    joined: "",
    status: ""
  },

  wallet: {
    balance: 0,
    total_earnings: 0,
    withdrawn: 0,
    pending: 0,
    matrix_income: 0,
    referral_income: 0,
    royalty: 0,
    matrixWallet: 0
  },

  weekly: {
    withdrawalUsed: 0,
    withdrawalLimit: 50000,
    weeklyBonanza: 0,
    leadershipIncome: 0
  },

  matrix: {
    level1: { total: 6, filled: 0 },
    level2: { total: 25, filled: 0 },
    cycle: 1
  },

  transactions: [],

  bonanzaLogs: [],

  leadershipLogs: [],

  referralMembers: [],

  weeklyReferralStats: {
    weekStart: '',
    weekEnd: '',
    directReferrals: 0,
    bonusThreshold: 2,
    bonusUnlocked: false,
    baseEarnings: 0,
    bonusEarnings: 0,
    totalEarnings: 0
  },

  isSidebarOpen: false,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),

  processWithdrawal: async (amount: number, bankDetails: any, walletType: 'current' | 'matrix' = 'current') => {
    const state = get();
    const balance = walletType === 'matrix' ? state.wallet.matrixWallet : state.wallet.balance;

    if (amount < 200) {
      throw new Error('Minimum withdrawal is ₹200');
    }

    if (amount > balance) {
      throw new Error('Insufficient wallet balance');
    }

    try {
      await withdrawalApi.create(amount, bankDetails, walletType);

      set((state) => {
        const updatedWallet = { ...state.wallet };
        if (walletType === 'matrix') {
          updatedWallet.matrixWallet -= amount;
        } else {
          updatedWallet.balance -= amount;
        }

        return {
          wallet: updatedWallet,
          weekly: {
            ...state.weekly,
            withdrawalUsed: state.weekly.withdrawalUsed + amount
          },
          transactions: [
            {
              _id: Date.now().toString(), // Changed from 'id' to '_id' and converted to string
              type: "Withdrawal",
              description: `Processing(${walletType})...`, // Changed from 'desc' to 'description'
              amount: amount,
              createdAt: new Date().toISOString(), // Changed from 'date' to 'createdAt' and formatted
              status: "debit"
            } as Transaction,
            ...state.transactions
          ]
        };
      });
    } catch (error: any) {
      throw new Error(error.message || 'Withdrawal request failed');
    }
  },

  updateBalance: (amount: number) => set((state) => ({
    wallet: {
      ...state.wallet,
      balance: state.wallet.balance + amount
    }
  })),

  buyEpin: async (amount: number = 1357) => {
    try {
      const response = await epinApi.buy(amount);
      if (response.newBalance !== undefined) {
        set((state) => ({
          wallet: {
            ...state.wallet,
            balance: response.newBalance
          },
          transactions: [
            {
              _id: Date.now().toString(), // Changed from 'id' to '_id' and converted to string
              type: "E-pin Purchase",
              description: `Pin: ${response.epin.pin} `, // Changed from 'desc' to 'description'
              amount: amount,
              createdAt: new Date().toISOString(), // Changed from 'date' to 'createdAt' and formatted
              status: "debit"
            } as Transaction,
            ...state.transactions
          ]
        }));
      }
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to purchase E-pin');
    }
  },

  fetchWalletData: async () => {
    try {
      const [walletData, weeklyData] = await Promise.all([
        walletApi.getBalance(),
        referralApi.getWeeklyStats()
      ]);

      if (walletData?.wallet) {
        set((state) => ({
          wallet: {
            ...state.wallet,
            balance: walletData.wallet.balance || 0,
            total_earnings: walletData.wallet.totalEarnings || 0,
            withdrawn: walletData.wallet.withdrawn || 0,
            pending: walletData.wallet.pending || 0,
            matrixWallet: walletData.wallet.matrixWallet || 0,
            matrix_income: walletData.wallet.matrixIncome || 0,
            referral_income: walletData.wallet.referralIncome || 0,
            royalty: walletData.wallet.royalty || 0,
          }
        }));
      }

      if (weeklyData) {
        set((state) => ({
          weekly: {
            ...state.weekly,
            withdrawalUsed: weeklyData.withdrawalUsed || 0,
            withdrawalLimit: weeklyData.withdrawalLimit || 50000,
            weeklyBonanza: weeklyData.bonusEarnings || 0,
          }
        }));
      }
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    }
  },

  fetchMatrixStatus: async () => {
    try {
      const { matrixApi } = await import('@/lib/api');
      const data = await matrixApi.getStatus();
      if (data?.matrix) {
        set({ matrix: data.matrix });
      }
    } catch (error) {
      console.error('Failed to fetch matrix status:', error);
    }
  },

  fetchTransactions: async () => {
    try {
      const response = await walletApi.getTransactions();
      if (response?.transactions) {
        set({ transactions: response.transactions });
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  },

  setWallet: (walletData: any) => set((state) => ({
    wallet: { ...state.wallet, ...walletData }
  })),

  setWeekly: (weeklyData: any) => set((state) => ({
    weekly: { ...state.weekly, ...weeklyData }
  }))
}));
