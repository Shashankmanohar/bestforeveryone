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
  const { wallet, fetchWalletData } = useAppStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchWalletData();

        // Fetch transactions locally
        const txData = await walletApi.getTransactions();
        if (txData?.transactions) {
          setTransactions(txData.transactions);
        }
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchWalletData]);

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
          <p className="text-sm text-gray-500">Loading wallet data...</p>
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
        <div className="bg-white p-6 rounded-3xl border border-gray-200 flex justify-between items-center shadow-card card-hover">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Current Balance</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2 amount-value">₹{wallet.balance.toLocaleString()}</h3>
          </div>
          <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <Icon icon="solar:wallet-money-bold" width={28} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-200 flex justify-between items-center shadow-card card-hover">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Total Withdrawn</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2 amount-value">₹{wallet.withdrawn.toLocaleString()}</h3>
          </div>
          <div className="h-14 w-14 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
            <Icon icon="solar:bill-check-bold" width={28} />
          </div>
        </div>
        <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 flex justify-between items-center shadow-card card-hover col-md-span-2">
          <div>
            <p className="text-xs text-emerald-400 uppercase tracking-wide font-bold">Matrix Wallet (0% Fee)</p>
            <h3 className="text-3xl font-bold text-white mt-2 amount-value">₹{wallet.matrixWallet.toLocaleString()}</h3>
          </div>
          <div className="h-14 w-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20">
            <Icon icon="solar:crown-bold" width={28} />
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-900">All Transactions</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {transactions.length === 0 ? (
            <div className="p-10 text-center">
              <Icon icon="solar:wallet-bold" className="mx-auto text-gray-300 mb-3" width={48} />
              <p className="text-sm text-gray-500">No transactions yet</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx._id} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center border ${tx.status === 'credit'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-gray-50 text-gray-500 border-gray-200'
                    }`}>
                    <Icon icon={tx.status === 'credit' ? 'solar:arrow-left-down-linear' : 'solar:arrow-right-up-linear'} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{tx.type}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(tx.createdAt)}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold amount-value ${tx.status === 'credit' ? 'text-emerald-700' : 'text-gray-900'}`}>
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
