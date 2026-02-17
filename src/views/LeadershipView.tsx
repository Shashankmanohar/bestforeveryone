import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { PageHeader } from '@/components/PageHeader';

export const LeadershipView = () => {
  const { wallet, leadershipLogs } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6 md:space-y-8"
    >
      <PageHeader title="Leadership Royalty" subtitle="Rewards" />

      {/* Info Card */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-3xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <Icon icon="solar:crown-bold" width={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">How Leadership Works</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Earn ₹500 every time a direct referral completes a matrix cycle!
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-card card-hover">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-2">Total Leadership Income</p>
          <h3 className="text-3xl font-bold text-gray-900 amount-value">₹{wallet.royalty.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-card card-hover">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-2">This Week</p>
          <h3 className="text-3xl font-bold text-emerald-600 amount-value">₹{leadershipLogs.reduce((sum, log) => sum + log.amount, 0).toLocaleString()}</h3>
        </div>
      </div>

      {/* Leadership Logs */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-card">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-900">Recent Royalty Credits</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {leadershipLogs.length > 0 ? (
            leadershipLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <Icon icon="solar:crown-linear" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{log.trigger}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{log.date}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-700 amount-value">+₹{log.amount}</span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
              No royalty credits yet. Grow your team to start earning!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
