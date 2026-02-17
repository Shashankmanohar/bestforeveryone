import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface MatrixTreeProps {
  matrix: {
    level1: { filled: number; total: number };
  };
}

export const MatrixTree = ({ matrix }: MatrixTreeProps) => {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-6 sm:p-8 lg:p-10 shadow-card">
      <p className="text-[10px] sm:text-xs font-bold text-gray-400 mb-6 sm:mb-8 uppercase tracking-widest text-center">
        LIVE TREE VISUALIZATION
      </p>

      <div className="flex flex-col items-center overflow-x-auto pb-4">
        <div className="min-w-[380px] sm:min-w-[550px] flex flex-col items-center">
          {/* Root Node - YOU */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mb-8"
          >
            <div className="h-14 w-14 sm:h-16 sm:w-16 bg-gray-900 text-white rounded-full flex items-center justify-center border-4 border-white shadow-xl relative">
              <span className="text-xs sm:text-sm font-bold">YOU</span>
            </div>
            {/* Connecting line to Level 1 */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 sm:h-10 bg-gray-200" />
          </motion.div>

          {/* Level 1 Nodes */}
          <div className="relative pt-6">
            {/* Horizontal connector line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-200" style={{ width: 'calc(100% - 44px)', left: '22px' }} />

            <div className="flex gap-3 sm:gap-6 md:gap-8">
              {Array(6).fill(0).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center relative"
                >
                  {/* Vertical connector to horizontal line */}
                  <div className="absolute -top-6 w-0.5 h-6 bg-gray-200" />


                  {/* Node */}
                  <div
                    className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${i < matrix.level1.filled
                      ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300 shadow-md scale-100'
                      : 'bg-gray-50 border-2 border-dashed border-gray-200 text-gray-300 scale-95'
                      }`}
                  >
                    {i < matrix.level1.filled ? (
                      <Icon icon="solar:check-circle-bold" width={20} />
                    ) : (
                      <span className="text-xs">{i + 1}</span>
                    )}
                  </div>

                  {/* Position label */}
                  <span className="text-[9px] sm:text-[10px] text-gray-400 mt-1.5 font-medium">
                    {i < matrix.level1.filled ? '●' : '○'}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
