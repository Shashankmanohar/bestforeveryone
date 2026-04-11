import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { PageHeader } from '@/components/PageHeader';
import { leadershipApi } from '@/lib/api';
import { AnimatedNumber } from '@/components/AnimatedNumber';

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
  const globalTeamCount = royaltyInfo?.globalTeamCount || 0;

  const tiers = [
    { label: 'Star Pool', req: 6, percent: '3%', color: 'emerald', icon: 'solar:star-bold', cap: 10000 },
    { label: 'Double Star', req: 18, percent: '6%', color: 'blue', icon: 'solar:stars-bold', cap: 50000 },
    { label: 'Super Star', req: 36, percent: '11%', color: 'amber', icon: 'solar:crown-star-bold', cap: 100000 }
  ];

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
              Earn a share of the total company sponsoring pool (₹200 per ID) distributed every Sunday. Your <span className="font-bold text-indigo-600 dark:text-indigo-400">Direct Referrals (Verified)</span> count toward qualification. Reach milestones progressively to unlock higher pools.
            </p>
          </div>
        </div>
      </div>

      {/* Team Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900/40 rounded-2xl border border-gray-200 dark:border-white/5 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Icon icon="solar:users-group-rounded-bold" width={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Direct Referrals</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{directsCount}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900/40 rounded-2xl border border-gray-200 dark:border-white/5 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Icon icon="solar:people-nearby-bold" width={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Global Team (All Levels)</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{globalTeamCount}</p>
          </div>
        </div>
      </div>

      {/* Qualification Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier, idx) => {
          const prevReq = idx === 0 ? 0 : tiers[idx - 1].req;
          const isQualified = directsCount >= tier.req;
          const isNextTierStarted = directsCount > prevReq;

          // Progressive progress calculation
          let progress = 0;
          if (directsCount >= tier.req) {
            progress = 100;
          } else if (directsCount > prevReq) {
            // How far into THIS pool's requirement segment we are
            const segmentProgress = directsCount - prevReq;
            const segmentTotal = tier.req - prevReq;
            progress = (segmentProgress / segmentTotal) * 100;
          }

          const colorMap: any = {
            emerald: 'bg-emerald-500',
            blue: 'bg-blue-500',
            amber: 'bg-amber-500'
          };

          return (
            <div key={idx} className={`bg-white dark:bg-gray-900/40 p-5 rounded-3xl border transition-all duration-300 ${isQualified ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/5' : isNextTierStarted ? 'border-indigo-500/30 shadow-lg shadow-indigo-500/5' : 'border-gray-200 dark:border-white/5 opacity-60'} shadow-sm relative overflow-hidden`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isQualified ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                    <Icon icon={tier.icon} width={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tier.label}</p>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">{tier.percent} Pool</h4>
                  </div>
                </div>
                {isQualified ? (
                  <div className="h-6 w-6 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                    <Icon icon="solar:check-read-linear" width={14} />
                  </div>
                ) : isNextTierStarted ? (
                  <div className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded-lg">
                    {tier.req - directsCount} More
                  </div>
                ) : (
                  <div className="h-6 w-6 bg-gray-200 dark:bg-gray-800 text-gray-400 rounded-full flex items-center justify-center">
                    <Icon icon="solar:lock-bold" width={12} />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {/* Team Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span className="text-gray-400">Team Progress</span>
                    <span className={isQualified ? 'text-emerald-500' : 'text-gray-900 dark:text-white'}>
                      {isQualified ? (tier.req - prevReq) : Math.max(0, directsCount - prevReq)}/{(tier.req - prevReq)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full ${isQualified ? 'bg-emerald-500' : 'bg-indigo-50'}`}
                    />
                  </div>
                </div>

                {/* Earning Cap Info */}
                <div className={`p-3 rounded-2xl border transition-colors ${isQualified ? 'bg-white/50 dark:bg-white/5 border-emerald-500/10' : 'bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-white/5'}`}>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Remaining Capacity</span>
                    <span className={`text-sm font-black font-mono ${isQualified ? (tier.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : tier.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400') : 'text-gray-400'}`}>
                      <AnimatedNumber value={Math.max(0, tier.cap - (wallet?.royalty || 0))} prefix="₹" />
                    </span>
                  </div>
                  <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(((wallet?.royalty || 0) / tier.cap) * 100, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full opacity-60 ${isQualified ? colorMap[tier.color] : 'bg-gray-300'}`} 
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-[8px] text-gray-400 font-medium">Cap: ₹{tier.cap.toLocaleString()}</p>
                    <p className="text-[8px] text-gray-400 font-medium">{Math.min(Math.round(((wallet?.royalty || 0) / tier.cap) * 100), 100)}% used</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Level Breakdown */}
      {royaltyInfo?.levelStats && Object.keys(royaltyInfo.levelStats).length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Team Breakdown by Level</h3>
            <span className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full font-bold uppercase">Verified Members</span>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {Object.entries(royaltyInfo.levelStats).map(([level, count]: [string, any]) => (
                <div key={level} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/50 flex flex-col items-center justify-center text-center group hover:border-indigo-500/30 transition-colors">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-indigo-500 transition-colors">Level {level}</span>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
