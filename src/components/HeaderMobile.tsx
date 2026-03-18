import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { AnimatedNumber } from './AnimatedNumber';

export const HeaderMobile = () => {
  const navigate = useNavigate();
  const { toggleSidebar, wallet } = useAppStore();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80 px-4 py-3 flex items-center justify-between md:hidden transition-all duration-300">
      <div className="flex items-center gap-3" onClick={toggleSidebar}>
        <button className="h-10 w-10 -ml-2 flex items-center justify-center text-gray-700 dark:text-gray-300 active:scale-90 transition-transform">
          <Icon icon="solar:hamburger-menu-linear" width={24} />
        </button>
        <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">Best For Everyone</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-emerald-100/50 dark:border-emerald-800/50 shadow-sm">
          <AnimatedNumber value={wallet.balance} prefix="₹" />
        </div>
        <button
          onClick={() => navigate('/notifications')}
          className="h-9 w-9 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 relative active:scale-95 transition-transform"
        >
          <Icon icon="solar:bell-linear" width={20} />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
        </button>
      </div>
    </header>
  );
};
