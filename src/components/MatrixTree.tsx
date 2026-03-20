import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface MatrixTreeProps {
  level1: any[];
}

export const MatrixTree = ({ level1 }: MatrixTreeProps) => {
  const totalSlots = 6;
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 lg:p-10 shadow-card">
      <p className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 mb-6 sm:mb-8 uppercase tracking-widest text-center">
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
            <div className="h-14 w-14 sm:h-16 sm:w-16 bg-white dark:bg-white text-gray-900 dark:text-gray-900 rounded-full flex items-center justify-center border-4 border-indigo-500/20 shadow-xl shadow-blue-500/10 relative">
              <span className="text-xs sm:text-sm font-bold">YOU</span>
            </div>
            {/* Connecting line to Level 1 */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 sm:h-10 bg-gray-300 dark:bg-blue-500/50" />
          </motion.div>

          {/* Level 1 Nodes */}
          <div className="relative pt-6">
            {/* Horizontal connector line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-300 dark:bg-blue-500/50" style={{ width: 'calc(100% - 44px)', left: '22px' }} />

            <div className="flex gap-3 sm:gap-6 md:gap-8">
              {Array(totalSlots).fill(0).map((_, i) => {
                const member = level1.find(m => m.position === i + 1);
                const isFilled = !!member;
                
                // Identify the most recent member
                const isLatest = isFilled && member === [...level1].sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )[0];
                
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center relative"
                  >
                    {/* Vertical connector to horizontal line */}
                    <div className="absolute -top-6 w-0.5 h-6 bg-gray-300 dark:bg-blue-500/50" />

                    {/* Node */}
                    <div
                      className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 relative ${isFilled
                        ? isLatest 
                          ? 'bg-blue-600 text-white border-2 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105' 
                          : 'bg-emerald-600 text-white border-2 border-emerald-400 shadow-[0_0_20px_rgba(5,150,105,0.3)]'
                        : 'bg-white dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/20 text-gray-400 dark:text-gray-300 scale-95 shadow-sm'
                        }`}
                    >
                      {isFilled ? (
                        <span className="text-sm font-bold uppercase">{member.user?.fullname?.charAt(0) || '?'}</span>
                      ) : (
                        <span className="text-xs">{i + 1}</span>
                      )}
                      
                      {isLatest && (
                          <div className="absolute -top-3 -right-3 px-1.5 py-0.5 bg-blue-500 text-[6px] font-black text-white rounded-full animate-bounce shadow-lg ring-2 ring-white dark:ring-gray-900 z-20">
                              NEW!
                          </div>
                      )}
                    </div>

                    {/* Member Name / Position label */}
                    <div className="mt-2 text-center">
                        <p className={`text-[8px] sm:text-[9px] font-bold uppercase truncate max-w-[60px] ${isFilled ? 'text-slate-700 dark:text-slate-300' : 'text-gray-400 dark:text-gray-500'}`}>
                            {isFilled ? member.user?.fullname?.split(' ')[0] : `Pos ${i + 1}`}
                        </p>
                        <span className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                            {isFilled ? '●' : '○'}
                        </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
