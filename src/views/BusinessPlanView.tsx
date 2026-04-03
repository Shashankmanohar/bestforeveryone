import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { PageHeader } from '../components/PageHeader';

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

export const BusinessPlanView = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 md:space-y-10 pb-12"
        >
            <PageHeader
                title="Business Presentation"
                subtitle="Complete overview of the Best For Everyone income structure, achiever ranks and growth matrix"
            />

            {/* ───────── 1. ACHIEVER RANKS ───────── */}
            <motion.section {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }}>
                <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 text-xs font-bold tracking-wide uppercase border border-purple-200">
                            <Icon icon="solar:crown-star-bold" /> Achiever Ranks
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Weekly Royalty Bonus Tiers
                        </h2>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-bold">
                        <Icon icon="solar:infinity-bold" className="text-lg" />
                        No Time Limitation to Achieve Ranks
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Star Achiever */}
                    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-card group hover:-translate-y-1 transition-transform duration-300">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-blue-50/60 to-white relative pb-8">
                            <div className="absolute top-4 right-4 text-gray-200 group-hover:text-blue-200 transition-colors">
                                <Icon icon="solar:star-bold" className="text-6xl" />
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-4 relative z-10">
                                Rank 1
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white relative z-10">⭐ Star Achiever</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2 relative z-10">Your first milestone — start earning weekly royalty share.</p>
                        </div>
                        <div className="p-6 bg-white dark:bg-gray-900 space-y-4">
                            <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                                <span className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 flex items-center gap-2"><Icon icon="solar:users-group-rounded-bold" className="text-blue-400" /> Requirement</span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">6 Direct Referrals</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                                <span className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 flex items-center gap-2"><Icon icon="solar:wallet-money-bold" className="text-blue-400" /> Weekly Royalty</span>
                                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">3% Bonus</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5">
                                <span className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 flex items-center gap-2"><Icon icon="solar:clock-circle-bold" className="text-blue-400" /> Time Limit</span>
                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><Icon icon="solar:infinity-bold" /> No Limit</span>
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
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:text-amber-400 text-xs font-bold mb-4 relative z-10">
                                Rank 2
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white relative z-10">⭐⭐ Double Star (D. Star)</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2 relative z-10">Dedicated leader tier — double your royalty share.</p>
                        </div>
                        <div className="p-6 bg-white dark:bg-gray-900 space-y-4">
                            <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                                <span className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 flex items-center gap-2"><Icon icon="solar:users-group-rounded-bold" className="text-amber-400" /> Requirement</span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">18 Direct Referrals</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                                <span className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 flex items-center gap-2"><Icon icon="solar:wallet-money-bold" className="text-amber-400" /> Weekly Royalty</span>
                                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">6% Bonus</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5">
                                <span className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 flex items-center gap-2"><Icon icon="solar:clock-circle-bold" className="text-amber-400" /> Time Limit</span>
                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><Icon icon="solar:infinity-bold" /> No Limit</span>
                            </div>
                        </div>
                    </div>

                    {/* Super Star Achiever */}
                    <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-xl group hover:-translate-y-1 transition-transform duration-300 relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500 z-20"></div>
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-50 dark:bg-purple-900/300/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="p-6 border-b border-gray-800 relative pb-8">
                            <div className="absolute top-4 right-4 flex text-gray-800 group-hover:text-purple-900/50 transition-colors">
                                <Icon icon="solar:star-bold" className="text-4xl -mr-3" />
                                <Icon icon="solar:star-bold" className="text-5xl mt-2 -mr-3 z-10" />
                                <Icon icon="solar:star-bold" className="text-4xl" />
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/300/20 text-purple-300 border border-purple-500/30 text-xs font-bold mb-4 relative z-10">
                                👑 Highest Rank
                            </div>
                            <h3 className="text-2xl font-black text-white relative z-10">⭐⭐⭐ Super Star (S. Star)</h3>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 relative z-10">Elite networker status — maximum royalty share from the pool.</p>
                        </div>
                        <div className="p-6 bg-gray-900 space-y-4 relative z-10">
                            <div className="flex justify-between items-center py-2.5 border-b border-gray-800">
                                <span className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-2"><Icon icon="solar:users-group-rounded-bold" className="text-purple-400" /> Requirement</span>
                                <span className="text-sm font-bold text-white">36 Direct Referrals</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-gray-800">
                                <span className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-2"><Icon icon="solar:wallet-money-bold" className="text-purple-400" /> Weekly Royalty</span>
                                <span className="text-sm font-bold text-purple-400">11% Bonus</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5">
                                <span className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-2"><Icon icon="solar:clock-circle-bold" className="text-purple-400" /> Time Limit</span>
                                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1"><Icon icon="solar:infinity-bold" /> No Limit</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>



            {/* ───────── 3. ROYALTY FORMULA ───────── */}
            <motion.section {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
                <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-gray-900 rounded-3xl p-6 md:p-10 shadow-xl text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="absolute -top-20 -left-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-50 dark:bg-purple-900/300/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-gray-900/10 backdrop-blur-md border border-white/20 mb-2">
                            <Icon icon="solar:calculator-minimalistic-bold" className="text-3xl text-indigo-300" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Weekly Royalty Formula</h2>
                        <p className="text-indigo-200/80 text-sm max-w-md mx-auto">How your weekly royalty income is calculated from the total company sponsoring pool.</p>

                        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10 shadow-inner">
                            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 text-center">
                                <div className="bg-white dark:bg-gray-900/10 px-5 py-4 rounded-xl border border-white/5 w-full md:w-auto">
                                    <span className="block text-indigo-300 text-[10px] uppercase tracking-widest font-bold mb-1.5">Step 1</span>
                                    <span className="font-mono text-sm md:text-base">Total New Sponsoring</span>
                                </div>
                                <span className="text-2xl text-indigo-400 font-bold">×</span>
                                <div className="bg-white dark:bg-gray-900/10 px-5 py-4 rounded-xl border border-white/5 w-full md:w-auto">
                                    <span className="block text-indigo-300 text-[10px] uppercase tracking-widest font-bold mb-1.5">Step 2</span>
                                    <span className="font-mono text-sm md:text-base">20% (₹200)</span>
                                </div>
                                <span className="text-2xl text-indigo-400 font-bold">÷</span>
                                <div className="bg-white dark:bg-gray-900/10 px-5 py-4 rounded-xl border border-white/5 w-full md:w-auto">
                                    <span className="block text-indigo-300 text-[10px] uppercase tracking-widest font-bold mb-1.5">Step 3</span>
                                    <span className="font-mono text-sm md:text-base leading-tight">Total Achievers<br /><span className="text-xs text-indigo-400">(Star / D.Star / S.Star)</span></span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col items-center gap-2">
                                <Icon icon="solar:arrow-down-bold" className="text-indigo-400 text-xl" />
                                <span className="text-xl md:text-2xl font-black text-emerald-400">= Weekly Royalty Income</span>
                            </div>
                        </div>

                        <p className="text-xs text-indigo-200/60 max-w-xl mx-auto">
                            Calculated dynamically every Sunday based on total company growth and the number of qualified achievers in each specific pool (Accumulative Bonus — you earn from all pools you have qualified for).
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* ───────── 4. 6× MATRIX AUTO GROWTH ───────── */}
            <motion.section {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-10 shadow-card">
                    <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 dark:text-emerald-400 mb-2">
                            <Icon icon="solar:route-bold" className="text-3xl" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            6× Matrix Auto Growth
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm md:text-base">
                            Non-Working Income — your 1st level completion generates income automatically from the global company matrix.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-10 items-center justify-center">
                        {/* Visual Matrix Diagram */}
                        <div className="w-full lg:w-1/2 flex justify-center">
                            <div className="relative w-full max-w-sm">
                                {/* Central User */}
                                <div className="relative z-10 w-20 h-20 mx-auto bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl shadow-xl flex flex-col items-center justify-center border-4 border-white mb-8">
                                    <Icon icon="solar:user-bold" className="text-3xl" />
                                    <span className="text-[10px] uppercase font-bold tracking-wider mt-1">You</span>
                                </div>

                                {/* Connecting Lines */}
                                <div className="absolute top-[3.5rem] left-1/2 w-[85%] -translate-x-1/2 h-10 border-t-2 border-l-2 border-r-2 border-emerald-200 dark:border-emerald-800 rounded-t-xl z-0" />
                                <div className="absolute top-[3.5rem] left-1/2 w-[50%] -translate-x-1/2 h-10 border-t-2 border-l-2 border-r-2 border-emerald-200 dark:border-emerald-800 rounded-t-xl z-0" />
                                <div className="absolute top-[3.5rem] left-1/2 w-[15%] -translate-x-1/2 h-10 border-t-2 border-l-2 border-r-2 border-emerald-200 dark:border-emerald-800 rounded-t-xl z-0" />

                                {/* 6 Downline Members */}
                                <div className="flex justify-between relative z-10 px-2 mt-4">
                                    {[1, 2, 3, 4, 5, 6].map((num) => (
                                        <div
                                            key={num}
                                            className="w-12 h-12 bg-emerald-100 text-emerald-700 dark:text-emerald-400 rounded-xl flex flex-col items-center justify-center shadow-sm border border-emerald-200 dark:border-emerald-800"
                                        >
                                            <Icon icon="solar:user-bold" className="text-lg" />
                                            <span className="text-[8px] font-bold mt-0.5">{num}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Arrow + Label */}
                                <div className="mt-6 flex justify-center">
                                    <Icon icon="solar:arrow-down-bold" className="text-emerald-400 text-2xl" />
                                </div>

                                <div className="mt-3 text-center bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Result</span>
                                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">1st Level Completed ✅</p>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400/70 mt-1 font-medium">Generates Non-Working Income</p>
                                </div>
                            </div>
                        </div>

                        {/* Special Condition & Terms Box */}
                        <div className="w-full lg:w-1/2 space-y-5">
                            {/* Special Condition Highlight */}
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 md:p-6 border border-amber-200 dark:border-amber-700 relative overflow-hidden">
                                <Icon icon="solar:star-shine-bold" className="absolute -bottom-6 -right-6 text-7xl text-amber-500/10 pointer-events-none" />
                                <div className="flex items-start gap-3 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                                        <Icon icon="solar:bell-bing-bold" className="text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-amber-900 dark:text-amber-200 uppercase tracking-wide">Special Condition</h4>
                                        <p className="text-amber-800 text-sm font-medium leading-relaxed mt-1.5">
                                            Even <strong className="font-black underline decoration-amber-400 decoration-2 underline-offset-2">without direct sponsoring</strong>, a member can earn
                                            <strong className="font-black text-amber-900 dark:text-amber-200 mx-1 text-base">₹2400</strong>
                                            gradually (one time per active ID).
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl p-5 md:p-6 border border-emerald-100 dark:border-emerald-800 relative overflow-hidden">
                                <Icon icon="solar:verified-check-line-duotone" className="absolute -bottom-8 -right-8 text-8xl text-emerald-500/10 pointer-events-none" />

                                <h3 className="text-base font-bold text-emerald-900 mb-4 flex items-center gap-2">
                                    <Icon icon="solar:info-square-bold" className="text-emerald-500 text-lg" />
                                    Terms & Conditions
                                </h3>

                                <ul className="space-y-4 relative z-10">
                                    <li className="flex gap-3 items-start">
                                        <div className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                            <Icon icon="solar:check-read-linear" className="text-xs" />
                                        </div>
                                        <p className="text-emerald-900 text-sm font-medium leading-relaxed">
                                            Earn <strong className="font-black text-emerald-700 dark:text-emerald-400">₹400</strong> per placement in your 6× matrix (total <strong className="font-black text-emerald-700 dark:text-emerald-400">₹2400</strong> on level completion).
                                        </p>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <div className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                            <Icon icon="solar:check-read-linear" className="text-xs" />
                                        </div>
                                        <p className="text-emerald-900 text-sm font-medium leading-relaxed">
                                            Income operates gradually with <strong className="font-black text-emerald-700 dark:text-emerald-400">no time limitation</strong>.
                                        </p>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <div className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                            <Icon icon="solar:check-read-linear" className="text-xs" />
                                        </div>
                                        <p className="text-emerald-900 text-sm font-medium leading-relaxed">
                                            Zero direct referrals required. Paid <strong className="font-black text-emerald-700 dark:text-emerald-400">one-time per active ID</strong> directly to your main wallet.
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

        </motion.div>
    );
};
