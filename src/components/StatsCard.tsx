import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string;
  iconBgClass: string;
  iconColorClass: string;
  route?: string;
}

export const StatsCard = ({ 
  icon, 
  label, 
  value, 
  iconBgClass, 
  iconColorClass,
  route 
}: StatsCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-200 shadow-card card-hover group ${route ? 'cursor-pointer' : ''}`}
    >
      <div className={`h-10 w-10 rounded-full ${iconBgClass} ${iconColorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon icon={icon} width={20} />
      </div>
      <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wide">{label}</p>
      <p className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight mt-1 amount-value">{value}</p>
    </div>
  );
};
