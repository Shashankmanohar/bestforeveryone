import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { StatsCard } from '@/components/StatsCard';
import { TransactionItem } from '@/components/TransactionItem';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { walletApi } from '@/lib/api';
import { useState, useEffect } from 'react';

export const DashboardView = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { wallet, weekly: weeklyStats, fetchWalletData } = useAppStore();
  const [matrix, setMatrix] = useState(user?.matrix || { level1: { filled: 0 }, level2: { filled: 0 }, cycle: 1 });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchWalletData();

    // Still fetch transactions locally for now since they are not in useAppStore
    const fetchTransactions = async () => {
      try {
        const txData = await walletApi.getTransactions();
        setTransactions(txData.transactions);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    };

    fetchTransactions();
  }, [fetchWalletData]);

  // Update matrix from user data if available
  useEffect(() => {
    if (user) {
      setMatrix(user.matrix);
    }
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6 md:space-y-8"
    >
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Overview</p>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 tracking-tight">Namaste, {user?.fullname || 'User'}</h1>
          <p className="text-sm text-gray-500 font-medium">@{user?.username}</p>
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="bg-gray-900 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-gray-200 group card-hover">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-700" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-emerald-500 opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-700" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
            <div>
              <p className="text-gray-400 text-xs md:text-sm font-bold tracking-widest uppercase mb-2">Total Available Balance</p>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-1">
                <AnimatedNumber value={wallet.balance} prefix="₹" />
              </h2>
            </div>
            <div className="h-12 w-12 bg-white/10 rounded-2xl items-center justify-center backdrop-blur-md border border-white/5 shadow-inner hidden md:flex">
              <Icon icon="solar:wallet-bold" width={24} />
            </div>
          </div>

          {/* Referral Code Section */}
          <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/60 uppercase tracking-wider font-bold mb-1">Your Referral Code</p>
                <div className="flex items-center gap-2">
                  <code className="text-lg font-bold tracking-wide">{user?.referralCode}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://bestforever.com/join/${user?.referralCode}`);
                      // You can add a toast notification here
                    }}
                    className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors click-scale"
                    title="Copy referral link"
                  >
                    <Icon icon="solar:copy-linear" width={16} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => navigate('/referrals')}
                className="text-xs font-bold text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                View Team <Icon icon="solar:arrow-right-linear" width={14} />
              </button>
            </div>
          </div>

          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4">
            <button
              onClick={() => navigate('/withdraw')}
              className="flex-1 bg-white text-gray-900 py-3.5 px-6 rounded-xl text-sm font-bold click-scale flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              Withdraw Funds <Icon icon="solar:arrow-right-up-linear" />
            </button>
            <button
              onClick={() => navigate('/activate-others')}
              className="flex-1 bg-emerald-500 text-white py-3.5 px-6 rounded-xl text-sm font-bold click-scale shadow-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
            >
              <Icon icon="solar:user-plus-bold" /> Activate Others
            </button>
          </div>
          <div className="mt-3">
            <button
              onClick={() => navigate('/matrix')}
              className="w-full bg-white/10 text-white py-3 px-6 rounded-xl text-xs font-bold click-scale border border-white/10 hover:bg-white/20 transition-colors"
            >
              Check Matrix Status
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        <StatsCard
          icon="solar:graph-up-bold"
          label="Total Earnings"
          value={`₹${wallet.total_earnings?.toLocaleString() || 0}`}
          iconBgClass="bg-emerald-50"
          iconColorClass="text-emerald-600"
          route="/wallet"
        />
        <StatsCard
          icon="solar:gift-bold"
          label="Weekly Bonanza"
          value={`₹${(weeklyStats?.weeklyBonanza ?? 0).toLocaleString()}`}
          iconBgClass="bg-blue-50"
          iconColorClass="text-blue-600"
          route="/bonanza"
        />
        <StatsCard
          icon="solar:crown-bold"
          label="Leadership"
          value={`₹${wallet.royalty?.toLocaleString() || 0}`}
          iconBgClass="bg-purple-50"
          iconColorClass="text-purple-600"
          route="/leadership"
        />
        <StatsCard
          icon="solar:refresh-circle-bold"
          label="Matrix Cycles"
          value={`#${matrix.cycle || 1}`}
          iconBgClass="bg-orange-50"
          iconColorClass="text-orange-600"
          route="/matrix"
        />
      </div>

      {matrix.cycle === 5 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <Icon icon="solar:info-circle-bold" className="text-amber-600 text-xl" />
          <p className="text-sm text-amber-900 font-medium">
            This is your <strong>5th (final) cycle</strong>. After completing this cycle, account reactivation (₹1,180) will be required to continue.
          </p>
        </div>
      )}

      {/* Recent Activity */}
      <div className="pt-2">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-base font-bold text-gray-900">Recent Transactions</h3>
          <button
            onClick={() => navigate('/wallet')}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            View All
          </button>
        </div>
        <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-200 overflow-hidden shadow-card">
          {transactions.length > 0 ? (
            transactions.slice(0, 5).map((tx: any) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
              No transactions yet
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
