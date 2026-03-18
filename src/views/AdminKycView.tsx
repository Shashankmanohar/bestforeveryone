import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';
import { useToastStore } from '@/store/useToastStore';

export const AdminKycView = () => {
    const [pendingUsers, setPendingUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const { showToast } = useToastStore();

    const fetchPendingKyc = async () => {
        try {
            const response = await adminApi.getPendingKyc();
            setPendingUsers(response.pendingKycUsers);
        } catch (error: any) {
            showToast('Error', error.message || 'Failed to fetch KYC requests', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingKyc();
    }, []);

    const handleApprove = async (userId: string) => {
        setActionLoading(userId);
        try {
            await adminApi.approveKyc(userId);
            showToast('Success', 'KYC approved successfully', 'success');
            setPendingUsers(pendingUsers.filter(u => u._id !== userId));
        } catch (error: any) {
            showToast('Error', error.message || 'Approval failed', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (userId: string) => {
        const reason = window.prompt('Enter rejection reason:');
        if (reason === null) return;

        setActionLoading(userId);
        try {
            await adminApi.rejectKyc(userId, reason);
            showToast('Success', 'KYC rejected', 'success');
            setPendingUsers(pendingUsers.filter(u => u._id !== userId));
        } catch (error: any) {
            showToast('Error', error.message || 'Rejection failed', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Icon icon="eos-icons:loading" className="text-4xl text-gray-400 dark:text-gray-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">KYC Requests</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage user document verifications</p>
                </div>
                <div className="bg-amber-100 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold">
                    {pendingUsers.length} Pending
                </div>
            </div>

            {pendingUsers.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-20 text-center shadow-card">
                    <Icon icon="solar:check-read-linear" className="mx-auto text-gray-300 dark:text-gray-600 mb-4" width={48} />
                    <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium">All caught up! No pending KYC requests.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {pendingUsers.map((user) => (
                        <motion.div
                            key={user._id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-card overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-gray-400 dark:text-gray-500 capitalize text-lg">
                                        {user.fullname[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{user.fullname}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 tracking-tight">@{user.username} • {user.email}</p>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase mt-1">Submitted: {new Date(user.kyc.submittedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <a
                                        href={`http://localhost:5005/${user.kyc.aadharCard.replace(/\\/g, '/')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg border border-blue-100 dark:border-blue-800 hover:bg-blue-100 transition-colors"
                                    >
                                        <Icon icon="solar:file-text-bold" /> Aadhar Card
                                    </a>
                                    <a
                                        href={`http://localhost:5005/${user.kyc.panCard.replace(/\\/g, '/')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-100 dark:border-amber-800 hover:bg-amber-100 transition-colors"
                                    >
                                        <Icon icon="solar:bank-card-bold" /> PAN Card
                                    </a>
                                    <div className="col-span-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-800 text-[10px]">
                                        <p className="text-gray-400 dark:text-gray-500 uppercase font-bold mb-1">Bank Account</p>
                                        <p className="font-bold text-gray-900 dark:text-white truncate">
                                            {user.kyc.bankDetails.bankName} • {user.kyc.bankDetails.accountNumber} • {user.kyc.bankDetails.ifscCode}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleReject(user._id)}
                                        disabled={actionLoading === user._id}
                                        className="p-2.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 rounded-xl transition-colors border border-red-100 dark:border-red-800"
                                        title="Reject KYC"
                                    >
                                        <Icon icon="solar:close-circle-bold" width={20} />
                                    </button>
                                    <button
                                        onClick={() => handleApprove(user._id)}
                                        disabled={actionLoading === user._id}
                                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
                                    >
                                        {actionLoading === user._id ? <Icon icon="eos-icons:loading" className="animate-spin" /> : <Icon icon="solar:check-read-bold" />} Approve
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
