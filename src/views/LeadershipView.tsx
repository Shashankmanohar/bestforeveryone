import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { PageHeader } from '@/components/PageHeader';
import { leadershipApi } from '@/lib/api';

export const LeadershipView = () => {
  const { wallet, leadershipLogs, fetchWalletData } = useAppStore();
  const [royaltyInfo, setRoyaltyInfo] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      await fetchWalletData();
      try {
        const data = await leadershipApi.getRoyalty();
        setRoyaltyInfo(data);
      } catch (err) {
        console.error('Failed to fetch royalty details:', err);
      }
    };
    loadData();
  }, [fetchWalletData]);

  const directsCount = royaltyInfo?.directsCount || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6 md:space-y-8"
    >
      <PageHeader title="Weekly Royalty" subtitle="Rewards Pool" />

      {/* Info Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-800 rounded-3xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
            <Icon icon="solar:crown-star-bold" width={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Weekly Royalty Pool</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Earn a share of the total company sponsoring pool (₹200 per ID) distributed every Friday. Reach direct referral milestones to qualify for different pool percentages.
            </p>
          </div>
        </div>
      </div>

      {/* Qualification Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Star Pool', req: 6, percent: '3%', color: 'emerald' },
          { label: 'Double Star', req: 12, percent: '6%', color: 'blue' },
          { label: 'Super Star', req: 18, percent: '11%', color: 'amber' }
        ].map((tier, idx) => {
          const progress = Math.min((directsCount / tier.req) * 100, 100);
          const isQualified = directsCount >= tier.req;

          return (
            <div key={idx} className={`bg-white dark:bg-gray-900/40 p-5 rounded-3xl border ${isQualified ? 'border-emerald-500/30' : 'border-gray-200 dark:border-white/5'} shadow-sm relative overflow-hidden`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tier.label}</p>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">{tier.percent} Pool</h4>
                </div>
                {isQualified ? (
                  <div className="h-6 w-6 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                    <Icon icon="solar:check-read-linear" width={14} />
                  </div>
                ) : (
                  <div className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded-lg">
                    {tier.req - directsCount} More
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-gray-400">Verified Directs</span>
                  <span className={isQualified ? 'text-emerald-500' : 'text-gray-900 dark:text-white'}>{directsCount}/{tier.req}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full ${isQualified ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 p-6 rounded-3xl border border-white/10 shadow-card relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 text-white/[0.03] rotate-12 group-hover:scale-110 transition-transform duration-500">
            <Icon icon="solar:wallet-money-bold" width={120} />
          </div>
          <p className="text-xs text-white/50 uppercase tracking-wide font-bold mb-2">Total Royalty Earnings</p>
          <h3 className="text-3xl font-bold text-white amount-value">₹{wallet.royalty.toLocaleString()}</h3>
        </div>
        <div className="bg-white/5 dark:bg-white/5 p-6 rounded-3xl border border-white/10 shadow-card relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 text-emerald-400/[0.03] -rotate-12 group-hover:scale-110 transition-transform duration-500">
            <Icon icon="solar:graph-up-bold" width={120} />
          </div>
          <p className="text-xs text-white/50 uppercase tracking-wide font-bold mb-2">My Current Rank</p>
          <h3 className="text-3xl font-bold text-emerald-400">{royaltyInfo?.currentTier || 'None'}</h3>
        </div>
      </div>

      {/* Leadership Logs */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-card">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recent Rewards History</h3>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Last 50 Entries</span>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {leadershipLogs.length > 0 ? (
            leadershipLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${log.type === 'weekly_royalty' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}>
                    <Icon icon={log.type === 'weekly_royalty' ? "solar:star-bold" : "solar:crown-linear"} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{log.trigger}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{log.date}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 amount-value">+₹{log.amount}</span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
              No rewards credited yet. Qualify for a pool to start earning weekly!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
