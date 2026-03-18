import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore, resolveTheme } from '@/store/useThemeStore';

interface NavItemProps {
  icon: string;
  label: string;
  route: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
      ? 'text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800'
      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
      }`}
  >
    <Icon
      icon={icon}
      width={20}
      className={`transition-colors duration-300 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white'
        }`}
    />
    {label}
  </button>
);

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSidebarOpen, closeSidebar } = useAppStore();
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const handleNavigate = (route: string) => {
    navigate(route);
    closeSidebar();
  };

  const isActive = (route: string) => location.pathname === route;

  const resolved = resolveTheme(theme);

  const cycleTheme = () => {
    const order: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };

  const themeIcon = theme === 'dark'
    ? 'solar:moon-bold'
    : theme === 'light'
      ? 'solar:sun-bold'
      : 'solar:monitor-bold';

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={closeSidebar}
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed md:static w-72 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] left-0 top-0 shadow-2xl md:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        {/* Logo */}
        <div className="p-6 md:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl flex items-center justify-center font-bold tracking-tighter text-sm shadow-lg shadow-gray-200 dark:shadow-none">
              B
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Best For <span className="text-gray-400 dark:text-gray-500 font-medium">Everyone</span>
            </span>
          </div>
          <button
            onClick={closeSidebar}
            className="md:hidden text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 -mr-2"
          >
            <Icon icon="solar:close-circle-linear" width={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 md:px-6 py-2 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-3 mt-2">
            Main Menu
          </div>

          <NavItem
            icon="solar:widget-linear"
            label="Dashboard"
            route="/dashboard"
            isActive={isActive('/dashboard') || isActive('/')}
            onClick={() => handleNavigate('/dashboard')}
          />
          <NavItem
            icon="solar:presentation-bold-duotone"
            label="Business Plan"
            route="/business-plan"
            isActive={isActive('/business-plan')}
            onClick={() => handleNavigate('/business-plan')}
          />
          <NavItem
            icon="solar:layers-minimalistic-linear"
            label="Matrix Tree"
            route="/matrix"
            isActive={isActive('/matrix')}
            onClick={() => handleNavigate('/matrix')}
          />
          <NavItem
            icon="solar:users-group-rounded-linear"
            label="Team & Referrals"
            route="/referrals"
            isActive={isActive('/referrals')}
            onClick={() => handleNavigate('/referrals')}
          />

          <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-3 mt-6">
            Finance
          </div>

          <NavItem
            icon="solar:wallet-money-linear"
            label="Wallet History"
            route="/wallet"
            isActive={isActive('/wallet')}
            onClick={() => handleNavigate('/wallet')}
          />
          <NavItem
            icon="solar:card-transfer-linear"
            label="Withdraw Funds"
            route="/withdraw"
            isActive={isActive('/withdraw')}
            onClick={() => handleNavigate('/withdraw')}
          />

          <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-3 mt-6">
            Rewards
          </div>

          <NavItem
            icon="solar:crown-linear"
            label="Leadership Royalty"
            route="/leadership"
            isActive={isActive('/leadership')}
            onClick={() => handleNavigate('/leadership')}
          />
          <NavItem
            icon="solar:gift-linear"
            label="Weekly Bonanza"
            route="/bonanza"
            isActive={isActive('/bonanza')}
            onClick={() => handleNavigate('/bonanza')}
          />


          <div className="mt-8 mb-4 px-3">
            <button
              onClick={() => handleNavigate('/support')}
              className="w-full text-left text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 font-medium transition-colors px-1 py-2 flex items-center gap-2"
            >
              <Icon icon="solar:help-bold" className="text-sm" />
              Contact Support
            </button>
            <button
              onClick={() => handleNavigate('/terms')}
              className="w-full text-left text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 font-medium transition-colors px-1 py-2"
            >
              Terms & Plan
            </button>
            <button
              onClick={() => handleNavigate('/kyc')}
              className="w-full text-left text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 font-medium transition-colors px-1 py-2 flex items-center gap-2"
            >
              <Icon icon="solar:verified-check-bold" className="text-sm" />
              KYC Verification
            </button>
            <button
              onClick={() => handleNavigate('/profile')}
              className="w-full text-left text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 font-medium transition-colors px-1 py-2"
            >
              Profile Settings
            </button>
          </div>
        </nav>

        {/* Footer: Theme Toggle + User Profile */}
        <div className="p-4 md:p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-10 space-y-3">
          {/* Theme Toggle */}
          <button
            onClick={cycleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all"
          >
            <Icon icon={themeIcon} width={20} />
            <span className="capitalize">{theme} Mode</span>
          </button>

          {/* User Profile */}
          <button
            onClick={() => handleNavigate('/profile')}
            className="w-full flex items-center gap-3 p-2.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all group cursor-pointer text-left"
          >
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:bg-white dark:group-hover:bg-gray-600 group-hover:shadow-sm transition-all">
              {user?.fullname?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.fullname || 'User'}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold truncate flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {user?.status || 'Active'}
              </p>
            </div>
            <Icon icon="solar:alt-arrow-right-linear" className="text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
          </button>
        </div>
      </aside>
    </>
  );
};
