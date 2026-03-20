import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/PageHeader';
import { useToastStore } from '@/store/useToastStore';
import { useAuthStore } from '@/store/useAuthStore';
import { referralApi } from '@/lib/api';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { useState, useEffect } from 'react';

export const ReferralsView = () => {
  const { showToast } = useToastStore();
  const { user } = useAuthStore();

  const [referralCode, setReferralCode] = useState(user?.referralCode || '');
  const [referralMembers, setReferralMembers] = useState<any[]>([]);
  const [totalVerified, setTotalVerified] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState({
    directReferrals: 0,
    bonusThreshold: 2,
    bonusUnlocked: false,
    baseEarnings: 0,
    bonusEarnings: 0,
    totalEarnings: 0,
    weekStart: '',
    weekEnd: '',
    isWeekend: false,
    isBonanzaWindow: true
  });

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const [codeData, membersData, statsData] = await Promise.all([
          referralApi.getCode(),
          referralApi.getReferrals(),
          referralApi.getWeeklyStats()
        ]);

        if (codeData?.referralCode) setReferralCode(codeData.referralCode);
        if (membersData?.referrals) setReferralMembers(membersData.referrals);
        if (membersData?.totalVerified !== undefined) setTotalVerified(membersData.totalVerified);
        if (statsData) setWeeklyStats(statsData);
      } catch (error) {
        console.error('Failed to fetch referral data:', error);
      }
    };

    fetchReferralData();
  }, []);

  useEffect(() => {
    if (user?.referralCode) {
      setReferralCode(user.referralCode);
    }
  }, [user]);

  const copyLink = () => {
    const link = `https://bestforeveryone.in/join/${referralCode}`;
    navigator.clipboard.writeText(link);
    showToast('Link Copied', 'Referral link copied to clipboard.');
  };

  const progressPercentage = Math.min(
    (weeklyStats.directReferrals / weeklyStats.bonusThreshold) * 100,
    100
  );

  const verifiedMembers = referralMembers.filter(m => m.verified && m.status === 'active');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4 sm:space-y-6 lg:space-y-8"
    >
      <PageHeader title="Team & Referrals" subtitle="Network" />

      {/* Weekly Earnings Summary Card */}
      <div className={`bg-gray-900 dark:glass-card dark:backdrop-blur-xl text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden shadow-xl transition-all duration-500 ${weeklyStats.isWeekend ? 'opacity-90 grayscale-[0.2]' : ''}`}>
        {!weeklyStats.isWeekend && (
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-500 opacity-5 rounded-full blur-3xl animate-pulse" />
        )}
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 sm:w-48 h-32 sm:h-48 bg-blue-500 opacity-5 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Week Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Icon icon="solar:calendar-bold" className="text-gray-400" width={16} />
              <span className="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 font-medium">
                Week: {weeklyStats.weekStart} - {weeklyStats.weekEnd}
              </span>
            </div>
          </div>

          {/* Bonus Status Indicator */}
          <div className="mb-4 sm:mb-6">
            <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border ${weeklyStats.bonusUnlocked ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/30' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10'}`}>
              <Icon icon="solar:star-bold" className={weeklyStats.bonusUnlocked ? 'text-emerald-400' : 'text-gray-400'} width={18} />
              <span className={`text-xs sm:text-sm font-bold ${weeklyStats.bonusUnlocked ? 'text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {weeklyStats.bonusUnlocked ? 'Bonanza Active! ₹400/referral' : 'Reach 2 Referrals for Bonanza!'}
              </span>
            </div>
          </div>

          {/* Earnings Breakdown - Responsive Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex xs:flex-col items-center xs:items-stretch justify-between xs:justify-start gap-2 xs:gap-0 xs:text-center">
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider xs:mb-1">Base Earnings</p>
              <div className="flex items-baseline gap-1 xs:flex-col xs:items-center">
                <p className="text-lg sm:text-xl font-bold text-white">
                  <AnimatedNumber value={weeklyStats.baseEarnings} prefix="₹" />
                </p>
                <p className="text-[10px] text-white/40 xs:mt-1">₹200 × {weeklyStats.directReferrals}</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex xs:flex-col items-center xs:items-stretch justify-between xs:justify-start gap-2 xs:gap-0 xs:text-center">
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider xs:mb-1">Bonus Earnings</p>
              <div className="flex items-baseline gap-1 xs:flex-col xs:items-center">
                <p className={`text-lg sm:text-xl font-bold ${weeklyStats.bonusUnlocked ? 'text-emerald-400' : 'text-white/30'}`}>
                  <AnimatedNumber value={weeklyStats.bonusEarnings} prefix="₹" />
                </p>
                <p className="text-[10px] text-white/40 xs:mt-1">
                  {weeklyStats.bonusUnlocked ? `₹200 × ${weeklyStats.directReferrals}` : 'Locked'}
                </p>
              </div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex xs:flex-col items-center xs:items-stretch justify-between xs:justify-start gap-2 xs:gap-0 xs:text-center">
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider xs:mb-1">Total Weekly</p>
              <div className="flex items-baseline gap-1 xs:flex-col xs:items-center">
                <p className="text-lg sm:text-xl font-bold text-emerald-400">
                  <AnimatedNumber value={weeklyStats.totalEarnings} prefix="₹" />
                </p>
                <p className={`text-[10px] xs:mt-1 ${weeklyStats.isWeekend ? 'text-white/40' : 'text-emerald-500/70'}`}>
                  {weeklyStats.isWeekend ? 'Bonanza Closed' : 'This week'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Card */}
      <div className="glass-card dark:backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-white/5 p-4 sm:p-6 lg:p-8 relative overflow-hidden shadow-card group glass-card-hover">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">Invite & Earn</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 leading-relaxed">
                Earn <span className="font-bold text-gray-900 dark:text-white">₹200 Base</span> per referral instantly, plus <span className="font-bold text-emerald-600 dark:text-emerald-400">₹200 Bonanza</span> per referral when you reach 2+ referrals in a week.
              </p>
            </div>
            <div className="hidden sm:flex h-10 w-10 lg:h-12 lg:w-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl lg:rounded-2xl items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              <Icon icon="solar:gift-bold" width={20} className="lg:hidden" />
              <Icon icon="solar:gift-bold" width={24} className="hidden lg:block" />
            </div>
          </div>

          {/* Reward Breakdown */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                  <Icon icon="solar:user-plus-bold" width={14} className="sm:hidden" />
                  <Icon icon="solar:user-plus-bold" width={16} className="hidden sm:block" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium truncate">Direct Referral</p>
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">₹200</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  <Icon icon="solar:star-bold" width={14} className="sm:hidden" />
                  <Icon icon="solar:star-bold" width={16} className="hidden sm:block" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium truncate">Weekly Bonanza (2+)</p>
                  <p className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">₹200</p>
                </div>
              </div>
            </div>
          </div>

          {/* Copy Link Section */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-mono text-gray-700 dark:text-gray-300 truncate flex items-center">
              <span className="truncate">https://bestforeveryone.in/join/{referralCode}</span>
            </div>
            <button
              onClick={copyLink}
              className="bg-gray-900 dark:bg-white text-white dark:text-[#070b14] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold click-scale whitespace-nowrap flex items-center justify-center gap-2"
            >
              <Icon icon="solar:copy-bold" width={16} />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
        <div className="absolute -right-8 sm:-right-10 -bottom-8 sm:-bottom-10 text-gray-100 rotate-12 pointer-events-none">
          <Icon icon="solar:users-group-two-rounded-bold" width={140} className="sm:hidden" />
          <Icon icon="solar:users-group-two-rounded-bold" width={180} className="hidden sm:block" />
        </div>
      </div>

      {/* Weekly Target Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-card">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Referral Rules</h3>
          <Icon icon="solar:info-circle-linear" className="text-gray-400" width={16} />
        </div>
        <div className="space-y-2.5 sm:space-y-3">
          <div className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm">
            <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5">
              <Icon icon="solar:check-circle-bold" width={12} className="sm:hidden" />
              <Icon icon="solar:check-circle-bold" width={14} className="hidden sm:block" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 leading-relaxed">
              Earn a <span className="font-bold text-gray-900 dark:text-white">₹200 Base</span> reward immediately, plus <span className="font-bold text-emerald-600 dark:text-emerald-400">₹200 Bonanza</span> per referral after reaching your 2-referral weekly target.
            </p>
          </div>
          <div className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm">
            <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5">
              <Icon icon="solar:check-circle-bold" width={12} className="sm:hidden" />
              <Icon icon="solar:check-circle-bold" width={14} className="hidden sm:block" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 leading-relaxed">
              Referrals directly contribute to your <span className="font-bold text-emerald-600 dark:text-emerald-400">Weekly Royalty</span> target ranks
            </p>
          </div>
        </div>
      </div>

      {/* Royalty Qualification Progress */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6 shadow-card">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex flex-col">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Royalty Qualification</h3>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Reach direct referral targets to unlock weekly royalty pools</p>
          </div>
          <Icon icon="solar:cup-star-bold" className="text-amber-500" width={20} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Star Pool: 6 */}
          <div className={`p-4 rounded-2xl border-2 transition-all ${totalVerified >= 6 ? 'border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-gray-100 dark:border-gray-800 bg-gray-50/30'}`}>
            <div className="flex items-center justify-between mb-3">
               <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${totalVerified >= 6 ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                 <Icon icon={totalVerified >= 6 ? "solar:check-circle-bold" : "solar:star-bold"} width={16} />
               </div>
               {totalVerified >= 6 && <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Qualified</span>}
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">Star Pool</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3">6 Directs (3% Pool)</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-medium">
                <span className="text-gray-400">Progress</span>
                <span className="text-gray-900 dark:text-white">{Math.min(totalVerified, 6)}/6</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${Math.min((totalVerified / 6) * 100, 100)}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Double Star Pool: 12 */}
          <div className={`p-4 rounded-2xl border-2 transition-all ${totalVerified >= 12 ? 'border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10' : 'border-gray-100 dark:border-gray-800 bg-gray-50/30'}`}>
            <div className="flex items-center justify-between mb-3">
               <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${totalVerified >= 12 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                 <Icon icon={totalVerified >= 12 ? "solar:check-circle-bold" : "solar:star-bold"} width={16} />
               </div>
               {totalVerified >= 12 && <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Qualified</span>}
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">Double Star</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3">12 Directs (6% Pool)</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-medium">
                <span className="text-gray-400">Progress</span>
                <span className="text-gray-900 dark:text-white">{Math.min(totalVerified, 12)}/12</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500" 
                  style={{ width: `${Math.min((totalVerified / 12) * 100, 100)}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Super Star Pool: 18 */}
          <div className={`p-4 rounded-2xl border-2 transition-all ${totalVerified >= 18 ? 'border-amber-500/20 bg-amber-50/50 dark:bg-amber-900/10' : 'border-gray-100 dark:border-gray-800 bg-gray-50/30'}`}>
            <div className="flex items-center justify-between mb-3">
               <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${totalVerified >= 18 ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                 <Icon icon={totalVerified >= 18 ? "solar:check-circle-bold" : "solar:star-bold"} width={16} />
               </div>
               {totalVerified >= 18 && <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Qualified</span>}
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">Super Star</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3">18 Directs (11% Pool)</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-medium">
                <span className="text-gray-400">Progress</span>
                <span className="text-gray-900 dark:text-white">{Math.min(totalVerified, 18)}/18</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-500" 
                  style={{ width: `${Math.min((totalVerified / 18) * 100, 100)}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Team List */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-800 shadow-card overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Direct Team</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-0.5">{verifiedMembers.length} verified members this week</p>
              </div>
              <span className="self-start sm:self-auto text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800">
                {referralMembers.length} Total
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {referralMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 sm:p-4 lg:p-5 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:bg-gray-100/50 dark:bg-gray-800 transition-colors gap-3">
                {/* Member Info */}
                <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-4 min-w-0 flex-1">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-600 relative flex-shrink-0">
                    {member.name.charAt(0)}
                    {member.verified && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 bg-emerald-50 dark:bg-emerald-900/300 rounded-full flex items-center justify-center border-2 border-white">
                        <Icon icon="solar:check-circle-bold" className="text-white" width={8} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">{member.name}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-0.5 truncate">Joined {member.joined}</p>
                  </div>
                </div>

                {/* Reward & Status */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  {member.rewardCredited ? (
                    <span className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      +₹{weeklyStats.bonusUnlocked ? 400 : 200}
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-xs font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap">Pending</span>
                  )}
                  <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold whitespace-nowrap ${member.status === 'active'
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800'
                    : member.status === 'pending'
                      ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-800'
                    }`}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Valid Referral Criteria */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-800">
          <h4 className="text-[10px] sm:text-xs font-bold text-gray-700 dark:text-gray-300 dark:text-gray-600 uppercase tracking-wider mb-2.5 sm:mb-3">Valid Referral Criteria</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2">
            {[
              'New user signup completed',
              'Email verified',
              'Account status is active',
              'No self-referral allowed',
              'No duplicate accounts'
            ].map((criteria, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 dark:text-gray-500 py-1">
                <Icon icon="solar:check-circle-bold" className="text-emerald-500 flex-shrink-0" width={14} />
                <span className="truncate">{criteria}</span>
              </div>
            ))}
          </div>

        </div>
    </motion.div>
  );
};

