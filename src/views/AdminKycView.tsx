import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi } from '@/lib/api';
import { useToastStore } from '@/store/useToastStore';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5005' : '');

const getPhotoUrl = (path: string | undefined) => {
    if (!path) return null;
    if (path.startsWith('http')) return path; // Handle Cloudinary absolute URLs
    // Normalize backslashes and prepend server base
    return `${API_BASE}/${path.replace(/\\/g, '/')}`;
};

type KycStatus = 'all' | 'pending' | 'approved' | 'rejected';

interface KycUser {
    _id: string;
    fullname: string;
    username: string;
    email: string;
    kyc: {
        status: string;
        aadharCard?: string;
        panCard?: string;
        submittedAt?: string;
        approvedAt?: string;
        rejectionReason?: string;
        bankDetails?: {
            accountNumber?: string;
            ifscCode?: string;
            accountHolderName?: string;
            bankName?: string;
        };
    };
}

export const AdminKycView = () => {
    const [allUsers, setAllUsers] = useState<KycUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<KycStatus>('all');
    const [lightbox, setLightbox] = useState<{ url: string; label: string } | null>(null);
    const { showToast } = useToastStore();

    const fetchKyc = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getPendingKyc();
            setAllUsers(response.pendingKycUsers || []);
        } catch (error: any) {
            showToast('Error', error.message || 'Failed to fetch KYC records', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchKyc(); }, []);

    const handleApprove = async (userId: string) => {
        setActionLoading(userId);
        try {
            await adminApi.approveKyc(userId);
            showToast('Success', 'KYC approved successfully', 'success');
            setAllUsers(prev => prev.map(u => u._id === userId ? { ...u, kyc: { ...u.kyc, status: 'approved' } } : u));
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
            await adminApi.rejectKyc(userId, reason || 'KYC verification failed');
            showToast('Success', 'KYC rejected', 'success');
            setAllUsers(prev => prev.map(u => u._id === userId ? { ...u, kyc: { ...u.kyc, status: 'rejected', rejectionReason: reason } } : u));
        } catch (error: any) {
            showToast('Error', error.message || 'Rejection failed', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const filtered = statusFilter === 'all' ? allUsers : allUsers.filter(u => u.kyc.status === statusFilter);

    const counts = {
        all: allUsers.length,
        pending: allUsers.filter(u => u.kyc.status === 'pending').length,
        approved: allUsers.filter(u => u.kyc.status === 'approved').length,
        rejected: allUsers.filter(u => u.kyc.status === 'rejected').length,
    };

    const statusConfig: Record<string, { color: string; bg: string; border: string; icon: string }> = {
        approved: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'solar:check-circle-bold' },
        pending:  { color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   icon: 'solar:clock-circle-bold' },
        rejected: { color: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    icon: 'solar:close-circle-bold' },
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex justify-between items-center px-1">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">KYC Document Review</h3>
                    <p className="text-xs text-slate-500 mt-0.5">View and verify user identity & bank documents</p>
                </div>
                <button onClick={fetchKyc} className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-indigo-500 transition-colors">
                    <Icon icon="solar:restart-bold" className="text-base" />
                </button>
            </div>

            {/* Status filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {(['all', 'pending', 'approved', 'rejected'] as KycStatus[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setStatusFilter(tab)}
                        className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all ${
                            statusFilter === tab
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        {tab} <span className="opacity-70">({counts[tab]})</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Icon icon="eos-icons:loading" className="text-4xl text-indigo-500 animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="glass-card rounded-[2rem] p-20 text-center flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 text-3xl">
                        <Icon icon="solar:document-bold-duotone" />
                    </div>
                    <p className="text-slate-500 font-bold text-sm">No KYC records found for this filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {filtered.map((user) => {
                        const cfg = statusConfig[user.kyc.status] || statusConfig.pending;
                        const aadharUrl = getPhotoUrl(user.kyc.aadharCard);
                        const panUrl = getPhotoUrl(user.kyc.panCard);
                        const isLoading = actionLoading === user._id;

                        return (
                            <motion.div
                                key={user._id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card rounded-[2rem] p-6 border-none shadow-2xl bg-white/50 dark:bg-[#0f172a]/60 overflow-hidden"
                            >
                                {/* User header */}
                                <div className="flex items-start justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-11 w-11 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-lg border border-indigo-500/20">
                                            {user.fullname?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{user.fullname}</p>
                                            <p className="text-[10px] text-slate-500 font-bold tracking-wider">@{user.username}</p>
                                            <p className="text-[10px] text-indigo-400 lowercase">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                                        <Icon icon={cfg.icon} className="text-sm" />
                                        {user.kyc.status}
                                    </span>
                                </div>

                                {/* Document Photo Cards */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {/* Aadhar */}
                                    <div
                                        onClick={() => aadharUrl && setLightbox({ url: aadharUrl, label: `${user.fullname} — Aadhar Card` })}
                                        className={`relative rounded-2xl overflow-hidden border-2 border-dashed transition-all group ${aadharUrl ? 'border-blue-500/30 cursor-pointer hover:border-blue-500/60' : 'border-slate-300 dark:border-white/10'}`}
                                        style={{ aspectRatio: '4/3' }}
                                    >
                                        {aadharUrl ? (
                                            <>
                                                <img
                                                    src={aadharUrl}
                                                    alt="Aadhar Card"
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                                    <span className="text-white text-[10px] font-bold flex items-center gap-1">
                                                        <Icon icon="solar:eye-bold" /> View Full
                                                    </span>
                                                </div>
                                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                                                    Aadhar
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full gap-1 p-4">
                                                <Icon icon="solar:document-bold" className="text-2xl text-slate-300 dark:text-slate-600" />
                                                <span className="text-[9px] text-slate-400 font-bold uppercase text-center">Aadhar<br/>Not Uploaded</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* PAN */}
                                    <div
                                        onClick={() => panUrl && setLightbox({ url: panUrl, label: `${user.fullname} — PAN Card` })}
                                        className={`relative rounded-2xl overflow-hidden border-2 border-dashed transition-all group ${panUrl ? 'border-amber-500/30 cursor-pointer hover:border-amber-500/60' : 'border-slate-300 dark:border-white/10'}`}
                                        style={{ aspectRatio: '4/3' }}
                                    >
                                        {panUrl ? (
                                            <>
                                                <img
                                                    src={panUrl}
                                                    alt="PAN Card"
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                                    <span className="text-white text-[10px] font-bold flex items-center gap-1">
                                                        <Icon icon="solar:eye-bold" /> View Full
                                                    </span>
                                                </div>
                                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                                                    PAN
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full gap-1 p-4">
                                                <Icon icon="solar:card-bold" className="text-2xl text-slate-300 dark:text-slate-600" />
                                                <span className="text-[9px] text-slate-400 font-bold uppercase text-center">PAN<br/>Not Uploaded</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bank Details */}
                                {user.kyc.bankDetails && (
                                    <div className="bg-slate-100/60 dark:bg-white/5 rounded-2xl p-3 mb-4 space-y-1 border border-slate-200/50 dark:border-white/5">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                            <Icon icon="solar:bank-bold" className="text-indigo-400" /> Bank Details
                                        </p>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                                            <div><span className="text-slate-500">Holder: </span><span className="font-bold text-slate-900 dark:text-white">{user.kyc.bankDetails.accountHolderName || '—'}</span></div>
                                            <div><span className="text-slate-500">Bank: </span><span className="font-bold text-slate-900 dark:text-white">{user.kyc.bankDetails.bankName || '—'}</span></div>
                                            <div><span className="text-slate-500">Account: </span><span className="font-bold text-slate-900 dark:text-white font-mono select-all">{user.kyc.bankDetails.accountNumber || '—'}</span></div>
                                            <div><span className="text-slate-500">IFSC: </span><span className="font-bold text-slate-900 dark:text-white font-mono">{user.kyc.bankDetails.ifscCode || '—'}</span></div>
                                        </div>
                                    </div>
                                )}

                                {/* Meta + Actions */}
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] text-slate-400">
                                        Submitted: {user.kyc.submittedAt ? new Date(user.kyc.submittedAt).toLocaleDateString() : '—'}
                                    </p>
                                    {user.kyc.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleReject(user._id)}
                                                disabled={isLoading}
                                                className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"
                                            >
                                                {isLoading ? <Icon icon="eos-icons:loading" className="animate-spin" /> : 'Reject'}
                                            </button>
                                            <button
                                                onClick={() => handleApprove(user._id)}
                                                disabled={isLoading}
                                                className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
                                            >
                                                {isLoading ? <Icon icon="eos-icons:loading" className="animate-spin" /> : <><Icon icon="solar:check-bold" /> Approve</>}
                                            </button>
                                        </div>
                                    )}
                                    {user.kyc.status === 'rejected' && user.kyc.rejectionReason && (
                                        <p className="text-[10px] text-rose-400 font-bold max-w-[200px] text-right truncate" title={user.kyc.rejectionReason}>
                                            ✗ {user.kyc.rejectionReason}
                                        </p>
                                    )}
                                    {user.kyc.status === 'approved' && (
                                        <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                            <Icon icon="solar:verified-check-bold" /> Verified
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setLightbox(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            className="relative max-w-3xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-white font-bold text-sm truncate">{lightbox.label}</p>
                                <button
                                    onClick={() => setLightbox(null)}
                                    className="h-8 w-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all"
                                >
                                    <Icon icon="solar:close-bold" />
                                </button>
                            </div>
                            <img
                                src={lightbox.url}
                                alt={lightbox.label}
                                className="w-full rounded-2xl shadow-2xl max-h-[80vh] object-contain bg-slate-900"
                            />
                            <div className="flex gap-3 mt-3 justify-center">
                                <a
                                    href={lightbox.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/20 transition-all flex items-center gap-1.5"
                                >
                                    <Icon icon="solar:external-link-bold" /> Open in New Tab
                                </a>
                                <a
                                    href={lightbox.url}
                                    download
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-1.5"
                                >
                                    <Icon icon="solar:download-bold" /> Download
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
