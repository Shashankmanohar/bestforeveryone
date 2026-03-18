import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi, epinApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { PageHeader } from '@/components/PageHeader';

export const ActivateOthers = () => {
    const { user, updateUser } = useAuthStore();
    const { fetchMatrixStatus } = useAppStore();
    const [targetUsername, setTargetUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pin, setPin] = useState('');
    const [epins, setEpins] = useState([]);

    const fetchMyEpins = async () => {
        try {
            const data = await epinApi.getMyEpins();
            setEpins(data.epins);
        } catch (error) {
            console.error('Failed to fetch E-pins:', error);
        }
    };

    useEffect(() => {
        fetchMyEpins();
    }, []);

    const handleActivate = async () => {
        if (!targetUsername.trim()) {
            setError('Please enter a username');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await epinApi.use(pin.trim(), targetUsername.trim());

            setSuccess(response.message);
            setTargetUsername('');
            setPin('');
            setShowConfirm(false);
            fetchMyEpins(); // Refresh pins list
            fetchMatrixStatus(); // Refresh matrix cycle if user themselves was the parent/referral target
        } catch (err: any) {
            setError(err.message || 'Activation failed');
            setShowConfirm(false);
        } finally {
            setLoading(false);
        }
    };

    // const canAfford = (user?.wallet?.balance || 0) >= 1180;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 md:space-y-8"
        >
            <PageHeader title="Activate Others" subtitle="Use your balance to help others" />

            {/* Wallet Info - Removed balance check visual as only E-pin is used now */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
                <div className="relative z-10">
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">E-pin Activation</p>
                    <h3 className="text-3xl font-bold text-white">Activate Accounts</h3>
                    <p className="mt-2 text-sm text-blue-100 opacity-80">Enter a username and use an E-pin to activate their account.</p>
                </div>
                <Icon
                    icon="solar:ticket-bold-duotone"
                    className="absolute -right-4 -bottom-4 text-white/10"
                    width={140}
                />
            </div>

            {/* Activation Form */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-card space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-600 ml-1">Account Username</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <Icon icon="solar:user-bold" width={20} />
                        </div>
                        <input
                            type="text"
                            value={targetUsername}
                            onChange={(e) => setTargetUsername(e.target.value)}
                            placeholder="Enter username (e.g. john_doe)"
                            className="block w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-600 ml-1">E-pin Code</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Icon icon="solar:ticket-bold" width={20} />
                            </div>
                            <input
                                type="text"
                                value={pin}
                                onChange={(e) => setPin(e.target.value.toUpperCase())}
                                placeholder="Enter E-pin code"
                                className="block w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2"
                    >
                        <Icon icon="solar:danger-bold" width={18} />
                        {error}
                    </motion.div>
                )}

                {success && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2"
                    >
                        <Icon icon="solar:check-circle-bold" width={18} />
                        {success}
                    </motion.div>
                )}

                <button
                    disabled={!targetUsername.trim() || !pin.trim() || loading}
                    onClick={() => setShowConfirm(true)}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold shadow-lg hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:bg-gray-400 transition-all click-scale flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Icon icon="solar:ticket-bold" width={20} />
                            Activate Account with E-pin
                        </>
                    )}
                </button>
            </div>

            {/* Available E-pins Section */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-card space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">My Available E-pins</h3>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                        {epins.filter((e: any) => e.status === 'active').length} Available
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                    {epins.filter((e: any) => e.status === 'active').length > 0 ? (
                        epins.filter((e: any) => e.status === 'active').map((e: any) => (
                            <button
                                key={e._id}
                                onClick={() => {
                                    setPin(e.pin);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-blue-200 hover:bg-blue-50 dark:bg-blue-900/30/50 transition-all text-left click-scale"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:text-blue-400 transition-colors shadow-sm">
                                        <Icon icon="solar:ticket-bold" width={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-700 transition-colors">{e.pin}</p>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium">Click to use</p>
                                    </div>
                                </div>
                                <Icon icon="solar:round-alt-arrow-right-bold" className="text-gray-300 dark:text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" width={20} />
                            </button>
                        ))
                    ) : (
                        <div className="col-span-full py-8 text-center text-gray-400 dark:text-gray-500 text-sm italic">
                            No unused E-pins available
                        </div>
                    )}
                </div>
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
                            className="bg-white dark:bg-gray-900 rounded-[32px] p-8 max-w-sm w-full relative z-10 shadow-2xl text-center"
                        >
                            <div className="h-16 w-16 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Icon icon="solar:question-square-bold" width={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Confirm Activation</h3>
                            <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm mb-6 px-2">
                                You are about to use E-pin <span className="text-blue-600 dark:text-blue-400 font-bold">{pin}</span> to activate <span className="text-blue-600 dark:text-blue-400 font-bold">@{targetUsername}</span>. This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    disabled={loading}
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 py-4 px-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 dark:text-gray-500 rounded-2xl text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-5 rounded-2xl flex gap-3">
                <Icon icon="solar:info-square-bold" className="text-amber-500 shrink-0 mt-0.5" width={20} />
                <div className="space-y-1">
                    <p className="text-xs font-bold text-amber-900 dark:text-amber-200 italic">Important Note</p>
                    <p className="text-[10px] sm:text-xs text-amber-800 leading-relaxed">
                        Ensuring the correct username is your responsibility. Funds will be deducted immediately upon confirmation. Activated users will receive an notification in their dashboard.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
