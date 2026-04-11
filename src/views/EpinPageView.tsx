import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useToastStore } from '@/store/useToastStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from '@/components/CopyButton';

export const EpinPageView = () => {
    const { myEpins, fetchMyEpins, buyEpin, usePin, wallet } = useAppStore();
    const { showToast } = useToastStore();
    const [loading, setLoading] = useState(false);
    const [useForm, setUseForm] = useState({ pin: '', targetUsername: '' });
    const [useLoading, setUseLoading] = useState(false);

    useEffect(() => {
        fetchMyEpins();
    }, [fetchMyEpins]);

    const activePins = myEpins.filter(p => p.status === 'active');
    const usedPins = myEpins.filter(p => p.status === 'used');

    const handleBuy = async () => {
        if (wallet.balance < 1357) {
            showToast('Insufficient Balance', 'You need at least ₹1,357 to purchase an E-pin.', 'error');
            return;
        }

        setLoading(true);
        try {
            await buyEpin();
            showToast('Success', 'E-pin purchased successfully!', 'success');
            fetchMyEpins();
        } catch (error: any) {
            showToast('Error', error.message || 'Failed to purchase pin', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!useForm.pin || !useForm.targetUsername) {
            showToast('Required', 'Please enter both Pin and Username', 'error');
            return;
        }

        setUseLoading(true);
        try {
            await usePin(useForm.pin, useForm.targetUsername);
            showToast('Success', `User ${useForm.targetUsername} activated successfully!`, 'success');
            setUseForm({ pin: '', targetUsername: '' });
            fetchMyEpins();
        } catch (error: any) {
            showToast('Error', error.message || 'Activation failed', 'error');
        } finally {
            setUseLoading(false);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            status === 'active' 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
        }`}>
            {status}
        </span>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 md:space-y-8 pb-10"
        >
            {/* Header */}
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">E-Pin System</p>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">E-Pin Management</h2>
                    <button
                        onClick={handleBuy}
                        disabled={loading}
                        className="bg-gray-900 dark:bg-white text-white dark:text-[#070b14] px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-gray-200 dark:shadow-none click-scale transition-all"
                    >
                        {loading ? <Icon icon="eos-icons:loading" className="animate-spin" /> : <Icon icon="solar:ticket-bold" />}
                        Buy New E-Pin (₹1,357)
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-card">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <Icon icon="solar:ticket-linear" width={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Total Pins</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{myEpins.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-card">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <Icon icon="solar:check-circle-linear" width={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Active Pins</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{activePins.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-card">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                            <Icon icon="solar:history-linear" width={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Used Pins</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{usedPins.length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lists */}
                <div className="flex flex-col gap-6 lg:col-span-2">
                    <Tabs defaultValue="active" className="w-full">
                        <TabsList className="bg-gray-100/50 dark:bg-white/5 p-1 rounded-xl mb-6">
                            <TabsTrigger value="active" className="rounded-lg font-bold text-xs uppercase tracking-wider py-2">
                                Active Pins ({activePins.length})
                            </TabsTrigger>
                            <TabsTrigger value="used" className="rounded-lg font-bold text-xs uppercase tracking-wider py-2">
                                Used History ({usedPins.length})
                            </TabsTrigger>
                        </TabsList>

                        <AnimatePresence mode="wait">
                            <TabsContent value="active">
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    className="space-y-3"
                                >
                                    {activePins.length === 0 ? (
                                        <div className="text-center py-12 glass-card rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                                            <Icon icon="solar:ticket-broken" className="mx-auto text-gray-300 dark:text-gray-700 mb-2" width={48} />
                                            <p className="text-gray-400 font-medium">No active E-pins found</p>
                                        </div>
                                    ) : (
                                        activePins.map(pin => (
                                            <div key={pin._id} className="glass-card p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                                                        <Icon icon="solar:ticket-bold" className="text-indigo-500" width={20} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <code className="text-sm font-bold text-gray-900 dark:text-white font-mono tracking-wider">{pin.pin}</code>
                                                            <CopyButton value={pin.pin} className="scale-75 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(pin.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <StatusBadge status={pin.status} />
                                                    <button 
                                                        onClick={() => setUseForm({ ...useForm, pin: pin.pin })}
                                                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-2"
                                                    >
                                                        Use Now
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </motion.div>
                            </TabsContent>

                            <TabsContent value="used">
                                <motion.div 
                                    initial={{ opacity: 0, x: 10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    className="space-y-3"
                                >
                                    {usedPins.length === 0 ? (
                                        <div className="text-center py-12 glass-card rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                                            <p className="text-gray-400 font-medium">No used pins yet</p>
                                        </div>
                                    ) : (
                                        usedPins.map(pin => (
                                            <div key={pin._id} className="glass-card p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between opacity-80">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                                                        <Icon icon="solar:ticket-linear" className="text-gray-400" width={20} />
                                                    </div>
                                                    <div>
                                                        <code className="text-sm font-bold text-gray-400 font-mono line-through">{pin.pin}</code>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Used on: {pin.usedAt ? new Date(pin.usedAt).toLocaleDateString() : 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <StatusBadge status={pin.status} />
                                                    {pin.usedBy && (
                                                        <p className="text-[10px] text-gray-400 font-medium mt-1">By: @{pin.usedBy.username || 'user'}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </motion.div>
                            </TabsContent>
                        </AnimatePresence>
                    </Tabs>
                </div>

                {/* Activation Form */}
                <div className="space-y-6">
                    <div className="glass-card p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-card sticky top-24">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Icon icon="solar:user-plus-bold" className="text-indigo-600 dark:text-indigo-400" /> Member Activation
                        </h3>
                        <form onSubmit={handleUse} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] px-1">Enter E-Pin</label>
                                <div className="relative">
                                    <Icon icon="solar:ticket-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={useForm.pin}
                                        onChange={(e) => setUseForm({ ...useForm, pin: e.target.value.toUpperCase() })}
                                        placeholder="PXXXXXXX"
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-300 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] px-1">Target Username</label>
                                <div className="relative">
                                    <Icon icon="solar:user-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={useForm.targetUsername}
                                        onChange={(e) => setUseForm({ ...useForm, targetUsername: e.target.value.toLowerCase() })}
                                        placeholder="username to activate"
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-300 dark:text-white"
                                    />
                                </div>
                            </div>
                            
                            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/10 mb-2">
                                <div className="flex gap-3">
                                    <Icon icon="solar:info-circle-bold" className="text-amber-600" width={18} />
                                    <p className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase leading-snug tracking-wide">
                                        Using a pin will instantly verify the target user and place them in the matrix.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={useLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg click-scale transition-all flex items-center justify-center gap-2 mt-2"
                            >
                                {useLoading ? <Icon icon="eos-icons:loading" className="animate-spin text-xl" /> : 'Activate Member Now'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
