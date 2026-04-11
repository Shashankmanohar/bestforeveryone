import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/lib/api';

export const WithdrawView = () => {
  const [amount, setAmount] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<'current' | 'matrix'>('current');
  const [loading, setLoading] = useState(false);
  const { wallet, weekly, processWithdrawal, fetchWalletData } = useAppStore();
  const { user, updateUser } = useAuthStore();
  const { showToast } = useToastStore();
  const navigate = useNavigate();

  // KYC States
  const [kycLoading, setKycLoading] = useState(false);
  const [kycForm, setKycForm] = useState({
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    bankName: ''
  });
  const [kycFiles, setKycFiles] = useState<{ aadharCard: File | null; panCard: File | null }>({
    aadharCard: null,
    panCard: null
  });

  useEffect(() => {
    // Refresh user profile to get latest bank details/status from admin updates
    const { fetchProfile } = useAuthStore.getState();
    fetchProfile();
    
    fetchWalletData();
  }, [fetchWalletData]);

  const numAmount = parseFloat(amount) || 0;
  const isMatrix = selectedWallet === 'matrix';
  const fee = numAmount * 0.20;
  const net = numAmount - fee;

  const today = new Date();
  const isSaturday = today.getDay() === 6;
  const daysUntilSaturday = (6 - today.getDay() + 7) % 7 || 7;

  const handleKycFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'aadharCard' | 'panCard') => {
    if (e.target.files && e.target.files[0]) {
      setKycFiles({ ...kycFiles, [field]: e.target.files[0] });
    }
  };

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // KYC docs are optional
    if (!kycForm.accountNumber || !kycForm.ifscCode || !kycForm.accountHolderName || !kycForm.bankName) {
      showToast('Error', 'Please fill in all bank details', 'error');
      return;
    }

    setKycLoading(true);
    try {
      const formData = new FormData();
      if (kycFiles.aadharCard) formData.append('aadharCard', kycFiles.aadharCard);
      if (kycFiles.panCard) formData.append('panCard', kycFiles.panCard);
      formData.append('accountNumber', kycForm.accountNumber);
      formData.append('ifscCode', kycForm.ifscCode);
      formData.append('accountHolderName', kycForm.accountHolderName);
      formData.append('bankName', kycForm.bankName);

      const response = await authApi.submitKyc(formData);
      showToast('Success', response.message, 'success');

      // Update local user state to reflect approval
      updateUser({
        kyc: {
          status: 'approved',
          bankDetails: { ...kycForm }
        }
      });
    } catch (error: any) {
      showToast('Error', error.message || 'KYC submission failed', 'error');
    } finally {
      setKycLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (numAmount < 200) {
      showToast('Error', 'Minimum withdrawal is ₹200', 'error');
      return;
    }

    if (numAmount > 50000) {
      showToast('Error', 'Maximum withdrawal is ₹50,000', 'error');
      return;
    }

    const balance = isMatrix ? wallet.matrixWallet : wallet.balance;
    if (numAmount > balance) {
      showToast('Error', 'Insufficient wallet balance', 'error');
      return;
    }

    if (user?.kyc?.status !== 'approved') {
      showToast('KYC Required', 'Please complete your KYC before withdrawing.', 'error');
      return;
    }

    setLoading(true);
    try {
      // Backend now uses KYC bank details, so we pass empty/existing ones
      await processWithdrawal(numAmount, user.kyc.bankDetails, selectedWallet);
      showToast('Success', 'Withdrawal request submitted successfully.', 'success');
      setAmount('');
    } catch (error: any) {
      showToast('Error', error.message || 'Withdrawal request failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const kycStatus = user?.kyc?.status || 'not_submitted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6 md:space-y-8 pb-10"
    >
      {/* Header */}
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Finance</p>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Withdraw Funds</h2>
      </div>

      <AnimatePresence mode="wait">
        {kycStatus !== 'approved' ? (
          <motion.div
            key="kyc-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-6"
          >
            <div className={`glass-card dark:backdrop-blur-xl rounded-3xl p-6 flex flex-col items-center text-center gap-4 ${kycStatus === 'pending' ? 'bg-blue-50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20' : kycStatus === 'rejected' ? 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20' : 'bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20'}`}>
              <div className={`h-16 w-16 rounded-full flex items-center justify-center ${kycStatus === 'pending' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : kycStatus === 'rejected' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
                <Icon icon={kycStatus === 'pending' ? "solar:clock-circle-bold" : kycStatus === 'rejected' ? "solar:danger-bold" : "solar:shield-warning-bold"} width={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {kycStatus === 'pending' ? 'KYC Pending Review' : kycStatus === 'rejected' ? 'KYC Rejected' : 'KYC Required'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mt-1">
                  {kycStatus === 'pending'
                    ? "Your KYC application is currently under review by our team. You'll be able to withdraw funds once it's approved."
                    : kycStatus === 'rejected'
                      ? `Your KYC was rejected: ${user?.kyc?.rejectionReason || 'Please re-upload clear documents.'}`
                      : "To ensure secure transactions and comply with regulations, please complete your one-time KYC before your first withdrawal."}
                </p>
              </div>
            </div>

            {(kycStatus === 'not_submitted' || kycStatus === 'rejected') && (
              <form onSubmit={handleKycSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-card">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Icon icon="solar:user-id-bold" className="text-blue-600 dark:text-blue-400" /> Aadhar Card
                    </h3>
                    <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-3 ${kycFiles.aadharCard ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 bg-gray-50'}`}>
                      <Icon icon={kycFiles.aadharCard ? "solar:check-circle-bold" : "solar:upload-bold"} className={kycFiles.aadharCard ? "text-emerald-500" : "text-gray-400"} width={32} />
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{kycFiles.aadharCard ? kycFiles.aadharCard.name : 'Click to Upload Aadhar'}</p>
                      </div>
                      <input
                        type="file"
                        onChange={(e) => handleKycFileChange(e, 'aadharCard')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept=".jpg,.jpeg,.png,.pdf"
                      />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-card">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Icon icon="solar:bank-card-bold" className="text-amber-600 dark:text-amber-400" /> PAN Card
                    </h3>
                    <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-3 ${kycFiles.panCard ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 bg-gray-50'}`}>
                      <Icon icon={kycFiles.panCard ? "solar:check-circle-bold" : "solar:upload-bold"} className={kycFiles.panCard ? "text-emerald-500" : "text-gray-400"} width={32} />
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{kycFiles.panCard ? kycFiles.panCard.name : 'Click to Upload PAN'}</p>
                      </div>
                      <input
                        type="file"
                        onChange={(e) => handleKycFileChange(e, 'panCard')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept=".jpg,.jpeg,.png,.pdf"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 shadow-card">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Icon icon="solar:bank-bold" className="text-blue-600 dark:text-blue-400" /> Bank Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Account Holder Name</label>
                      <input
                        type="text"
                        value={kycForm.accountHolderName}
                        onChange={(e) => setKycForm({ ...kycForm, accountHolderName: e.target.value })}
                        placeholder="Full name as per bank"
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-bold rounded-xl py-3 px-4 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20 outline-none transition-all placeholder:text-gray-400"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Bank Name</label>
                      <input
                        type="text"
                        value={kycForm.bankName}
                        onChange={(e) => setKycForm({ ...kycForm, bankName: e.target.value })}
                        placeholder="e.g. State Bank of India"
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-bold rounded-xl py-3 px-4 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20 outline-none transition-all placeholder:text-gray-400"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Account Number</label>
                      <input
                        type="text"
                        value={kycForm.accountNumber}
                        onChange={(e) => setKycForm({ ...kycForm, accountNumber: e.target.value })}
                        placeholder="Enter account number"
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-bold rounded-xl py-3 px-4 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20 outline-none transition-all placeholder:text-gray-400"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">IFSC Code</label>
                      <input
                        type="text"
                        value={kycForm.ifscCode}
                        onChange={(e) => setKycForm({ ...kycForm, ifscCode: e.target.value.toUpperCase() })}
                        placeholder="SBIN00XXXXX"
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-bold rounded-xl py-3 px-4 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20 outline-none transition-all placeholder:text-gray-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={kycLoading}
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-[#070b14] font-bold py-4 rounded-xl shadow-lg click-scale transition-all flex items-center justify-center gap-2"
                >
                  {kycLoading ? (
                    <Icon icon="eos-icons:loading" className="animate-spin text-xl" />
                  ) : (
                    <>Complete KYC to Enable Withdrawals <Icon icon="solar:arrow-right-linear" /></>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="withdraw-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 md:space-y-8"
          >
            {/* Wallet Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedWallet('current')}
                className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${selectedWallet === 'current'
                  ? 'border-gray-900 bg-gray-50 dark:bg-gray-800 ring-2 ring-gray-900/5'
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <Icon icon="solar:wallet-bold" className={selectedWallet === 'current' ? 'text-gray-900 dark:text-white' : 'text-gray-400'} width={24} />
                  {selectedWallet === 'current' && <Icon icon="solar:check-circle-bold" className="text-gray-900 dark:text-white" width={20} />}
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Current Wallet</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">₹{wallet.balance.toLocaleString()}</p>
                  <p className="text-[10px] text-red-500 dark:text-red-400 font-bold mt-1">20% Admin Fee Applies</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedWallet('matrix')}
                className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${selectedWallet === 'matrix'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 ring-2 ring-emerald-500/5'
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <Icon icon="solar:crown-bold" className={selectedWallet === 'matrix' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'} width={24} />
                  {selectedWallet === 'matrix' && <Icon icon="solar:check-circle-bold" className="text-emerald-600 dark:text-emerald-400" width={20} />}
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Matrix Wallet</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">₹{wallet.matrixWallet.toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">20% Admin Fee Applies</p>
                </div>
              </button>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-5 rounded-2xl border border-gray-200 dark:border-white/5 flex items-center gap-4 glass-card-hover shadow-card">
                <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Icon icon="solar:wallet-money-bold" width={24} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide">Available</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white amount-value">₹{wallet.balance.toLocaleString()}</p>
                </div>
              </div>
              <div className="glass-card p-5 rounded-2xl border border-gray-200 dark:border-white/5 flex items-center gap-4 glass-card-hover shadow-card">
                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 flex items-center justify-center shrink-0">
                  <Icon icon="solar:calendar-bold" width={24} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide">Weekly Used</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white amount-value">
                    ₹{weekly.withdrawalUsed.toLocaleString()}<span className="text-gray-400 dark:text-gray-500 text-sm font-medium">/{weekly.withdrawalLimit.toLocaleString()}</span>
                  </p>
                </div>
              </div>
              <div className="glass-card p-5 rounded-2xl border border-gray-200 dark:border-white/5 flex items-center gap-4 glass-card-hover shadow-card">
                <div className="h-12 w-12 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Icon icon="solar:bill-list-bold" width={24} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide">Charge</p>
                    20%
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-4 flex items-center gap-3 ${isSaturday ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300' : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300'}`}>
              <Icon icon={isSaturday ? 'solar:check-circle-bold' : 'solar:calendar-mark-bold'} className="text-xl shrink-0" />
              <p className="text-xs font-bold uppercase tracking-wide">
                {isSaturday
                  ? <>Today is <span className="underline underline-offset-2">Saturday</span> — Admin approvals are active today!</>
                  : <>You can apply anytime. Admin processes approvals every <span className="underline underline-offset-2">Saturday</span> ({daysUntilSaturday} day{daysUntilSaturday !== 1 ? 's' : ''} away).</>
                }
              </p>
            </div>

            {/* Withdraw Form */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 shadow-card">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <Icon icon="solar:money-bag-bold" className="text-emerald-600 dark:text-emerald-400" /> Enter Withdrawal Amount
              </h3>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-900 dark:text-white font-bold text-2xl group-focus-within:text-gray-900 dark:text-white transition-colors">
                  ₹
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="₹200 - ₹50,000"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-2xl font-bold rounded-2xl py-4 pl-10 pr-4 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20 focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Bank Summary (Read-only since it's from KYC) */}
              <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-blue-900 flex items-center gap-2 uppercase tracking-wider">
                    <Icon icon="solar:bank-bold" className="text-blue-600 dark:text-blue-400" /> Disbursement Bank
                  </h3>
                  <Icon icon="solar:verified-check-bold" className="text-blue-600 dark:text-blue-400" width={18} />
                </div>
                <div className="grid grid-cols-2 gap-y-3">
                  <div>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400/70 uppercase font-bold">Holder</p>
                    <p className="text-sm font-bold text-blue-900">{user?.kyc?.bankDetails?.accountHolderName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400/70 uppercase font-bold">Account</p>
                    <p className="text-sm font-bold text-blue-900">•••• {user?.kyc?.bankDetails?.accountNumber?.slice(-4)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400/70 uppercase font-bold">IFSC</p>
                    <p className="text-sm font-bold text-blue-900">{user?.kyc?.bankDetails?.ifscCode}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400/70 uppercase font-bold">Bank</p>
                    <p className="text-sm font-bold text-blue-900">{user?.kyc?.bankDetails?.bankName}</p>
                  </div>
                </div>
              </div>

              {/* Calculation Preview */}
              <div className="mt-6 p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl space-y-3 border border-dashed border-gray-200 dark:border-gray-800">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium">Requested Amount</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{numAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium">Admin Fee (20%)</span>
                  <span className={`font-bold ${fee > 0 ? 'text-red-500 dark:text-red-400' : 'text-emerald-500'}`}>
                    {fee > 0 ? `-₹${fee.toLocaleString()}` : '₹0'}
                  </span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-700 dark:text-gray-300 dark:text-gray-600 text-sm">Net Payable</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xl md:text-2xl">₹{net.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={loading}
                className={`w-full mt-8 bg-gray-900 dark:bg-white shadow-lg text-white dark:text-[#070b14] font-bold py-4 rounded-xl click-scale transition-all flex items-center justify-center gap-2 text-sm md:text-base ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <Icon icon="eos-icons:loading" className="text-xl animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Confirm Withdrawal <Icon icon="solar:arrow-right-linear" className="text-lg" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
