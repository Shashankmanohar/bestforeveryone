import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/PageHeader';

export const TermsView = () => {
  const planDetails = [
    { label: 'Joining Fee', value: '₹1,180 (Admin Charge Waived)' },
    { label: 'Re-entry Fee', value: '₹1,357 (Inc. Admin Charge)' },
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
      className="space-y-6 md:space-y-8"
    >
      <PageHeader title="Terms & Plan" subtitle="Information" />

      {/* Plan Overview */}
      <div className="bg-gray-900 dark:bg-white/5 dark:border dark:border-white/10 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Icon icon="solar:document-bold" width={20} />
            </div>
            <h3 className="text-lg font-bold">Best For Everyone Plan Details</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
            Our 6x Matrix Auto Growth system ensures maximum earnings with automatic spillover and passive income opportunities.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 text-white/5 rotate-12 pointer-events-none">
          <Icon icon="solar:widget-bold" width={200} />
        </div>
      </div>

      {/* Plan Details */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Income Structure</h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {planDetails.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-5">
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-card">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Terms & Conditions</h3>
        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex gap-2">
            <Icon icon="solar:check-circle-bold" className="text-emerald-500 shrink-0 mt-0.5" />
            <span>All withdrawals are subject to 20% admin fee.</span>
          </li>
          <li className="flex gap-2">
            <Icon icon="solar:check-circle-bold" className="text-emerald-500 shrink-0 mt-0.5" />
            <span>Minimum withdrawal amount is ₹200.</span>
          </li>
          <li className="flex gap-2">
            <Icon icon="solar:check-circle-bold" className="text-emerald-500 shrink-0 mt-0.5" />
            <span>Weekly withdrawal limit is ₹50,000.</span>
          </li>
          <li className="flex gap-2">
            <Icon icon="solar:check-circle-bold" className="text-emerald-500 shrink-0 mt-0.5" />
            <span>Matrix positions are filled on first-come, first-serve basis.</span>
          </li>
          <li className="flex gap-2">
            <Icon icon="solar:check-circle-bold" className="text-emerald-500 shrink-0 mt-0.5" />
            <span>Leadership royalty is credited instantly on every re-topup.</span>
          </li>
          <li className="flex gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
            <Icon icon="solar:info-circle-bold" className="text-emerald-500 shrink-0 mt-0.5" />
            <span>Weekly Royalty is capped at: Star (₹10,000), Double Star (₹50,000), and Super Star (₹1,00,000). Total earnings capacity reset upon achievement.</span>
          </li>
          <li className="flex gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
            <Icon icon="solar:info-circle-bold" className="text-emerald-500 shrink-0 mt-0.5" />
            <span>System works on community based auto growth (Top to Bottom, Left to Right).</span>
          </li>
        </ul>
      </div>
    </motion.div>
  );
};
