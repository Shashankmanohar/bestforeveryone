import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { MatrixTree } from '@/components/MatrixTree';
import { PageHeader } from '@/components/PageHeader';
import { useState, useEffect } from 'react';
import { matrixApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export const MatrixView = () => {
  const { user } = useAuthStore();
  const [matrix, setMatrix] = useState({
    level1: { filled: 0, total: 6 },
    cycle: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatrixData = async () => {
      try {
        const data = await matrixApi.getStatus();
        if (data?.matrix) {
          setMatrix(data.matrix);
        }
      } catch (error) {
        console.error('Failed to fetch matrix data:', error);
        // Fallback to user data if available
        if (user?.matrix) {
          setMatrix(user.matrix);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMatrixData();
  }, [user]);

  const l1Pct = (matrix.level1.filled / matrix.level1.total) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading matrix data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4 sm:space-y-6 lg:space-y-8"
    >
      <PageHeader title="6X Matrix Tree" subtitle="Auto-Fill System" />

      {/* Cycle Badge */}
      <div className="flex justify-end">
        <div className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
          Cycle #{matrix.cycle}
        </div>
      </div>

      {/* Live Status Banner */}
      <div className="bg-blue-50/50 border border-blue-100 p-4 sm:p-5 rounded-2xl flex gap-3 items-center">
        <div className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
        </div>
        <p className="text-xs sm:text-sm text-blue-800 font-medium">
          Matrix is filling automatically from global spillover activity.
        </p>
      </div>

      {/* Level Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Level 1 Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">
                LEVEL 1 STATUS
              </p>
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tighter">
                {matrix.level1.filled}
                <span className="text-gray-300 text-xl sm:text-2xl">/6</span>
              </h3>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Icon icon="solar:users-group-two-rounded-bold" width={20} className="sm:hidden" />
              <Icon icon="solar:users-group-two-rounded-bold" width={24} className="hidden sm:block" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2.5 sm:h-3 mb-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${l1Pct}%` }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-blue-600 h-full rounded-full"
            />
          </div>

          {/* Income Info */}
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Potential Income: <span className="font-bold text-gray-900">₹3,600</span>
              <span className="text-[10px] text-gray-400 ml-1">(₹600 × 6)</span>
            </p>
            {matrix.level1.filled === matrix.level1.total ? (
              <span className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                Completed
              </span>
            ) : (
              <span className="text-[10px] sm:text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                In Progress
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Matrix Tree Visualization */}
      <MatrixTree matrix={matrix} />
    </motion.div >
  );
};
