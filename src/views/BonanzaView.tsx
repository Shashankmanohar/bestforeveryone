import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/PageHeader';
import { useState, useEffect } from 'react';
import { bonanzaApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export const BonanzaView = () => {
  const { user } = useAuthStore();
  const [weeklyBonanza, setWeeklyBonanza] = useState(user?.weeklyStats?.weeklyBonanza || 0);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bonanzaData, logsData] = await Promise.all([
          bonanzaApi.getWeekly(),
          bonanzaApi.getLogs()
        ]);
        setWeeklyBonanza(bonanzaData.weeklyBonanza);
        setLogs(logsData.bonanzaLogs);
      } catch (error) {
        console.error('Failed to fetch bonanza data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
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
      <PageHeader title="Weekly Bonanza" subtitle="Rewards" />

      {/* Info Card */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800 rounded-3xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
            <Icon icon="solar:gift-bold" width={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">How Bonanza Works</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Earn amazing rewards every week (Monday to Friday)! Refer 2 people to get ₹400, refer 3 people to get ₹600, refer 4 people to get ₹800, and so on. Reach the target to unlock your weekly Bonanza!
            </p>
          </div>
        </div>
      </div>

      {/* This Week Stats */}
      <div className="bg-white/5 dark:bg-white/5 p-6 rounded-3xl border border-white/10 shadow-card">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wide font-bold mb-2">This Week's Bonanza</p>
            <h3 className="text-4xl font-bold text-blue-400 amount-value">₹{weeklyBonanza.toLocaleString()}</h3>
          </div>
          <div className="h-16 w-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center">
            <Icon icon="solar:gift-bold" width={32} />
          </div>
        </div>
      </div>

      {/* Bonanza Logs */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-card">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Bonanza History</h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {logs.length > 0 ? (
            logs.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Icon icon="solar:user-plus-rounded-linear" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Referral: {log.referral}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{log.date}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 amount-value">+₹{log.amount}</span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
              No bonanza credits yet this week. Start referring to earn!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
