import { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { PageHeader } from '@/components/PageHeader';

export const ActivateOthers = () => {
    const { user, updateUser } = useAuthStore();
    const [targetUsername, setTargetUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleActivate = async () => {
        if (!targetUsername.trim()) {
            setError('Please enter a username');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await authApi.activateOther(targetUsername.trim());
            setSuccess(response.message);
            // Update local user balance
            if (response.newBalance !== undefined) {
                updateUser({
                    wallet: {
                        ...user?.wallet,
                        balance: response.newBalance
                    }
                });
            }
            setTargetUsername('');
            setShowConfirm(false);
        } catch (err: any) {
            setError(err.message || 'Activation failed');
            setShowConfirm(false);
        } finally {
            setLoading(false);
        }
    };

    const canAfford = (user?.wallet?.balance || 0) >= 1180;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 md:space-y-8"
        >
            <PageHeader title="Activate Others" subtitle="Use your balance to help others" />

            {/* Wallet Info */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
                <div className="relative z-10">
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Available Balance</p>
                    <h3 className="text-3xl font-bold">₹{user?.wallet?.balance?.toLocaleString()}</h3>
                    <div className="mt-4 flex items-center gap-2 text-xs">
                        <div className={`h-2 w-2 rounded-full ${canAfford ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span className="font-medium">
                            {canAfford
                                ? 'You have enough balance to activate a user'
                                : `You need ₹${(1180 - (user?.wallet?.balance || 0)).toLocaleString()} more for activation`}
                        </span>
                    </div>
                </div>
                <Icon
                    icon="solar:wallet-money-bold-duotone"
                    className="absolute -right-4 -bottom-4 text-white/10"
                    width={140}
                />
            </div>

            {/* Activation Form */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-card space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Account Username</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <Icon icon="solar:user-bold" width={20} />
                        </div>
                        <input
                            type="text"
                            value={targetUsername}
                            onChange={(e) => setTargetUsername(e.target.value)}
                            placeholder="Enter username (e.g. john_doe)"
                            className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-2"
                    >
                        <Icon icon="solar:danger-bold" width={18} />
                        {error}
                    </motion.div>
                )}

                {success && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold flex items-center gap-2"
                    >
                        <Icon icon="solar:check-circle-bold" width={18} />
                        {success}
                    </motion.div>
                )}

                <button
                    disabled={!canAfford || !targetUsername.trim() || loading}
                    onClick={() => setShowConfirm(true)}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold shadow-lg hover:bg-gray-800 disabled:opacity-50 disabled:bg-gray-400 transition-all click-scale flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Icon icon="solar:user-plus-bold" width={20} />
                            Activate Account (₹1,180)
                        </>
                    )}
                </button>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => !loading && setShowConfirm(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[32px] p-8 max-w-sm w-full relative z-10 shadow-2xl text-center"
                        >
                            <div className="h-16 w-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Icon icon="solar:question-square-bold" width={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Activation</h3>
                            <p className="text-gray-500 text-sm mb-6 px-2">
                                You are about to deduct <span className="text-gray-900 font-bold">₹1,180</span> from your balance to activate <span className="text-blue-600 font-bold">@{targetUsername}</span>. This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    disabled={loading}
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 py-4 px-4 bg-gray-100 text-gray-600 rounded-2xl text-xs font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={loading}
                                    onClick={handleActivate}
                                    className="flex-1 py-4 px-4 bg-blue-600 text-white rounded-2xl text-xs font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center"
                                >
                                    {loading ? (
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        'Yes, Activate'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Note Column */}
            <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl flex gap-3">
                <Icon icon="solar:info-square-bold" className="text-amber-500 shrink-0 mt-0.5" width={20} />
                <div className="space-y-1">
                    <p className="text-xs font-bold text-amber-900 italic">Important Note</p>
                    <p className="text-[10px] sm:text-xs text-amber-800 leading-relaxed">
                        Ensuring the correct username is your responsibility. Funds will be deducted immediately upon confirmation. Activated users will receive an notification in their dashboard.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
