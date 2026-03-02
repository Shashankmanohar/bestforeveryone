import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { StatsCard } from '@/components/StatsCard';
import { TransactionItem } from '@/components/TransactionItem';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { walletApi, epinApi } from '@/lib/api';
import { useState, useEffect } from 'react';

export const DashboardView = () => {
  const navigate = useNavigate();
  const { user, hasSeenKycPrompt, setHasSeenKycPrompt } = useAuthStore();
  const {
    wallet,
    weekly: weeklyStats,
    matrix,
    transactions,
    fetchWalletData,
    fetchTransactions: fetchStoreTransactions,
    fetchMatrixStatus,
    buyEpin,
    updateBalance
  } = useAppStore();
  const [showBuyEpin, setShowBuyEpin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [epinSuccess, setEpinSuccess] = useState<string | null>(null);
  const [epins, setEpins] = useState([]);


  const fetchMyEpins = async () => {
    try {
      const data = await epinApi.getMyEpins();
      setEpins(data.epins);
    } catch (error) {
      console.error('Failed to fetch E-pins:', error);
    }
  };

  const handleBuyEpin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await buyEpin();
      await fetchWalletData(); // Refresh balance
      await fetchMatrixStatus(); // Refresh cycle if influenced
      setEpinSuccess(response.epin.pin);
      fetchMyEpins(); // Refresh pins list
      fetchStoreTransactions(); // Refresh transactions list
    } catch (err: any) {
      setError(err.message || 'Failed to purchase E-pin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
    fetchStoreTransactions();
    fetchMatrixStatus();
    fetchMyEpins();
  }, [fetchWalletData, fetchStoreTransactions, fetchMatrixStatus]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6 md:space-y-8"
    >
      {/* KYC Prompt Banner */}
      {user?.kyc?.status === 'not_submitted' && !hasSeenKycPrompt && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
              <Icon icon="solar:shield-warning-bold" width={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900 leading-tight">Complete Your KYC</p>
              <p className="text-xs text-amber-700">Please complete your one-time KYC to enable withdrawals.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => navigate('/kyc')}
              className="flex-1 sm:flex-none px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors"
            >
              Start KYC
            </button>
            <button
              onClick={() => setHasSeenKycPrompt(true)}
              className="flex-1 sm:flex-none px-4 py-2 bg-white text-amber-900 border border-amber-200 rounded-xl text-xs font-bold hover:bg-amber-50 transition-colors"
            >
              Later
            </button>
          </div>
        </motion.div>
      )}

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
              onClick={() => navigate('/profile')}
              className="flex-1 bg-white text-gray-900 py-3.5 px-6 rounded-xl text-sm font-bold click-scale flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              Change Password <Icon icon="solar:lock-password-linear" />
            </button>
            <button
              onClick={() => navigate('/activate-others')}
              className="flex-1 bg-emerald-500 text-white py-3.5 px-6 rounded-xl text-sm font-bold click-scale shadow-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
            >
              <Icon icon="solar:user-plus-bold" /> Activate Others
            </button>
          </div>
          <div className="mt-3 flex gap-3">
            <button
              onClick={() => navigate('/matrix')}
              className="flex-1 bg-white/10 text-white py-3 px-6 rounded-xl text-xs font-bold click-scale border border-white/10 hover:bg-white/20 transition-colors"
            >
              Check Matrix Status
            </button>
            <button
              onClick={() => setShowBuyEpin(true)}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl text-xs font-bold click-scale border border-blue-500/50 hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Icon icon="solar:ticket-bold" width={16} /> Buy E-pin
            </button>
          </div>
        </div>
      </div>

      {/* Buy E-pin Confirmation Modal */}
      <AnimatePresence>
        {showBuyEpin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !loading && setShowBuyEpin(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] p-8 max-w-sm w-full relative z-10 shadow-2xl text-center"
            >
              <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon icon="solar:ticket-bold" width={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Buy E-pin</h3>
              <p className="text-gray-500 text-sm mb-6 px-2">
                Buy a ₹1,357 E-pin (₹1,180 + ₹177 admin charge) to activate any user account. The amount will be deducted from your wallet balance.
              </p>
              {epinSuccess ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] text-emerald-600 uppercase font-bold mb-1">Your E-pin Code</p>
                    <div className="flex items-center justify-center gap-3">
                      <code className="text-2xl font-black text-emerald-700 tracking-wider">
                        {epinSuccess}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(epinSuccess);
                        }}
                        className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors click-scale"
                      >
                        <Icon icon="solar:copy-linear" width={18} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowBuyEpin(false);
                      setEpinSuccess(null);
                    }}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    disabled={loading}
                    onClick={() => setShowBuyEpin(false)}
                    className="flex-1 py-4 px-4 bg-gray-100 text-gray-600 rounded-2xl text-xs font-bold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={loading || wallet.balance < 1357}
                    onClick={handleBuyEpin}
                    className={`flex-1 py-4 px-4 rounded-2xl text-xs font-bold shadow-lg transition-all flex items-center justify-center ${loading || wallet.balance < 1357 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    {loading ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Confirm'
                    )}
                  </button>
                </div>
              )}
              {error && (
                <p className="mt-4 text-xs font-bold text-red-600">{error}</p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

      {/* Active E-pins Section */}
      {epins.filter((p: any) => p.status === 'active').length > 0 && (
        <div className="pt-2">
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-base font-bold text-gray-900">Your Active E-pins</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {epins.filter((p: any) => p.status === 'active').map((epin: any) => (
              <div key={epin._id} className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">E-pin Code</p>
                  <code className="text-lg font-bold text-blue-600 tracking-wider transition-all">{epin.pin}</code>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(epin.pin);
                    // Could add a toast here
                  }}
                  className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors click-scale"
                  title="Copy Pin"
                >
                  <Icon icon="solar:copy-linear" width={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="pt-2">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Recent Activity</h3>
          <button
            onClick={() => navigate('/wallet')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            View All Transaction <Icon icon="solar:arrow-right-linear" />
          </button>
        </div>
        <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-200 overflow-hidden shadow-card">
          <div className="max-h-[500px] overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
            {transactions.length > 0 ? (
              transactions.map((tx: any) => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No transactions yet
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
