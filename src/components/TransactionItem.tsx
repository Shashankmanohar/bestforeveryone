import { Icon } from '@iconify/react';
import type { Transaction } from '@/store/useAppStore';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const isCredit = transaction.status === 'credit';

  return (
    <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group cursor-default">
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:scale-105 transition-transform duration-300 ${
          isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        }`}>
          <Icon 
            icon={isCredit ? 'solar:arrow-left-down-linear' : 'solar:arrow-right-up-linear'} 
            width={24} 
          />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 mb-0.5">{transaction.type}</p>
          <p className="text-xs text-gray-500 font-medium">{transaction.desc} • {transaction.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm md:text-base font-bold tracking-tight amount-value ${
          isCredit ? 'text-emerald-700' : 'text-gray-900'
        }`}>
          {isCredit ? '+' : '-'}₹{transaction.amount}
        </p>
      </div>
    </div>
  );
};
