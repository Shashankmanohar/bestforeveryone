import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useToastStore } from '@/store/useToastStore';

export const WithdrawView = () => {
  const [amount, setAmount] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<'current' | 'matrix'>('current');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    accountHolderName: ''
  });
  const [loading, setLoading] = useState(false);
  const { wallet, weekly, processWithdrawal, fetchWalletData } = useAppStore();
  const { showToast } = useToastStore();

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const numAmount = parseFloat(amount) || 0;
  const isMatrix = selectedWallet === 'matrix';
  const fee = isMatrix ? 0 : numAmount * 0.20;
  const net = numAmount - fee;

  const today = new Date();
  const isSaturday = today.getDay() === 6;

  const handleWithdraw = async () => {
    if (numAmount < 200) {
      showToast('Error', 'Minimum withdrawal is ₹200', 'error');
      return;
    }

    if (numAmount > 50000) {
      showToast('Error', 'Maximum withdrawal is ₹50,000', 'error');
      return;
    }

    if (!bankDetails.accountHolderName || !bankDetails.accountNumber || !bankDetails.ifscCode) {
      showToast('Error', 'Please fill in all bank details', 'error');
      return;
    }

    const balance = isMatrix ? wallet.matrixWallet : wallet.balance;
    if (numAmount > balance) {
      showToast('Error', 'Insufficient wallet balance', 'error');
      return;
    }

    if (!isSaturday) {
      showToast('Error', 'Withdrawals are only allowed on Saturdays', 'error');
      return;
    }

    setLoading(true);
    try {
      await processWithdrawal(numAmount, bankDetails, selectedWallet);
      showToast('Success', 'Withdrawal request submitted successfully.', 'success');
      setAmount('');
      setBankDetails({ accountNumber: '', ifscCode: '', accountHolderName: '' });
    } catch (error: any) {
      showToast('Error', error.message || 'Withdrawal request failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6 md:space-y-8"
    >
      {/* Header */}
      <div>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Finance</p>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Withdraw Funds</h2>
      </div>

      {/* Wallet Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setSelectedWallet('current')}
          className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${selectedWallet === 'current'
            ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900/5'
            : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
        >
          <div className="flex items-center justify-between">
            <Icon icon="solar:wallet-bold" className={selectedWallet === 'current' ? 'text-gray-900' : 'text-gray-400'} width={24} />
            {selectedWallet === 'current' && <Icon icon="solar:check-circle-bold" className="text-gray-900" width={20} />}
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Current Wallet</p>
            <p className="text-lg font-bold text-gray-900">₹{wallet.balance.toLocaleString()}</p>
            <p className="text-[10px] text-red-500 font-bold mt-1">20% Admin Fee Applies</p>
          </div>
        </button>

        <button
          onClick={() => setSelectedWallet('matrix')}
          className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${selectedWallet === 'matrix'
            ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/5'
            : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
        >
          <div className="flex items-center justify-between">
            <Icon icon="solar:crown-bold" className={selectedWallet === 'matrix' ? 'text-emerald-600' : 'text-gray-400'} width={24} />
            {selectedWallet === 'matrix' && <Icon icon="solar:check-circle-bold" className="text-emerald-600" width={20} />}
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Matrix Wallet</p>
            <p className="text-lg font-bold text-gray-900">₹{wallet.matrixWallet.toLocaleString()}</p>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">0% Admin Fee (Tax Free)</p>
          </div>
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 flex items-center gap-4 shadow-card card-hover">
          <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Icon icon="solar:wallet-money-bold" width={24} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Available</p>
            <p className="text-xl font-bold text-gray-900 amount-value">₹{wallet.balance.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 flex items-center gap-4 shadow-card card-hover">
          <div className="h-12 w-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
            <Icon icon="solar:calendar-bold" width={24} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Weekly Used</p>
            <p className="text-xl font-bold text-gray-900 amount-value">
              ₹{weekly.withdrawalUsed.toLocaleString()}<span className="text-gray-400 text-sm font-medium">/{weekly.withdrawalLimit.toLocaleString()}</span>
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 flex items-center gap-4 shadow-card card-hover">
          <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Icon icon="solar:bill-list-bold" width={24} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Charge</p>
            <p className={`text-xl font-bold amount-value ${isMatrix ? 'text-emerald-600' : 'text-amber-600'}`}>
              {isMatrix ? '0%' : '20%'}
            </p>
          </div>
        </div>
      </div>

      {!isSaturday && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-amber-800">
          <Icon icon="solar:info-circle-bold" className="text-xl shrink-0" />
          <p className="text-xs font-bold uppercase tracking-wide">
            Notice: Withdrawals are only active on <span className="text-amber-900 underline underline-offset-2">Saturdays</span>.
          </p>
        </div>
      )}

      {/* Withdraw Form */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-card">
        <h3 className="text-sm font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Icon icon="solar:money-bag-bold" className="text-emerald-600" /> Enter Withdrawal Amount
        </h3>
        <div className="relative group">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-900 font-bold text-2xl group-focus-within:text-gray-900 transition-colors">
            ₹
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="₹200 - ₹50,000"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-2xl font-bold rounded-2xl py-4 pl-10 pr-4 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all placeholder:text-gray-300 focus:bg-white"
          />
        </div>

        {/* Bank Details */}
        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Icon icon="solar:bank-bold" className="text-blue-600" /> Bank Account Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Account Holder Name</label>
              <input
                type="text"
                value={bankDetails.accountHolderName}
                onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                placeholder="As per bank records"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-bold rounded-xl py-3 px-4 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Account Number</label>
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                placeholder="Enter account number"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-bold rounded-xl py-3 px-4 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">IFSC Code</label>
              <input
                type="text"
                value={bankDetails.ifscCode}
                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                placeholder="SBIN00XXXXX"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-bold rounded-xl py-3 px-4 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Calculation Preview */}
        <div className="mt-6 p-5 bg-gray-50 rounded-2xl space-y-3 border border-dashed border-gray-200">
          <div className="flex justify-between text-xs md:text-sm">
            <span className="text-gray-500 font-medium">Requested Amount</span>
            <span className="font-bold text-gray-900">₹{numAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs md:text-sm">
            <span className="text-gray-500 font-medium">Admin Fee ({isMatrix ? '0%' : '20%'})</span>
            <span className={`font-bold ${fee > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
              {fee > 0 ? `-₹${fee.toLocaleString()}` : '₹0'}
            </span>
          </div>
          <div className="h-px bg-gray-200 my-2" />
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-700 text-sm">Net Payable</span>
            <span className="font-bold text-emerald-600 text-xl md:text-2xl">₹{net.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={handleWithdraw}
          disabled={loading || !isSaturday}
          className={`w-full mt-8 ${!isSaturday ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-gray-900 hover:bg-gray-800 shadow-lg'} text-white font-bold py-4 rounded-xl click-scale transition-all flex items-center justify-center gap-2 text-sm md:text-base ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <Icon icon="eos-icons:loading" className="text-xl animate-spin" /> Processing...
            </>
          ) : (
            <>
              Confirm Request <Icon icon="solar:arrow-right-linear" className="text-lg" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
