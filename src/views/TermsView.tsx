import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/PageHeader';
import { useAuthStore } from '@/store/useAuthStore';
import { BioEnergyCard } from '@/components/BioEnergyCard';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

export const TermsView = () => {
  const { user } = useAuthStore();
  
  const joinDate = user?.createdAt ? new Date(user.createdAt) : new Date();
  const daysSinceJoined = Math.floor((new Date().getTime() - joinDate.getTime()) / (1000 * 3600 * 24));
  const isEligibleForHealthCard = daysSinceJoined >= 30;

  const planDetails = [
    { label: 'Joining Fee', value: '₹1,180 (Inc. Tax)' },
    { label: 'Re-entry Fee', value: '₹1,180 (Inc. Tax)' },
    { label: 'Matrix Type', value: '6x Matrix Auto Growth' },
    { label: 'Level 1 Matrix Income', value: '₹2,400 (One-Time)' },
    { label: 'Direct Referral', value: '₹200 (Unlimited)' },
    { label: 'Weekly Bonanza', value: '₹200 (Unlimited)' },
    { label: 'Weekly Royalty Bonus', value: '₹200 (Pool Amount)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-12 md:space-y-16 pb-24"
    >
      <PageHeader title="Terms & Plan" subtitle="Comprehensive Business Overview & Community Rules" />

      {/* ───────── 1. PLAN SUMMARY ───────── */}
      <section className="space-y-6">
        <div className="bg-gray-900 dark:bg-white/5 dark:border dark:border-white/10 text-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                <Icon icon="solar:document-bold" width={24} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">Best For Everyone System</h3>
                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mt-0.5">Automated Matrix Growth</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
              Our 6x Matrix Auto Growth system ensures maximum earnings with automatic spillover and passive income opportunities. Designed for long-term sustainability and community growth.
            </p>
          </div>
          <div className="absolute -right-20 -top-20 text-white/5 rotate-12 pointer-events-none">
            <Icon icon="solar:widget-bold" width={300} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Income Table Summary */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-card overflow-hidden h-fit">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Income Structure</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {planDetails.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 px-6 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.label}</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Royalty Formula Card (High Fidelity) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 via-slate-900 to-gray-950 rounded-[2.5rem] p-8 md:p-10 shadow-xl text-white relative overflow-hidden flex flex-col justify-center border border-white/5">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-6 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 mb-2 mx-auto">
                <Icon icon="solar:calculator-minimalistic-bold" className="text-3xl text-indigo-300" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Weekly Royalty Formula</h3>
              <p className="text-indigo-200/80 text-sm max-w-md mx-auto">How your weekly royalty income is calculated from the total company sponsoring pool.</p>
              
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 md:p-10 border border-white/10 shadow-inner">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
                  <div className="bg-white/5 px-6 py-5 rounded-xl border border-white/5 min-w-[160px]">
                    <span className="block text-indigo-300 text-[10px] uppercase tracking-widest font-bold mb-2">Step 1</span>
                    <span className="font-mono text-xs md:text-sm font-bold">Total New Sponsoring</span>
                  </div>
                  <span className="text-2xl text-indigo-400 font-bold">×</span>
                  <div className="bg-white/5 px-6 py-5 rounded-xl border border-white/5 min-w-[160px]">
                    <span className="block text-indigo-300 text-[10px] uppercase tracking-widest font-bold mb-2">Step 2</span>
                    <span className="font-mono text-xs md:text-sm font-bold">20% (₹200)</span>
                  </div>
                  <span className="text-2xl text-indigo-400 font-bold">÷</span>
                  <div className="bg-white/5 px-6 py-5 rounded-xl border border-white/5 min-w-[160px]">
                    <span className="block text-indigo-300 text-[10px] uppercase tracking-widest font-bold mb-2">Step 3</span>
                    <span className="font-mono text-xs md:text-sm font-bold leading-tight">Total Achievers<br /><span className="text-[10px] text-indigo-400">(Star / D.Star / S.Star)</span></span>
                  </div>
                </div>
                <div className="mt-10 pt-8 border-t border-white/10 flex flex-col items-center gap-3">
                  <Icon icon="solar:arrow-down-bold" className="text-indigo-400 text-2xl animate-bounce" />
                  <span className="text-2xl md:text-3xl font-black text-emerald-400 tracking-tight text-shadow-lg">= Weekly Royalty Income</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 2. ACHIEVER RANKS ───────── */}
      <motion.section {...fadeUp} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Weekly Royalty Bonus Tiers</h2>
            <p className="text-sm text-gray-500 font-medium italic">No time limitation to achieve any rank</p>
          </div>
          <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
            <Icon icon="solar:infinity-bold" className="text-lg" />
            No Time Limit to Achieve Ranks
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Star Achiever */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-card group hover:-translate-y-1 transition-transform duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-blue-50/60 to-white relative pb-8">
              <div className="absolute top-4 right-4 text-gray-200 group-hover:text-blue-200 transition-colors">
                <Icon icon="solar:star-bold" className="text-6xl" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold mb-4 relative z-10 uppercase tracking-widest">
                Rank 1
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white relative z-10">⭐ Star Achiever</h3>
              <p className="text-[10px] text-gray-500 mt-2 relative z-10 leading-relaxed font-medium">Your first milestone — start earning weekly royalty share.</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-900 space-y-4">
              <div className="flex justify-between items-center py-2.5 border-b border-gray-50 dark:border-gray-800">
                <span className="text-xs text-gray-500 font-medium flex items-center gap-2"><Icon icon="solar:users-group-rounded-bold" className="text-blue-400" /> Requirement</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">6 Direct Referrals</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-gray-50 dark:border-gray-800">
                <span className="text-xs text-gray-500 font-medium flex items-center gap-2"><Icon icon="solar:wallet-money-bold" className="text-blue-400" /> Weekly Royalty</span>
                <span className="text-xs font-bold text-blue-600">3% Bonus</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-xs text-gray-500 font-medium flex items-center gap-2"><Icon icon="solar:clock-circle-bold" className="text-blue-400" /> Time Limit</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><Icon icon="solar:infinity-bold" /> No Limit</span>
              </div>
            </div>
          </div>

          {/* Double Star Achiever */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-card group hover:-translate-y-1 transition-transform duration-300 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400 z-20"></div>
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-amber-50/60 to-white relative pb-8">
              <div className="absolute top-4 right-4 flex text-gray-200 group-hover:text-amber-200 transition-colors">
                <Icon icon="solar:star-bold" className="text-5xl -mr-4" />
                <Icon icon="solar:star-bold" className="text-5xl mt-2" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold mb-4 relative z-10 uppercase tracking-widest">
                Rank 2
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white relative z-10">⭐⭐ Double Star (D. Star)</h3>
              <p className="text-[10px] text-gray-500 mt-2 relative z-10 leading-relaxed font-medium">Dedicated leader tier — double your royalty share.</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-900 space-y-4">
              <div className="flex justify-between items-center py-2.5 border-b border-gray-50 dark:border-gray-800">
                <span className="text-xs text-gray-500 font-medium flex items-center gap-2"><Icon icon="solar:users-group-rounded-bold" className="text-amber-400" /> Requirement</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">18 Direct Referrals</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-gray-50 dark:border-gray-800">
                <span className="text-xs text-gray-500 font-medium flex items-center gap-2"><Icon icon="solar:wallet-money-bold" className="text-amber-400" /> Weekly Royalty</span>
                <span className="text-xs font-bold text-amber-600">6% Bonus</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-xs text-gray-500 font-medium flex items-center gap-2"><Icon icon="solar:clock-circle-bold" className="text-amber-400" /> Time Limit</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><Icon icon="solar:infinity-bold" /> No Limit</span>
              </div>
            </div>
          </div>

          {/* Super Star Achiever */}
          <div className="bg-gray-900 text-white rounded-3xl overflow-hidden shadow-xl group hover:-translate-y-1 transition-transform duration-300 relative border border-gray-800">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500 z-20"></div>
            <div className="p-6 border-b border-white/5 relative pb-8">
              <div className="absolute top-4 right-4 flex text-white/5 group-hover:text-purple-500/20 transition-colors">
                <Icon icon="solar:star-bold" className="text-4xl -mr-3" />
                <Icon icon="solar:star-bold" className="text-5xl mt-2 -mr-3 z-10" />
                <Icon icon="solar:star-bold" className="text-4xl" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold mb-4 relative z-10 uppercase tracking-widest">
                Highest Rank
              </div>
              <h3 className="text-xl font-black text-white relative z-10">⭐⭐⭐ Super Star (S. Star)</h3>
              <p className="text-[10px] text-gray-400 mt-2 relative z-10 leading-relaxed font-medium">Elite networker status — maximum royalty from the pool.</p>
            </div>
            <div className="p-6 space-y-4 relative z-10">
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-2"><Icon icon="solar:users-group-rounded-bold" className="text-purple-400" /> Requirement</span>
                <span className="text-xs font-bold text-white">36 Direct Referrals</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-2"><Icon icon="solar:wallet-money-bold" className="text-purple-400" /> Weekly Royalty</span>
                <span className="text-xs font-bold text-purple-400">11% Bonus</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-2"><Icon icon="solar:clock-circle-bold" className="text-purple-400" /> Time Limit</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><Icon icon="solar:infinity-bold" /> No Limit</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ───────── 3. MATRIX AUTO GROWTH ───────── */}
      <motion.section {...fadeUp} className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 md:p-12 shadow-card">
         <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
               <div className="space-y-2">
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none">6× Matrix Auto Growth</h2>
                  <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest font-mono">Global Automated Queue</p>
               </div>
               <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  Even <strong className="text-gray-900 dark:text-white underline decoration-emerald-200 decoration-2 underline-offset-4">without direct sponsoring</strong>, you can earn from the global company growth. The system automatically places members in the next available spot.
               </p>
               <div className="space-y-4">
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800">
                     <p className="text-xs text-emerald-900 dark:text-emerald-400 font-bold mb-1 uppercase tracking-tight font-mono">One-Time Benefit (Per Active ID)</p>
                     <p className="text-2xl font-black text-emerald-600 tracking-tighter">₹2,400 Non-Working Income</p>
                  </div>
                  <ul className="space-y-3">
                    {[
                      '₹400 per placement in your 6× matrix',
                      'No direct referrals mandatory for Matrix income',
                      'First-come, first-serve global company queue'
                    ].map((text, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Icon icon="solar:check-circle-bold" className="text-emerald-500 shrink-0" />
                        {text}
                      </li>
                    ))}
                  </ul>
               </div>
            </div>

            <div className="relative">
              <div className="relative z-10 p-8 bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-inner">
                <div className="relative z-10 w-16 h-16 mx-auto bg-gray-900 text-white rounded-2xl flex items-center justify-center mb-10 border-4 border-white shadow-xl">
                  <Icon icon="solar:user-bold" width={24} />
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
                </div>
                
                {/* Visual Branch Lines */}
                <div className="absolute top-[4.5rem] left-1/2 w-[85%] -translate-x-1/2 h-10 border-t-2 border-dashed border-gray-300 dark:border-gray-600 select-none pointer-events-none opacity-40" />
                
                <div className="flex justify-between gap-1 relative z-10">
                  {[1,2,3,4,5,6].map(num => (
                    <div key={num} className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 shadow-sm transition-transform hover:scale-110">
                      <Icon icon="solar:user-bold" width={14} />
                    </div>
                  ))}
                </div>
                <div className="mt-10 text-center bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Level 1 Completion</p>
                   <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">₹2,400 Earned ✅</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full -m-20 pointer-events-none" />
            </div>
         </div>
      </motion.section>

      {/* ───────── 4. SPECIAL GIFT ───────── */}
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 p-8 md:p-10 shadow-card relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Icon icon="solar:gift-bold" width={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-none">Special Gift Card (Physical)</h3>
            <p className="text-[10px] text-gray-500 mt-1.5 font-bold uppercase tracking-widest text-emerald-600">Exclusive Reward T&C</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              Members who complete <strong>30 days</strong> of active membership are eligible for our physical **BIO-ENERGY Health Card**. This card is designed for premium protection and wellness benefits.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-900 dark:text-white">
                <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Icon icon="solar:check-circle-bold" /></div>
                Free Physical Delivery Pan-India
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-900 dark:text-white">
                <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Icon icon="solar:check-circle-bold" /></div>
                Authentic Verification Certificate
              </div>
            </div>
            {!isEligibleForHealthCard && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-3xl p-5 flex items-center gap-5">
                <div className="h-14 w-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm shrink-0 transition-transform group-hover:rotate-12">
                  <Icon icon="solar:lock-bold" width={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-amber-900/60 uppercase tracking-widest mb-1">Unlocks In</p>
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-500 leading-none tracking-tighter">{30 - daysSinceJoined} Days</p>
                </div>
              </div>
            )}
            {isEligibleForHealthCard && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-5 flex items-center gap-5 shadow-emerald-500/10 shadow-lg">
                    <div className="h-14 w-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                        <Icon icon="solar:delivery-bold" width={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-emerald-900/60 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-500 leading-none tracking-tighter">Eligible for Delivery</p>
                    </div>
                </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center">
            <BioEnergyCard 
              userName={user?.fullname} 
              isLocked={!isEligibleForHealthCard} 
              unlockDays={30 - daysSinceJoined}
            />
            <p className="text-[10px] text-gray-500 mt-6 font-medium italic animate-pulse">
              Click or tap the card to see both sides
            </p>
          </div>
        </div>

        <div className="absolute right-[-40px] top-[-40px] text-gray-100 dark:text-white/5 pointer-events-none -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
          <Icon icon="solar:gift-bold" width={200} />
        </div>
      </div>

      {/* ───────── 5. TERMS & CONDITIONS ───────── */}
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 p-8 md:p-10 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
           <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="h-8 w-8 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center">
                <Icon icon="solar:shield-keyhole-bold" />
              </div>
              Platform Terms & Conditions
           </h3>
           <div className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full text-[9px] font-bold uppercase tracking-widest">
             Active Since 2024
           </div>
        </div>
        <ul className="grid md:grid-cols-2 gap-4">
           {[
             'All withdrawals are subject to 20% admin service fee.',
             'Minimum withdrawal amount is ₹200 for all wallets.',
             'Weekly withdrawal limit is capped at ₹50,000 per user.',
             'Matrix positions are filled on First-Come, First-Serve basis.',
             'Weekly Royalty is capped at Star (₹10k), D.Star (₹50k), S.Star (₹100k).',
             'System works on community based auto growth (Top to Bottom, Left to Right).',
             'Direct sponsoring is not mandatory for Matrix income.',
             'Identity verification (KYC) is required for large withdrawals.'
           ].map((item, i) => (
            <li key={i} className="flex gap-4 text-xs font-medium text-gray-600 dark:text-gray-400 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-white/5 hover:border-gray-200 transition-colors group">
              <Icon icon="solar:check-circle-bold" className="text-emerald-500 shrink-0 mt-0.5 text-lg group-hover:scale-110 transition-transform" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};
