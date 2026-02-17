import { Icon } from '@iconify/react';
import { useToastStore } from '@/store/useToastStore';
import { AnimatePresence, motion } from 'framer-motion';

export const Toast = () => {
  const { isVisible, title, message, type } = useToastStore();

  const iconName = type === 'success' 
    ? 'solar:check-circle-bold' 
    : type === 'error'
    ? 'solar:danger-circle-bold'
    : 'solar:info-circle-bold';

  const iconColorClass = type === 'success' 
    ? 'text-emerald-400' 
    : type === 'error'
    ? 'text-red-400'
    : 'text-blue-400';

  const bgColorClass = type === 'success'
    ? 'bg-emerald-500/20'
    : type === 'error'
    ? 'bg-red-500/20'
    : 'bg-blue-500/20';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '-150%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-150%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:min-w-[320px] z-[60]"
        >
          <div className="bg-gray-900/95 backdrop-blur-md text-white px-5 py-4 rounded-2xl shadow-toast flex items-center gap-4 border border-white/10">
            <div className={`h-10 w-10 rounded-full ${bgColorClass} flex items-center justify-center shrink-0`}>
              <Icon icon={iconName} className={`${iconColorClass} text-xl`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{title}</p>
              <p className="text-xs text-gray-300 mt-0.5 truncate">{message}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
