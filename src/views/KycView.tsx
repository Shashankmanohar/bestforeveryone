import { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { PageHeader } from '@/components/PageHeader';

export const KycView = () => {
    const { user, updateUser } = useAuthStore();
    const { showToast } = useToastStore();
    const [loading, setLoading] = useState(false);
    const [bankDetails, setBankDetails] = useState({
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        bankName: ''
    });
    const [files, setFiles] = useState<{ aadharCard: File | null; panCard: File | null }>({
        aadharCard: null,
        panCard: null
    });

    const kycStatus = user?.kyc?.status || 'not_submitted';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'aadharCard' | 'panCard') => {
        if (e.target.files && e.target.files[0]) {
            setFiles({ ...files, [field]: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // KYC docs are optional
        if (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolderName || !bankDetails.bankName) {
            showToast('Error', 'Please fill in all bank details', 'error');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            if (files.aadharCard) formData.append('aadharCard', files.aadharCard);
            if (files.panCard) formData.append('panCard', files.panCard);
            formData.append('accountNumber', bankDetails.accountNumber);
            formData.append('ifscCode', bankDetails.ifscCode);
            formData.append('accountHolderName', bankDetails.accountHolderName);
            formData.append('bankName', bankDetails.bankName);

            const response = await authApi.submitKyc(formData);
            showToast('Success', response.message, 'success');

            // Update local user state
            updateUser({
                kyc: {
                    status: 'approved',
                    bankDetails: { ...bankDetails }
                }
            });
        } catch (error: any) {
            showToast('Error', error.message || 'KYC submission failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (kycStatus === 'approved') {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-20 w-20 bg-emerald-100 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6">
                    <Icon icon="solar:verified-check-bold" width={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">KYC Verified</h2>
                <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 max-w-md">Your KYC has been approved. You can now withdraw your funds.</p>
            </div>
        );
    }

    if (kycStatus === 'pending') {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-20 w-20 bg-amber-100 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-6">
                    <Icon icon="solar:clock-circle-bold" width={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">KYC Pending</h2>
                <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 max-w-md">Your KYC application is under review. We'll notify you once it's processed.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 md:space-y-8 pb-10"
        >
            <PageHeader title="KYC Verification" subtitle="Upload documents to enable withdrawals" />

            {kycStatus === 'rejected' && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center gap-3 text-red-800">
                    <Icon icon="solar:danger-bold" className="text-xl shrink-0" />
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide">KYC Rejected</p>
                        <p className="text-sm">{user?.kyc?.rejectionReason || 'Please re-upload clear documents.'}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Document Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-card">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Icon icon="solar:user-id-bold" className="text-blue-600 dark:text-blue-400" /> Aadhar Card
                        </h3>
                        <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-3 ${files.aadharCard ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 bg-gray-50'}`}>
                            <Icon icon={files.aadharCard ? "solar:check-circle-bold" : "solar:upload-bold"} className={files.aadharCard ? "text-emerald-500" : "text-gray-400"} width={32} />
                            <div className="text-center">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{files.aadharCard ? files.aadharCard.name : 'Click to Upload Aadhar'}</p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest mt-1">Front and Back (PDF/JPG)</p>
                            </div>
                            <input
                                type="file"
                                onChange={(e) => handleFileChange(e, 'aadharCard')}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept=".jpg,.jpeg,.png,.pdf"
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-card">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Icon icon="solar:bank-card-bold" className="text-amber-600 dark:text-amber-400" /> PAN Card
                        </h3>
                        <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-3 ${files.panCard ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 bg-gray-50'}`}>
                            <Icon icon={files.panCard ? "solar:check-circle-bold" : "solar:upload-bold"} className={files.panCard ? "text-emerald-500" : "text-gray-400"} width={32} />
                            <div className="text-center">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{files.panCard ? files.panCard.name : 'Click to Upload PAN'}</p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest mt-1">Clear Photo ID (PDF/JPG)</p>
                            </div>
                            <input
                                type="file"
                                onChange={(e) => handleFileChange(e, 'panCard')}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept=".jpg,.jpeg,.png,.pdf"
                            />
                        </div>
                    </div>
                </div>

                {/* Bank Details */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 shadow-card">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Icon icon="solar:bank-bold" className="text-blue-600 dark:text-blue-400" /> Bank Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Account Holder Name</label>
                            <input
                                type="text"
                                value={bankDetails.accountHolderName}
                                onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                                placeholder="Full name as per bank"
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-sm font-bold rounded-xl py-3 px-4 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Bank Name</label>
                            <input
                                type="text"
                                value={bankDetails.bankName}
                                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                placeholder="e.g. State Bank of India"
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-sm font-bold rounded-xl py-3 px-4 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Account Number</label>
                            <input
                                type="text"
                                value={bankDetails.accountNumber}
                                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                placeholder="Enter account number"
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-sm font-bold rounded-xl py-3 px-4 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">IFSC Code</label>
                            <input
                                type="text"
                                value={bankDetails.ifscCode}
                                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                                placeholder="SBIN00XXXXX"
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-sm font-bold rounded-xl py-3 px-4 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white font-bold py-4 rounded-xl shadow-lg click-scale transition-all flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Icon icon="eos-icons:loading" className="text-xl animate-spin" /> Submitting...
                        </>
                    ) : (
                        <>
                            Submit KYC Application <Icon icon="solar:arrow-right-linear" className="text-lg" />
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
};
