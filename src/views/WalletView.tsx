import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/PageHeader';
import { useAppStore } from '@/store/useAppStore';
import { useState, useEffect } from 'react';
import { walletApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

interface Transaction {
  _id: string;
  type: string;
  description: string;
  amount: number;
  status: 'credit' | 'debit';
  createdAt: string;
}

export const WalletView = () => {
  const { user } = useAuthStore();
  const { wallet, fetchWalletData, transactions, fetchTransactions } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchWalletData(),
          fetchTransactions()
        ]);
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchWalletData, fetchTransactions]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return diffMins === 0 ? 'Just now' : `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading wallet data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6 md:space-y-8"
    >
      <PageHeader title="Wallet History" subtitle="Finance" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-6 rounded-3xl border border-gray-200 dark:border-white/5 flex justify-between items-center shadow-card glass-card-hover">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold">Current Balance</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 amount-value">₹{wallet.balance.toLocaleString()}</h3>
          </div>
          <div className="h-14 w-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
            <Icon icon="solar:wallet-money-bold" width={28} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-950/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-200 dark:border-white/10 flex justify-between items-center shadow-card glass-card-hover">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold">Total Withdrawn</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 amount-value">₹{wallet.withdrawn.toLocaleString()}</h3>
          </div>
          <div className="h-14 w-14 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center">
            <Icon icon="solar:bill-check-bold" width={28} />
          </div>
        </div>
        <div className="bg-white dark:bg-emerald-500/5 p-6 rounded-3xl border border-gray-200 dark:border-emerald-500/10 flex justify-between items-center shadow-card glass-card-hover col-md-span-2">
          <div>
            <p className="text-xs text-emerald-400 uppercase tracking-wide font-bold">Matrix Wallet (20% Fee)</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 amount-value">₹{wallet.matrixWallet.toLocaleString()}</h3>
          </div>
          <div className="h-14 w-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20">
            <Icon icon="solar:crown-bold" width={28} />
          </div>
        </div>
      </div>

      {/* Income Breakdown */}
      <div className="pt-2">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-4">Income Breakdown</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm group hover:border-emerald-500/30 transition-all">
            <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-3">
              <Icon icon="solar:users-group-rounded-bold" width={20} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Referral Income</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 amount-value">₹{wallet.referral_income.toLocaleString()}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm group hover:border-blue-500/30 transition-all">
            <div className="h-10 w-10 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-3">
              <Icon icon="solar:widget-add-bold" width={20} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matrix Income</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 amount-value">₹{wallet.matrix_income.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm group hover:border-purple-500/30 transition-all">
            <div className="h-10 w-10 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-3">
              <Icon icon="solar:star-bold" width={20} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Weekly Royalty</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 amount-value">₹{wallet.royalty.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm group hover:border-amber-500/30 transition-all">
            <div className="h-10 w-10 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mb-3">
              <Icon icon="solar:medal-star-bold" width={20} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bonanza Income</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 amount-value">₹{wallet.bonanza_income.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white dark:bg-gray-950/80 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-white/10 shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">All Transactions</h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {transactions.length === 0 ? (
            <div className="p-10 text-center">
              <Icon icon="solar:wallet-bold" className="mx-auto text-gray-300 dark:text-gray-600 mb-3" width={48} />
              <p className="text-sm text-gray-500 dark:text-gray-400">No transactions yet</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx._id} className="flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center border ${tx.status === 'credit'
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-white/10'
                    : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10'
                    }`}>
                    <Icon icon={tx.status === 'credit' ? 'solar:arrow-left-down-linear' : 'solar:arrow-right-up-linear'} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {tx.type} 
                      {tx.description && <span className="text-[10px] ml-2 text-gray-400 dark:text-gray-500 font-normal">{tx.description}</span>}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 font-bold uppercase tracking-wider mt-1">{formatDate(tx.createdAt)}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold amount-value ${tx.status === 'credit' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                  {tx.status === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};
