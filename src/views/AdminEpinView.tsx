import { useState, useEffect } from 'react';
import { useAdminStore } from '@/store/useAdminStore';
import { Icon } from '@iconify/react';

export const AdminEpinView = () => {
    const { 
        epins, 
        pinStats, 
        loading, 
        fetchEpins, 
        fetchEpinStats, 
        generateEpins, 
        assignEpin 
    } = useAdminStore();

    const [quantity, setQuantity] = useState(1);
    const [amount, setAmount] = useState(1380);
    const [selectedPins, setSelectedPins] = useState<string[]>([]);
    const [isAssigningBulk, setIsAssigningBulk] = useState(false);
    const [targetUsername, setTargetUsername] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchEpins();
        fetchEpinStats();
    }, [fetchEpins, fetchEpinStats]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        try {
            await generateEpins(quantity, amount);
            setQuantity(1);
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleBulkAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedPins.length === 0) return;
        setIsProcessing(true);
        try {
            await assignEpin(selectedPins, targetUsername);
            setIsAssigningBulk(false);
            setTargetUsername('');
            setSelectedPins([]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleSelectAll = () => {
        const activePins = epins.filter(p => p.status === 'active').map(p => p._id);
        if (selectedPins.length === activePins.length) {
            setSelectedPins([]);
        } else {
            setSelectedPins(activePins);
        }
    };

    const togglePin = (id: string) => {
        setSelectedPins(prev => 
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                        E-Pin Management
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Generate, assign and track system E-Pins</p>
                </div>
                {selectedPins.length > 0 && (
                    <button 
                        onClick={() => setIsAssigningBulk(true)}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        <Icon icon="solar:user-plus-bold" />
                        Assign {selectedPins.length} Pins
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Pins" 
                    value={pinStats?.total || 0} 
                    icon="solar:ticket-bold-duotone" 
                    color="indigo" 
                />
                <StatCard 
                    title="Active Pins" 
                    value={pinStats?.active || 0} 
                    icon="solar:check-circle-bold-duotone" 
                    color="emerald" 
                />
                <StatCard 
                    title="Used Pins" 
                    value={pinStats?.used || 0} 
                    icon="solar:history-bold-duotone" 
                    color="rose" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Generation Form */}
                <div className="glass-card rounded-3xl p-6 border-none shadow-2xl bg-white dark:bg-white/5 h-fit">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Icon icon="solar:magic-stick-bold-duotone" className="text-indigo-500 text-lg" />
                        Bulk Generate Pins
                    </h3>
                    <form onSubmit={handleGenerate} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Quantity (Max 100)</label>
                            <input 
                                type="number" 
                                min="1" 
                                max="100"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Pin Value (Amount)</label>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value))}
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isGenerating}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <Icon icon="solar:restart-bold" className="animate-spin" />
                            ) : (
                                <Icon icon="solar:add-circle-bold" />
                            )}
                            Generate Pins
                        </button>
                    </form>
                </div>

                {/* Pin List */}
                <div className="lg:col-span-2 glass-card rounded-3xl border-none shadow-2xl overflow-hidden bg-white dark:bg-white/5">
                    <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Pin Inventory</h3>
                        <button onClick={() => fetchEpins()} className="text-indigo-500 hover:rotate-180 transition-transform duration-500">
                            <Icon icon="solar:restart-bold" className="text-lg" />
                        </button>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar max-h-[600px]">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-white dark:bg-[#0f172a] z-10">
                                <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200/50 dark:border-white/5">
                                    <th className="px-6 py-4 w-10">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-slate-300 dark:border-white/10"
                                            checked={epins.length > 0 && selectedPins.length === epins.filter(p => p.status === 'active').length}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pin Code</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Owner</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {epins.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">No Pins found</td>
                                    </tr>
                                ) : (
                                    epins.map((pin) => (
                                        <tr key={pin._id} className={`hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all group ${selectedPins.includes(pin._id) ? 'bg-indigo-500/5' : ''}`}>
                                            <td className="px-6 py-4">
                                                {pin.status === 'active' && !pin.owner?.username && (
                                                    <input 
                                                        type="checkbox" 
                                                        className="rounded border-slate-300 dark:border-white/10"
                                                        checked={selectedPins.includes(pin._id)}
                                                        onChange={() => togglePin(pin._id)}
                                                    />
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{pin.pin}</td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{pin.owner?.username || 'System'}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Value: ₹{pin.amount}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                                    pin.status === 'active' 
                                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                                        : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                                }`}>
                                                    {pin.status}
                                                </span>
                                                {pin.status === 'used' && pin.usedBy && (
                                                    <p className="text-[9px] text-slate-400 mt-1">Used by: {pin.usedBy?.username}</p>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Bulk Assign Modal */}
            {isAssigningBulk && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isProcessing && setIsAssigningBulk(false)} />
                    <div className="relative glass-card rounded-3xl p-8 max-w-sm w-full bg-white dark:bg-slate-900 shadow-2xl border-none animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 text-xl">
                                <Icon icon="solar:user-plus-bold-duotone" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Bulk Assign Pins</h4>
                                <p className="text-xs text-slate-500">{selectedPins.length} pins selected</p>
                            </div>
                        </div>

                        <form onSubmit={handleBulkAssign} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Target Username</label>
                                <input 
                                    type="text" 
                                    required
                                    value={targetUsername}
                                    onChange={(e) => setTargetUsername(e.target.value)}
                                    placeholder="Enter exact username"
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    type="button" 
                                    disabled={isProcessing}
                                    onClick={() => setIsAssigningBulk(false)}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isProcessing || !targetUsername}
                                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {isProcessing ? 'Processing...' : 'Confirm Transfer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
;

const StatCard = ({ title, value, icon, color }: { title: string; value: number | string; icon: string; color: string }) => (
    <div className="glass-card rounded-3xl p-6 border-none shadow-xl bg-white/50 dark:bg-white/5">
        <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-2xl bg-${color}-500/10 text-${color}-500 flex items-center justify-center text-2xl border border-${color}-500/20`}>
                <Icon icon={icon} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
            </div>
        </div>
    </div>
);
