import { Icon } from '@iconify/react';
import type { Transaction } from '@/store/useAppStore';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const isCredit = transaction.status === 'credit';

  return (
    <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-default">
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-gray-700 group-hover:scale-105 transition-transform duration-300 ${
          isCredit ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
        }`}>
          <Icon 
            icon={isCredit ? 'solar:arrow-left-down-linear' : 'solar:arrow-right-up-linear'} 
            width={24} 
          />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{transaction.type}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{transaction.description} • {new Date(transaction.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm md:text-base font-bold tracking-tight amount-value ${
          isCredit ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'
        }`}>
          {isCredit ? '+' : '-'}₹{transaction.amount}
        </p>
      </div>
    </div>
  );
};
