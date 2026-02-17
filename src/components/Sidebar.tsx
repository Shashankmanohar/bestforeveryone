import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';

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
      ? 'text-gray-900 bg-gray-50'
      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
  >
    <Icon
      icon={icon}
      width={20}
      className={`transition-colors duration-300 ${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-900'
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

  const handleNavigate = (route: string) => {
    navigate(route);
    closeSidebar();
  };

  const isActive = (route: string) => location.pathname === route;

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
        className={`fixed md:static w-72 h-full bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] left-0 top-0 shadow-2xl md:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        {/* Logo */}
        <div className="p-6 md:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold tracking-tighter text-sm shadow-lg shadow-gray-200">
              B
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Best For <span className="text-gray-400 font-medium">Everyone</span>
            </span>
          </div>
          <button
            onClick={closeSidebar}
            className="md:hidden text-gray-400 hover:text-gray-900 transition-colors p-2 -mr-2"
          >
            <Icon icon="solar:close-circle-linear" width={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 md:px-6 py-2 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-3 mt-2">
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

          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-3 mt-6">
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

          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-3 mt-6">
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
              onClick={() => handleNavigate('/terms')}
              className="w-full text-left text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors px-1 py-2"
            >
              Terms & Plan
            </button>
            <button
              onClick={() => handleNavigate('/profile')}
              className="w-full text-left text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors px-1 py-2"
            >
              Profile Settings
            </button>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 md:p-6 border-t border-gray-100 bg-white z-10">
          <button
            onClick={() => handleNavigate('/profile')}
            className="w-full flex items-center gap-3 p-2.5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-200 transition-all group cursor-pointer text-left"
          >
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 group-hover:bg-white group-hover:shadow-sm transition-all">
              {user?.fullname?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.fullname || 'User'}</p>
              <p className="text-[10px] text-emerald-600 font-bold truncate flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {user?.status || 'Active'}
              </p>
            </div>
            <Icon icon="solar:alt-arrow-right-linear" className="text-gray-400 group-hover:text-gray-900 transition-colors" />
          </button>
        </div>
      </aside>
    </>
  );
};
