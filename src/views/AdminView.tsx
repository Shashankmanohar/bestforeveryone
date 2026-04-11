import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminStore } from '@/store/useAdminStore';
import { useToast } from '@/hooks/use-toast';
import { Icon } from '@iconify/react';
import { useThemeStore } from '@/store/useThemeStore';
import { AdminEpinView } from './AdminEpinView';
import { AdminKycView } from './AdminKycView';
import adminApi from '@/lib/adminApi';

type ViewType = 'dashboard' | 'users' | 'payments' | 'withdrawals' | 'kyc' | 'ledger' | 'matrix' | 'completions' | 'epins' | 'settings';

export const AdminView = () => {
    const [currentView, setCurrentView] = useState<ViewType>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigate = useNavigate();
    const { logoutAdmin, admin } = useAuthStore();
    const {
        metrics,
        users,
        withdrawals,
        transactions,
        activities,
        pendingPayments,
        loading,
        error,
        fetchMetrics,
        fetchUsers,
        fetchWithdrawals,
        fetchLedger,
        fetchActivity,
        fetchPendingPayments,
        approvePayment,
        rejectPayment,
        royaltyStats,
        matrixTree,
        completedCycles,
        fetchRoyaltyStats,
        fetchMatrixTree,
        fetchCompletedCycles
    } = useAdminStore();
    const { theme, setTheme } = useThemeStore();

    useEffect(() => {
        const fetchData = () => {
            if (currentView === 'dashboard') {
                fetchMetrics();
                fetchRoyaltyStats();
                fetchActivity();
            } else if (currentView === 'users') {
                fetchUsers();
            } else if (currentView === 'payments') {
                fetchPendingPayments();
            } else if (currentView === 'withdrawals') {
                fetchWithdrawals();
            } else if (currentView === 'ledger') {
                fetchLedger();
            } else if (currentView === 'completions') {
                fetchCompletedCycles();
            } else if (currentView === 'epins') {
                const fetchEpinData = async () => {
                    const { fetchEpins, fetchEpinStats } = useAdminStore.getState();
                    await Promise.all([fetchEpins(), fetchEpinStats()]);
                };
                fetchEpinData();
            }
        };

        fetchData();

        const interval = setInterval(() => {
            if (currentView === 'dashboard' || currentView === 'payments') {
                fetchData();
            }
        }, 30000); // Poll every 30 seconds to save resources

        return () => clearInterval(interval);
    }, [currentView, fetchMetrics, fetchActivity, fetchUsers, fetchPendingPayments, fetchWithdrawals, fetchLedger]);

    const handleLogout = () => {
        logoutAdmin();
        navigate('/admin/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
            {/* Sidebar */}
            <aside
                className={`w-64 sidebar-gradient border-r border-slate-800/50 flex flex-col z-30 transition-all duration-300 absolute md:relative ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 h-full shadow-2xl`}
            >
                {/* Brand */}
                <div className="h-20 flex flex-col justify-center px-6 border-b border-slate-800/40 gap-1 bg-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                            B
                        </div>
                        <h1 className="text-sm font-bold text-white tracking-tight leading-none uppercase">
                            Best For Everyone
                        </h1>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    <NavItem icon="solar:widget-bold-duotone" label="Dashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
                    <NavItem icon="solar:users-group-two-rounded-bold-duotone" label="User Management" active={currentView === 'users'} onClick={() => setCurrentView('users')} />
                    <NavItem icon="solar:card-2-bold-duotone" label="Payment Approvals" active={currentView === 'payments'} onClick={() => setCurrentView('payments')} badge={pendingPayments.length} />
                    <NavItem icon="solar:card-send-bold-duotone" label="Withdrawals" active={currentView === 'withdrawals'} onClick={() => setCurrentView('withdrawals')} />
                    <NavItem icon="solar:shield-check-bold-duotone" label="KYC Documents" active={currentView === 'kyc'} onClick={() => setCurrentView('kyc')} />
                    <NavItem icon="solar:checklist-minimalistic-bold-duotone" label="Ledger & Royalty" active={currentView === 'ledger'} onClick={() => setCurrentView('ledger')} />
                    <NavItem icon="solar:layers-minimalistic-bold-duotone" label="Matrix Control" active={currentView === 'matrix'} onClick={() => setCurrentView('matrix')} />
                    <NavItem icon="solar:history-bold-duotone" label="Completed Cycles" active={currentView === 'completions'} onClick={() => setCurrentView('completions')} />
                    <NavItem icon="solar:ticket-bold-duotone" label="E-Pin Management" active={currentView === 'epins'} onClick={() => setCurrentView('epins')} />
                    <div className="pt-4 mt-4 border-t border-slate-800/50">
                        <NavItem icon="solar:settings-bold-duotone" label="System Settings" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} />
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-indigo-500/20">
                            AD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{admin?.fullname || 'Administrator'}</p>
                            <p className="text-[10px] text-slate-400 font-medium truncate uppercase tracking-wider">Super Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#020617] h-screen overflow-hidden transition-colors duration-300">
                <header className="h-20 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-4 md:px-8 z-20 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400"
                        >
                            <Icon icon={sidebarOpen ? "solar:close-circle-linear" : "solar:hamburger-menu-linear"} className="text-xl" />
                        </button>
                        <div className="hidden md:flex items-center gap-3 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 w-80 group focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50 transition-all">
                            <Icon icon="solar:magnifer-linear" className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search system commands..."
                                className="bg-transparent border-none outline-none text-xs font-medium w-full text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="h-9 w-9 rounded-xl bg-slate-100/50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all border border-transparent hover:border-amber-200/50"
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            <Icon icon={theme === 'dark' ? 'solar:sun-2-linear' : 'solar:moon-linear'} className="text-xl" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="h-9 w-9 rounded-xl bg-rose-50/50 dark:bg-rose-500/5 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all border border-transparent hover:border-rose-200/50"
                            title="Logout"
                        >
                            <Icon icon="solar:logout-3-linear" className="text-xl" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
                    {currentView === 'dashboard' && metrics && (
                        <DashboardContent
                            metrics={metrics}
                            royaltyStats={royaltyStats}
                            activities={activities}
                            onNavigate={setCurrentView}
                        />
                    )}
                    {currentView === 'users' && <UsersContent users={users} />}
                    {currentView === 'payments' && <PaymentsContent pendingPayments={pendingPayments} />}
                    {currentView === 'withdrawals' && <WithdrawalsContent withdrawals={withdrawals} />}
                    {currentView === 'ledger' && <LedgerContent transactions={transactions} />}
                    {currentView === 'matrix' && (
                        <MatrixContent
                            matrixTree={matrixTree}
                            onSearch={fetchMatrixTree}
                            loading={loading}
                        />
                    )}
                    {currentView === 'completions' && (
                        <CompletionsContent 
                            completions={completedCycles} 
                            onViewTree={(userId, cycle) => {
                                fetchMatrixTree(userId, cycle);
                                setCurrentView('matrix');
                            }}
                        />
                    )}
                    {currentView === 'epins' && <AdminEpinView />}
                    {currentView === 'kyc' && <AdminKycView />}
                    {currentView === 'settings' && <SettingsContent />}
                </div>
            </main>
        </div>
    );
};

// Navigation Item Component
const NavItem = ({ icon, label, active, onClick, badge }: { icon: string; label: string; active: boolean; onClick: () => void; badge?: number }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group ${active
            ? 'bg-indigo-600 text-white shadow-[0_4px_15px_rgba(79,70,229,0.4)]'
            : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
    >
        <Icon icon={icon} className={`text-lg transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110 group-hover:text-indigo-400'}`} />
        <span className="flex-1 text-left">{label}</span>
        {badge && badge > 0 && <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${active ? 'bg-white text-indigo-600' : 'bg-rose-500/20 text-rose-400'}`}>{badge}</span>}
    </button>
);

// Dashboard Content
const DashboardContent = ({ metrics, royaltyStats, activities, onNavigate }: { metrics: any; royaltyStats: any; activities: any[]; onNavigate: (view: ViewType) => void }) => (
    <div className="space-y-8 animate-in fade-in duration-400 max-w-7xl mx-auto">
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                    System Intelligence
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Real-time health and performance metrics</p>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard title="Revenue" value={`₹${metrics?.totalRevenue?.toLocaleString() || '0'}`} icon="solar:plain-bold-duotone" color="indigo" />
            <KPICard title="Active Global Pool" value={(metrics?.activeUsers || 0).toString()} icon="solar:users-group-rounded-bold-duotone" color="emerald" />
            <KPICard title="Pending Payouts" value={(metrics?.pendingWithdrawals || 0).toString()} icon="solar:wallet-bold-duotone" color="orange" onAction={() => onNavigate('withdrawals')} />
            <KPICard title="Pending IDs" value={(metrics?.pendingPayments || 0).toString()} icon="solar:card-send-bold-duotone" color="rose" onAction={() => onNavigate('payments')} />
        </div>

        {/* Royalty Stats Section */}
        {royaltyStats && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card rounded-3xl p-6 border-none shadow-xl bg-white/50 dark:bg-white/5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Icon icon="solar:star-bold-duotone" className="text-amber-500 text-lg" />
                        Weekly Royalty Breakdown
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Royalty Paid</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">₹{royaltyStats.totalPaid?.toLocaleString()}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                            <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Weekly Pool Payout</p>
                            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">₹{royaltyStats.weeklyPaid?.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card rounded-3xl p-6 border-none shadow-xl bg-white/50 dark:bg-white/5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Rank Distribution</h3>
                    <div className="space-y-4">
                        <RankProgress label="Star" count={royaltyStats.starCount || 0} color="blue" />
                        <RankProgress label="Double Star" count={royaltyStats.doubleStarCount || 0} color="purple" />
                        <RankProgress label="Super Star" count={royaltyStats.superStarCount || 0} color="amber" />
                    </div>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card rounded-3xl border-none shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Live System Logs</h3>
                    <div className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-bold uppercase tracking-wider">Auto Refreshing</div>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {activities.map((activity, idx) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 transition-all group">
                            <div className="h-10 w-10 rounded-xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-indigo-500 text-xl">
                                <Icon icon="solar:shield-check-bold-duotone" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{activity.description}</p>
                                    <span className="text-[10px] text-slate-400 font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] font-bold uppercase ${activity.status === 'credit' ? 'text-emerald-500' : 'text-rose-500'}`}>Amount: ₹{activity.amount}</span>
                                    <span className="text-slate-300 dark:text-slate-700">•</span>
                                    <span className="text-[10px] text-slate-400 font-medium">Tx Ref: #{idx + 10024}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-card rounded-3xl border-none shadow-2xl p-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-1/4 -translate-y-1/4">
                    <Icon icon="solar:crown-bold" className="text-[12rem]" />
                </div>
                <div className="relative z-10 h-full flex flex-col">
                    <h3 className="text-lg font-bold mb-2">Alpha Terminal</h3>
                    <p className="text-sm text-indigo-100 mb-8 opacity-80 leading-relaxed">Direct system control for manual income distribution and platform maintenance.</p>
                    <div className="mt-auto space-y-3">
                        <button onClick={() => onNavigate('ledger')} className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                            <Icon icon="solar:bolt-bold" className="text-lg" />
                            Go to Distribution Panel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const RankProgress = ({ label, count, color }: { label: string; count: number; color: string }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-500 dark:text-slate-400">{label}</span>
            <span className={`text-${color}-500`}>{count} Qualifiers</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full bg-${color}-500 rounded-full`} style={{ width: `${Math.min(100, (count / 100) * 100)}%` }}></div>
        </div>
    </div>
);

const MatrixContent = ({ matrixTree, onSearch, loading }: { matrixTree: any; onSearch: (id: string) => void; loading: boolean }) => {
    const [searchId, setSearchId] = useState('');

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Global Matrix Explorer</h3>
                    <p className="text-sm text-slate-500 mt-1">Visualize and audit any node in the global 1:6 hierarchy</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Enter User ID..."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="flex-1 md:w-64 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                    />
                    <button
                        onClick={() => onSearch(searchId)}
                        disabled={loading || !searchId}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Search Node'}
                    </button>
                </div>
            </div>

            {!matrixTree ? (
                <div className="glass-card rounded-[2.5rem] border-none shadow-2xl p-20 text-center flex flex-col items-center justify-center bg-white/50 dark:bg-white/5">
                    <div className="h-24 w-24 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 text-5xl mb-6">
                        <Icon icon="solar:globus-linear" />
                    </div>
                    <h4 className="text-slate-900 dark:text-white font-bold text-xl">Enter a User ID to start exploring</h4>
                    <p className="text-slate-500 text-sm mt-2 max-w-sm">Use the search bar above to fetch real-time matrix data for any specific member.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Parent/Target Node */}
                    <div className="flex justify-center">
                        <div className="glass-card rounded-3xl p-6 border-2 border-indigo-500/50 shadow-2xl bg-white dark:bg-slate-900 w-full max-w-xs text-center relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap shadow-lg">Current Parent</div>
                            <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl mx-auto flex items-center justify-center text-indigo-600 text-3xl mb-4 font-bold">
                                {matrixTree.user?.fullname?.charAt(0)}
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{matrixTree.user?.fullname}</h4>
                            <p className="text-xs text-slate-500 font-bold tracking-wider mb-2">@{matrixTree.user?.username}</p>
                            <div className="flex justify-center gap-1">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className={`h-2 w-2 rounded-full ${i < (matrixTree.level1?.length || 0) ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-200 dark:bg-white/10'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6">
                        {[...Array(6)].map((_, i) => {
                            const position = i + 1;
                            const member = matrixTree.level1?.find((m: any) => m.position === position);
                            const isFilled = !!member;
                            const isLatest = isFilled && member === [...(matrixTree.level1 || [])].sort((a: any, b: any) => 
                                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                            )[0];

                            return (
                                <div 
                                    key={position} 
                                    className={`glass-card rounded-[2rem] p-5 border shadow-xl w-full max-w-[170px] text-center transition-all duration-300 relative ${
                                        isFilled 
                                            ? isLatest
                                                ? 'bg-blue-50/50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 -translate-y-1'
                                                : 'bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' 
                                            : 'bg-white/40 dark:bg-white/5 border-slate-200 dark:border-white/5 opacity-60'
                                    } ${isFilled ? 'hover:-translate-y-2 cursor-pointer' : 'cursor-not-allowed'}`} 
                                    onClick={() => isFilled && onSearch(member.user?._id)}
                                >
                                    <div className={`h-11 w-11 rounded-xl mx-auto flex items-center justify-center text-lg font-bold mb-3 border relative ${
                                        isFilled
                                            ? isLatest
                                                ? 'bg-blue-500 text-white border-blue-400'
                                                : 'bg-emerald-500 text-white border-emerald-400'
                                            : 'bg-slate-100 dark:bg-white/10 text-slate-400 border-dashed border-slate-300 dark:border-white/10'
                                    }`}>
                                        {isFilled ? member.user?.fullname?.charAt(0) : position}
                                        {isLatest && (
                                            <div className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-blue-500 text-[6px] font-black text-white rounded-full animate-bounce shadow-lg ring-2 ring-white dark:ring-gray-900 z-20">
                                                NEW!
                                            </div>
                                        )}
                                    </div>
                                    <p className={`text-xs font-bold truncate ${isFilled ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                        {isFilled ? member.user?.fullname : 'Empty Slot'}
                                    </p>
                                    <p className={`text-[9px] font-bold tracking-tighter uppercase ${isFilled ? 'text-indigo-500' : 'text-slate-400'}`}>
                                        Pos {position}
                                    </p>
                                    {isFilled && (
                                        <button className="mt-1.5 text-[8px] font-bold text-indigo-500 uppercase flex items-center gap-1 mx-auto hover:text-indigo-600 transition-colors">
                                            Expand <Icon icon="solar:alt-arrow-right-linear" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const KPICard = ({ title, value, icon, color, onAction }: { title: string; value: string; icon: string; color: string; onAction?: () => void }) => (
    <div
        onClick={onAction}
        className={`glass-card rounded-3xl p-6 border-none shadow-xl hover:shadow-2xl transition-all duration-300 group ${onAction ? 'cursor-pointer hover:-translate-y-1' : ''}`}
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`h-12 w-12 rounded-2xl bg-${color}-500/10 text-${color}-500 flex items-center justify-center text-2xl border border-${color}-500/20 group-hover:scale-110 transition-transform`}>
                <Icon icon={icon} />
            </div>
            {onAction && <Icon icon="solar:alt-arrow-right-linear" className="text-slate-400 group-hover:text-indigo-500 transition-colors" />}
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight amount-value">{value}</h3>
    </div>
);


const UsersContent = ({ users }: { users: any[] }) => {
    const { updateUserStatus, approveKyc, rejectKyc, updateUserKycBankDetails } = useAdminStore();
    const [kycUser, setKycUser] = useState<any | null>(null);         // user whose KYC drawer is open
    const [kycLoading, setKycLoading] = useState(false);
    const [lightbox, setLightbox] = useState<{ url: string; label: string } | null>(null);
    const [kycActionLoading, setKycActionLoading] = useState(false);
    const [editingBank, setEditingBank] = useState(false);
    const [bankForm, setBankForm] = useState({ accountNumber: '', ifscCode: '', accountHolderName: '', bankName: '' });
    const { toast } = useToast();

    const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5005' : '');
    const getPhotoUrl = (path: string | undefined) => {
        if (!path) return null;
        if (path.startsWith('http')) return path; // Handle Cloudinary absolute URLs
        // Normalize backslashes and prepend server base
        return `${API_BASE}/${path.replace(/\\/g, '/')}`;
    };

    const openKyc = async (user: any) => {
        setKycUser(user);
        setEditingBank(false);
        // Pre-populate bank form from existing KYC
        setBankForm({
            accountNumber: user.kyc?.bankDetails?.accountNumber || '',
            ifscCode: user.kyc?.bankDetails?.ifscCode || '',
            accountHolderName: user.kyc?.bankDetails?.accountHolderName || '',
            bankName: user.kyc?.bankDetails?.bankName || '',
        });
    };

    const handleKycApprove = async () => {
        if (!kycUser) return;
        setKycActionLoading(true);
        try {
            await approveKyc(kycUser._id);
            // After re-fetch, kycUser in local state might still be old, but we want the drawer to stay open
            // We can find the updated user in the prop users list if needed, but for now just showing toast is enough
            setKycUser((prev: any) => ({ ...prev, kyc: { ...prev.kyc, status: 'approved' } }));
            toast({ title: 'KYC Approved', description: `${kycUser.fullname}'s KYC has been approved.` });
        } catch (e: any) {
            toast({ title: 'Error', description: e.message || 'Failed', variant: 'destructive' });
        } finally {
            setKycActionLoading(false);
        }
    };

    const handleKycReject = async () => {
        if (!kycUser) return;
        const reason = window.prompt('Enter rejection reason:');
        if (!reason) return;
        setKycActionLoading(true);
        try {
            await rejectKyc(kycUser._id, reason);
            setKycUser((prev: any) => ({ ...prev, kyc: { ...prev.kyc, status: 'rejected', rejectionReason: reason } }));
            toast({ title: 'KYC Rejected', description: `${kycUser.fullname}'s KYC has been rejected.` });
        } catch (e: any) {
            toast({ title: 'Error', description: e.message || 'Failed', variant: 'destructive' });
        } finally {
            setKycActionLoading(false);
        }
    };

    const handleSaveBank = async () => {
        if (!kycUser) return;
        setKycActionLoading(true);
        try {
            await updateUserKycBankDetails(kycUser._id, bankForm);
            setKycUser((prev: any) => ({ ...prev, kyc: { ...prev.kyc, bankDetails: { ...bankForm } } }));
            setEditingBank(false);
            toast({ title: 'Bank Details Saved', description: 'KYC bank details updated successfully.' });
        } catch (e: any) {
            toast({ title: 'Error', description: e.message || 'Failed to save bank details', variant: 'destructive' });
        } finally {
            setKycActionLoading(false);
        }
    };

    const statusCfg: Record<string, { color: string; bg: string; border: string }> = {
        approved: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        pending:  { color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
        rejected: { color: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/20' },
        not_submitted: { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex justify-between items-center px-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Active User Registry</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> {users.length} Verified Users</div>
            </div>
            <div className="glass-card rounded-[2rem] border-none shadow-2xl overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200/50 dark:border-white/5">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">User Name & Email</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">KYC</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Earning & Balance</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {users.map((user) => {
                                const kyc = user.kyc?.status || 'not_submitted';
                                const cfg = statusCfg[kyc] || statusCfg.not_submitted;
                                return (
                                    <tr key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-50 to-white dark:from-white/5 dark:to-white/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold border border-slate-200 dark:border-white/10 group-hover:scale-110 transition-transform">
                                                    {user.fullname?.charAt(0)}
                                                </div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{user.fullname}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <p className="text-[10px] text-slate-400 font-bold tracking-wider">{user.username}</p>
                                                <p className="text-xs text-indigo-500 font-medium lowercase truncate max-w-[180px]">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => openKyc(user)}
                                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all hover:scale-105 ${cfg.bg} ${cfg.color} ${cfg.border}`}
                                                title="View / Edit KYC"
                                            >
                                                <Icon icon="solar:shield-check-bold" className="text-sm" />
                                                {kyc === 'not_submitted' ? 'No KYC' : kyc}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex flex-col">
                                                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Earnings: ₹{user.wallet?.totalEarnings?.toLocaleString() || '0'}</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Balance: ₹{user.wallet?.balance?.toLocaleString() || '0'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => {
                                                    const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
                                                    if (newStatus === 'blocked' && !window.confirm(`Are you sure you want to BLOCK ${user.fullname}? They will not be able to withdraw funds.`)) return;
                                                    updateUserStatus(user._id, newStatus);
                                                }}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${user.status === 'blocked' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-emerald-500/10' : 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white shadow-rose-500/10'}`}
                                            >
                                                {user.status === 'blocked' ? 'Unblock Account' : 'Block Identity'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* KYC Slide-over Drawer */}
            {kycUser && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setKycUser(null)} />
                    {/* Drawer */}
                    <div className="w-full max-w-md h-full bg-slate-900 border-l border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
                        {/* Drawer header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg">
                                    {kycUser.fullname?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{kycUser.fullname}</p>
                                    <p className="text-[10px] text-slate-400">@{kycUser.username}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {(() => {
                                    const cfg = statusCfg[kycUser.kyc?.status || 'not_submitted'];
                                    return (
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                                            {kycUser.kyc?.status || 'Not Submitted'}
                                        </span>
                                    );
                                })()}
                                <button onClick={() => setKycUser(null)} className="h-8 w-8 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all">
                                    <Icon icon="solar:close-bold" />
                                </button>
                            </div>
                        </div>

                        {/* Drawer body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {/* KYC Photos */}
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                                    <Icon icon="solar:gallery-bold" className="text-indigo-400" /> Identity Documents
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Aadhar */}
                                    {(() => {
                                        const url = getPhotoUrl(kycUser.kyc?.aadharCard);
                                        return (
                                            <div
                                                onClick={() => url && setLightbox({ url, label: `${kycUser.fullname} — Aadhar Card` })}
                                                className={`relative rounded-2xl overflow-hidden border-2 border-dashed transition-all group ${url ? 'border-blue-500/30 cursor-pointer hover:border-blue-500/60' : 'border-slate-700'}`}
                                                style={{ aspectRatio: '4/3' }}
                                            >
                                                {url ? (
                                                    <>
                                                        <img src={url} alt="Aadhar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                                            <span className="text-white text-[10px] font-bold flex items-center gap-1"><Icon icon="solar:eye-bold" /> View</span>
                                                        </div>
                                                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded-full">Aadhar</div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full gap-1 p-4 bg-slate-800/50">
                                                        <Icon icon="solar:document-bold" className="text-2xl text-slate-600" />
                                                        <span className="text-[9px] text-slate-500 font-bold text-center">Aadhar Not Uploaded</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                    {/* PAN */}
                                    {(() => {
                                        const url = getPhotoUrl(kycUser.kyc?.panCard);
                                        return (
                                            <div
                                                onClick={() => url && setLightbox({ url, label: `${kycUser.fullname} — PAN Card` })}
                                                className={`relative rounded-2xl overflow-hidden border-2 border-dashed transition-all group ${url ? 'border-amber-500/30 cursor-pointer hover:border-amber-500/60' : 'border-slate-700'}`}
                                                style={{ aspectRatio: '4/3' }}
                                            >
                                                {url ? (
                                                    <>
                                                        <img src={url} alt="PAN" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                                            <span className="text-white text-[10px] font-bold flex items-center gap-1"><Icon icon="solar:eye-bold" /> View</span>
                                                        </div>
                                                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full">PAN</div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full gap-1 p-4 bg-slate-800/50">
                                                        <Icon icon="solar:card-bold" className="text-2xl text-slate-600" />
                                                        <span className="text-[9px] text-slate-500 font-bold text-center">PAN Not Uploaded</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* Bank Details */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <Icon icon="solar:bank-bold" className="text-indigo-400" /> Bank Details
                                    </p>
                                    <button
                                        onClick={() => setEditingBank(!editingBank)}
                                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                                    >
                                        <Icon icon={editingBank ? 'solar:close-bold' : 'solar:pen-bold'} />
                                        {editingBank ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>

                                {editingBank ? (
                                    <div className="space-y-2">
                                        {[
                                            { key: 'accountHolderName', label: 'Account Holder Name' },
                                            { key: 'bankName', label: 'Bank Name' },
                                            { key: 'accountNumber', label: 'Account Number' },
                                            { key: 'ifscCode', label: 'IFSC Code' },
                                        ].map(({ key, label }) => (
                                            <div key={key}>
                                                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{label}</label>
                                                <input
                                                    value={bankForm[key as keyof typeof bankForm]}
                                                    onChange={(e) => setBankForm(prev => ({ ...prev, [key]: e.target.value }))}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
                                                    placeholder={label}
                                                />
                                            </div>
                                        ))}
                                        <button
                                            onClick={handleSaveBank}
                                            disabled={kycActionLoading}
                                            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 mt-1"
                                        >
                                            {kycActionLoading ? <Icon icon="eos-icons:loading" className="animate-spin" /> : <Icon icon="solar:check-bold" />}
                                            Save Bank Details
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-2">
                                        {[
                                            { label: 'Holder', value: kycUser.kyc?.bankDetails?.accountHolderName },
                                            { label: 'Bank', value: kycUser.kyc?.bankDetails?.bankName },
                                            { label: 'Account', value: kycUser.kyc?.bankDetails?.accountNumber },
                                            { label: 'IFSC', value: kycUser.kyc?.bankDetails?.ifscCode },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="flex justify-between text-[11px]">
                                                <span className="text-slate-500">{label}:</span>
                                                <span className="font-bold text-white font-mono">{value || '—'}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submission info */}
                            {kycUser.kyc?.submittedAt && (
                                <div className="text-[10px] text-slate-500 text-center">
                                    Submitted: {new Date(kycUser.kyc.submittedAt).toLocaleString()}
                                </div>
                            )}
                            {kycUser.kyc?.rejectionReason && (
                                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-[11px] text-rose-400 font-medium">
                                    ✗ Rejection Reason: {kycUser.kyc.rejectionReason}
                                </div>
                            )}
                        </div>

                        {/* Drawer footer actions */}
                        {kycUser.kyc?.status === 'pending' && (
                            <div className="p-4 border-t border-white/10 flex gap-3">
                                <button
                                    onClick={handleKycReject}
                                    disabled={kycActionLoading}
                                    className="flex-1 py-3 rounded-2xl text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"
                                >
                                    {kycActionLoading ? <Icon icon="eos-icons:loading" className="animate-spin mx-auto" /> : 'Reject KYC'}
                                </button>
                                <button
                                    onClick={handleKycApprove}
                                    disabled={kycActionLoading}
                                    className="flex-1 py-3 rounded-2xl text-xs font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1"
                                >
                                    {kycActionLoading ? <Icon icon="eos-icons:loading" className="animate-spin" /> : <><Icon icon="solar:check-bold" /> Approve KYC</>}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Photo lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-white font-bold text-sm truncate">{lightbox.label}</p>
                            <button onClick={() => setLightbox(null)} className="h-8 w-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all">
                                <Icon icon="solar:close-bold" />
                            </button>
                        </div>
                        <img src={lightbox.url} alt={lightbox.label} className="w-full rounded-2xl shadow-2xl max-h-[75vh] object-contain bg-slate-900" />
                        <div className="flex gap-3 mt-3 justify-center">
                            <a href={lightbox.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/20 transition-all flex items-center gap-1.5">
                                <Icon icon="solar:external-link-bold" /> Open in New Tab
                            </a>
                            <a href={lightbox.url} download className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-1.5">
                                <Icon icon="solar:download-bold" /> Download
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const PaymentsContent = ({ pendingPayments }: { pendingPayments: any[] }) => {
    const { approvePayment, rejectPayment } = useAdminStore();
    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex justify-between items-center px-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Pending Verification Queue</h3>
                <div className="px-4 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-bold uppercase tracking-widest">{pendingPayments.length} Actions Required</div>
            </div>
            <div className="glass-card rounded-[2rem] border-none shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200/50 dark:border-white/5">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Requester Account</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Submission Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Approval Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {pendingPayments.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-white dark:bg-white/10 text-indigo-500 flex items-center justify-center text-xl shadow-sm border border-slate-200 dark:border-white/10"><Icon icon="solar:user-rounded-bold" /></div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{user.fullname}</p>
                                                <div className="flex flex-col">
                                                    <p className="text-[10px] text-slate-400 font-bold tracking-wider">{user.username}</p>
                                                    <p className="text-[10px] text-indigo-500 font-medium lowercase italic">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><p className="text-xs font-bold text-slate-900 dark:text-white">{new Date(user.updatedAt).toLocaleDateString()}</p><p className="text-[10px] text-slate-400 font-medium">{new Date(user.updatedAt).toLocaleTimeString()}</p></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => approvePayment(user._id)} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all">Approve ID</button>
                                            <button onClick={() => rejectPayment(user._id)} className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-rose-500/30 transition-all">Reject</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const WithdrawalsContent = ({ withdrawals }: { withdrawals: any[] }) => {
    const { approveWithdrawal } = useAdminStore();
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const { toast } = useToast();

    const today = new Date();
    const isSaturday = today.getDay() === 6;
    const daysUntilSaturday = (6 - today.getDay() + 7) % 7 || 7;

    const handleApprove = async (id: string) => {
        try {
            await approveWithdrawal(id, 'approved');
            toast({ title: 'Approved', description: 'Withdrawal approved successfully.' });
        } catch (e: any) {
            toast({ title: 'Error', description: e.message || 'Failed to approve', variant: 'destructive' });
        }
    };

    const handleReject = async (id: string) => {
        if (!rejectionReason.trim()) {
            toast({ title: 'Reason required', description: 'Please enter a rejection reason.', variant: 'destructive' });
            return;
        }
        try {
            await approveWithdrawal(id, 'rejected', rejectionReason);
            toast({ title: 'Rejected', description: 'Withdrawal rejected.' });
            setRejectingId(null);
            setRejectionReason('');
        } catch (e: any) {
            toast({ title: 'Error', description: e.message || 'Failed to reject', variant: 'destructive' });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex justify-between items-center px-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Financial Payout Management</h3>
                <div className="flex gap-2">
                    <div className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">{withdrawals.length} Pending</div>
                </div>
            </div>

            {/* Saturday restriction banner */}
            <div className={`mx-4 rounded-2xl p-4 flex items-center gap-3 border ${isSaturday
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                <Icon icon={isSaturday ? 'solar:check-circle-bold' : 'solar:calendar-mark-bold'} className="text-xl shrink-0" />
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest">
                        {isSaturday
                            ? 'Approval window is OPEN — Today is Saturday'
                            : `Approval window is CLOSED — Opens on Saturday (${daysUntilSaturday} day${daysUntilSaturday !== 1 ? 's' : ''} away)`}
                    </p>
                    <p className="text-[10px] mt-0.5 opacity-70">
                        Users can submit requests any day. Approvals are processed every Saturday only.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {withdrawals.map((w) => (
                    <div key={w._id} className="glass-card rounded-[2rem] p-6 border-none shadow-2xl relative group overflow-hidden bg-white/50 dark:bg-[#0f172a]/50">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Icon icon="solar:wallet-bold" className="text-6xl text-indigo-500 -rotate-12" />
                        </div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-2xl border border-indigo-500/20 group-hover:scale-110 transition-all"><Icon icon="solar:card-send-bold-duotone" /></div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{w.user?.fullname}</p>
                                <div className="flex flex-col">
                                    <p className="text-[10px] text-slate-500 font-bold tracking-wider">{w.user?.username}</p>
                                    <p className="text-[10px] text-indigo-500 font-medium lowercase italic">{w.user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Amount breakdown */}
                        <div className="p-4 bg-slate-100/50 dark:bg-white/5 rounded-2xl border border-slate-200/30 dark:border-white/5 space-y-2 mb-4">
                            <div className="flex justify-between text-[11px]">
                                <span className="text-slate-500 font-medium">Requested Amount</span>
                                <span className="font-bold text-slate-900 dark:text-white">₹{w.amount?.toLocaleString() || '0'}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                                <span className="text-slate-500 font-medium">Admin Fee (20%)</span>
                                <span className="font-bold text-rose-500">-₹{(w.adminFee ?? w.amount * 0.20)?.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-slate-200 dark:bg-white/10 my-1" />
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Net Payable</span>
                                <span className="text-lg font-bold text-emerald-500">₹{(w.netPayable ?? w.amount * 0.80)?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Bank details (Static display) */}
                        <div className="space-y-1.5 px-1 mb-6">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <Icon icon="solar:bank-bold" className="text-indigo-400" /> Bank Details
                            </p>
                            <div className="flex justify-between text-[11px] font-medium">
                                <span className="text-slate-500">Account No:</span>
                                <span className="text-slate-900 dark:text-slate-300 font-bold font-mono">{w.bankDetails?.accountNumber || '—'}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-medium">
                                <span className="text-slate-500">IFSC:</span>
                                <span className="text-slate-900 dark:text-slate-300 font-bold font-mono">{w.bankDetails?.ifscCode || '—'}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-medium">
                                <span className="text-slate-500">Bank:</span>
                                <span className="text-slate-900 dark:text-slate-300 font-bold">{w.bankDetails?.bankName || '—'}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-medium">
                                <span className="text-slate-500">Holder:</span>
                                <span className="text-slate-900 dark:text-slate-300 font-bold">{w.bankDetails?.accountHolderName || '—'}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-medium">
                                <span className="text-slate-500">Wallet:</span>
                                <span className={`font-bold uppercase ${w.walletType === 'matrix' ? 'text-emerald-500' : 'text-indigo-400'}`}>{w.walletType || 'current'}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-medium">
                                <span className="text-slate-500">Requested:</span>
                                <span className="text-slate-900 dark:text-slate-300 font-bold">{new Date(w.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {rejectingId === w._id ? (
                            <div className="space-y-2">
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Enter rejection reason..."
                                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white resize-none outline-none focus:ring-2 focus:ring-rose-500/30"
                                    rows={2}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleReject(w._id)}
                                        disabled={!isSaturday}
                                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${isSaturday ? 'bg-rose-500 text-white hover:scale-[1.02]' : 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed'}`}
                                    >Confirm Reject</button>
                                    <button onClick={() => { setRejectingId(null); setRejectionReason(''); }} className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 transition-all">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleApprove(w._id)}
                                    disabled={!isSaturday}
                                    title={!isSaturday ? 'Approvals only allowed on Saturdays' : ''}
                                    className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all ${isSaturday
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]'
                                        : 'bg-slate-200 dark:bg-white/5 text-slate-400 cursor-not-allowed'}`}
                                >
                                    {isSaturday ? 'Approve' : <span className="flex items-center justify-center gap-1"><Icon icon="solar:lock-bold" className="text-sm" /> Locked</span>}
                                </button>
                                <button
                                    onClick={() => setRejectingId(w._id)}
                                    disabled={!isSaturday}
                                    title={!isSaturday ? 'Approvals only allowed on Saturdays' : ''}
                                    className={`flex-1 py-3 rounded-2xl text-xs font-bold border transition-all ${isSaturday
                                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500 hover:text-white'
                                        : 'bg-slate-200 dark:bg-white/5 text-slate-400 border-transparent cursor-not-allowed'}`}
                                >
                                    {isSaturday ? 'Reject' : <span className="flex items-center justify-center gap-1"><Icon icon="solar:lock-bold" className="text-sm" /> Locked</span>}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                {withdrawals.length === 0 && (
                    <div className="col-span-3 glass-card rounded-[2rem] p-16 text-center flex flex-col items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 text-3xl">
                            <Icon icon="solar:wallet-bold-duotone" />
                        </div>
                        <p className="text-slate-500 font-bold text-sm">No pending withdrawals</p>
                    </div>
                )}
            </div>
        </div>
    );
};


const LedgerContent = ({ transactions }: { transactions: any[] }) => {
    const { distributeRoyalty } = useAdminStore();
    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4">
                <div><h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Platform Financial Ledger</h3><p className="text-xs text-slate-500 mt-1">Audit log of all system-generated payouts and transactions</p></div>
                <button onClick={() => distributeRoyalty()} className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-amber-500/20 hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center gap-2 border border-amber-400/20"><Icon icon="solar:star-bold" className="text-xl" />Trigger Weekly Royalty</button>
            </div>
            <div className="glass-card rounded-[2rem] border-none shadow-2xl overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200/50 dark:border-white/5">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Beneficiary</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transaction Origin</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Settlement</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {transactions.map((tx) => (
                                <tr key={tx._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center font-bold text-xs text-slate-500 group-hover:text-amber-500 transition-colors border border-slate-200 dark:border-white/10">{tx.user?.username?.charAt(0) || 'U'}</div>
                                            <div><p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{tx.user?.fullname}</p><p className="text-[10px] text-slate-400 font-bold tracking-wider">{tx.user?.username}</p></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{tx.type}</p><p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{tx.description}</p></td>
                                    <td className="px-6 py-4 text-center"><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-bold uppercase border border-emerald-500/20">{tx.status}</span></td>
                                    <td className="px-6 py-4 text-right">
                                        <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>₹{tx.amount?.toLocaleString() || '0'}</p>
                                        <p className="text-[10px] text-slate-400 font-medium tracking-tighter uppercase">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Settings Content
const SettingsContent = () => (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-500/10 text-slate-500 flex items-center justify-center text-xl border border-slate-500/20">
                <Icon icon="solar:settings-bold-duotone" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight uppercase">
                System General Configuration
            </h2>
        </div>
        <div className="glass-card rounded-3xl border-none shadow-2xl p-20 text-center flex flex-col items-center justify-center">
            <div className="h-24 w-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700 text-5xl mb-6">
                <Icon icon="solar:tuning-square-2-linear" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg">Configuration Module Locked</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-sm leading-relaxed">
                Global system variables and platform settings are managed through this secure interface. Currently accessible only via root terminal.
            </p>
        </div>
    </div>
);

const CompletionsContent = ({ completions, onViewTree }: { completions: any[], onViewTree: (userId: string, cycle: number) => void }) => (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-6xl mx-auto">
        <div className="flex justify-between items-center px-4">
            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Matrix Cycle Completions</h3>
                <p className="text-xs text-slate-500 mt-1">History of all successfully finalized 6X cycles</p>
            </div>
            <div className="px-4 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-bold uppercase tracking-widest">{completions.length} Total Completions</div>
        </div>

        <div className="glass-card rounded-[2rem] border-none shadow-2xl overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200/50 dark:border-white/5">
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">User Details</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Cycle #</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Completion Date</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {completions.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                    No completed cycles found in the system yet.
                                </td>
                            </tr>
                        ) : (
                            completions.map((c) => (
                                <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold border border-indigo-100 dark:border-indigo-800/50 group-hover:scale-110 transition-transform">
                                                {c.fullname?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{c.fullname}</p>
                                                <div className="flex flex-col">
                                                    <p className="text-[10px] text-slate-400 font-bold tracking-wider">{c.username}</p>
                                                    <p className="text-[10px] text-indigo-500 font-medium lowercase italic">{c.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold uppercase border border-emerald-500/20">
                                            Cycle {c.cycle}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">{new Date(c.completedAt).toLocaleDateString()}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{new Date(c.completedAt).toLocaleTimeString()}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onViewTree(c.userId, c.cycle)}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 ml-auto"
                                        >
                                            <Icon icon="solar:layers-minimalistic-bold" />
                                            View Tree
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);
