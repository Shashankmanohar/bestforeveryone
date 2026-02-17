import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItemProps {
  icon: string;
  label: string;
  route: string;
  isActive: boolean;
  onClick: () => void;
  isFab?: boolean;
}

const NavItem = ({ icon, label, isActive, onClick, isFab }: NavItemProps) => {
  if (isFab) {
    return (
      <button
        onClick={onClick}
        className="relative -top-6 flex flex-col items-center justify-center h-16 w-16 rounded-full bg-gray-900 text-white shadow-fab click-scale border-[5px] border-background group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Icon icon={icon} width={26} />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 transition-colors click-scale ${
        isActive ? 'text-gray-900' : 'text-gray-400'
      }`}
    >
      <Icon 
        icon={icon} 
        width={24} 
        className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} 
      />
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  );
};

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (route: string) => location.pathname === route;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-gray-200 px-6 py-2 pb-safe z-40 flex justify-between items-center shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.03)] transition-transform duration-300">
      <NavItem
        icon="solar:widget-linear"
        label="Home"
        route="/dashboard"
        isActive={isActive('/dashboard') || isActive('/')}
        onClick={() => navigate('/dashboard')}
      />
      <NavItem
        icon="solar:layers-minimalistic-linear"
        label="Matrix"
        route="/matrix"
        isActive={isActive('/matrix')}
        onClick={() => navigate('/matrix')}
      />
      <NavItem
        icon="solar:wallet-bold"
        label=""
        route="/wallet"
        isActive={isActive('/wallet')}
        onClick={() => navigate('/wallet')}
        isFab
      />
      <NavItem
        icon="solar:gift-linear"
        label="Bonanza"
        route="/bonanza"
        isActive={isActive('/bonanza')}
        onClick={() => navigate('/bonanza')}
      />
      <NavItem
        icon="solar:crown-linear"
        label="Royalty"
        route="/leadership"
        isActive={isActive('/leadership')}
        onClick={() => navigate('/leadership')}
      />
    </nav>
  );
};
