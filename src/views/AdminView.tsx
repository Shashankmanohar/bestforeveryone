import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminStore } from '@/store/useAdminStore';
import { useToast } from '@/hooks/use-toast';
import { Icon } from '@iconify/react';

type ViewType = 'dashboard' | 'users' | 'payments' | 'withdrawals' | 'ledger' | 'matrix' | 'settings';

export const AdminView = () => {
    const [currentView, setCurrentView] = useState<ViewType>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigate = useNavigate();
    const { logoutAdmin, admin } = useAuthStore();
    const { toast } = useToast();
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
        rejectPayment
    } = useAdminStore();

    useEffect(() => {
        // Fetch initial data based on current view
        const fetchData = () => {
            if (currentView === 'dashboard') {
                fetchMetrics();
                fetchActivity();
            } else if (currentView === 'users') {
                fetchUsers();
            } else if (currentView === 'payments') {
                fetchPendingPayments();
            } else if (currentView === 'withdrawals') {
                fetchWithdrawals();
            } else if (currentView === 'ledger') {
                fetchLedger();
            }
        };

        fetchData();

        // Set up polling for real-time updates
        const interval = setInterval(() => {
            if (currentView === 'dashboard' || currentView === 'payments') {
                fetchData();
            }
        }, 10000); // Poll every 10 seconds

        return () => clearInterval(interval);
    }, [currentView, fetchMetrics, fetchActivity, fetchUsers, fetchPendingPayments, fetchWithdrawals, fetchLedger]);

    const handleLogout = () => {
        logoutAdmin();
        navigate('/admin/login');
    };

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside
                className={`w-64 bg-white border-r border-slate-200 flex flex-col z-30 transition-all duration-300 absolute md:relative ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 h-full`}
            >
                {/* Brand */}
                <div className="h-14 flex items-center px-4 border-b border-slate-100 gap-3">
                    <div className="h-7 w-7 bg-slate-900 rounded-md flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                        B
                    </div>
                    <div>
                        <h1 className="text-sm font-semibold text-slate-900 tracking-tight leading-none">
                            Best For Everyone <span className="text-slate-400 font-normal">Ent.</span>
                        </h1>
                        <p className="text-[10px] text-slate-400 leading-none mt-1 font-mono">
                            ADMIN CONSOLE
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
                    <div className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Overview
                    </div>
                    <NavItem
                        icon="solar:widget-linear"
                        label="Dashboard"
                        active={currentView === 'dashboard'}
                        onClick={() => setCurrentView('dashboard')}
                    />
                    <NavItem
                        icon="solar:users-group-rounded-linear"
                        label="User Management"
                        active={currentView === 'users'}
                        onClick={() => setCurrentView('users')}
                    />
                    <NavItem
                        icon="solar:shield-check-linear"
                        label="Payment Approvals"
                        active={currentView === 'payments'}
                        onClick={() => setCurrentView('payments')}
                        badge={pendingPayments.length > 0 ? pendingPayments.length : undefined}
                    />

                    <div className="px-3 mb-2 mt-6 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Finance
                    </div>
                    <NavItem
                        icon="solar:card-transfer-linear"
                        label="Withdrawals"
                        active={currentView === 'withdrawals'}
                        onClick={() => setCurrentView('withdrawals')}
                        badge={withdrawals.length > 0 ? withdrawals.length : undefined}
                    />
                    <NavItem
                        icon="solar:wallet-money-linear"
                        label="Master Ledger"
                        active={currentView === 'ledger'}
                        onClick={() => setCurrentView('ledger')}
                    />

                    <div className="px-3 mb-2 mt-6 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Engine
                    </div>
                    <NavItem
                        icon="solar:layers-minimalistic-linear"
                        label="Matrix Control"
                        active={currentView === 'matrix'}
                        onClick={() => setCurrentView('matrix')}
                    />
                    <NavItem
                        icon="solar:settings-linear"
                        label="System Config"
                        active={currentView === 'settings'}
                        onClick={() => setCurrentView('settings')}
                    />
                </div>

                {/* Profile */}
                <div className="p-3 border-t border-slate-200 bg-slate-50/50">
                    <div className="w-full flex items-center gap-3 p-2 rounded-lg">
                        <div className="h-8 w-8 rounded bg-slate-900 text-white flex items-center justify-center font-semibold text-xs">
                            SA
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">
                                {admin?.adminName || 'Super Admin'}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate font-medium">
                                ● Full Access
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 relative h-full">
                {/* Header */}
                <header className="h-14 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-20 flex items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-3 md:hidden">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-slate-500"
                        >
                            <Icon icon="solar:hamburger-menu-linear" className="text-xl" />
                        </button>
                        <span className="font-semibold text-slate-900">Best For Everyone</span>
                    </div>

                    <div className="hidden md:flex flex-1 max-w-lg">
                        <div className="w-full flex items-center gap-2 px-3 py-1.5 bg-slate-50/50 border border-slate-200 rounded-md text-slate-400">
                            <Icon icon="solar:magnifer-linear" />
                            <span className="text-xs font-medium">Search users, transactions, logs...</span>
                            <span className="ml-auto text-[10px] bg-white border border-slate-200 px-1.5 rounded text-slate-400">
                                ⌘K
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-4 w-px bg-slate-200 mx-1"></div>
                        <button
                            onClick={handleLogout}
                            className="text-slate-400 hover:text-rose-600 transition-colors"
                            title="Logout"
                        >
                            <Icon icon="solar:logout-2-linear" className="text-lg" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pb-20">
                    {currentView === 'dashboard' && (
                        <DashboardContent
                            metrics={metrics}
                            activities={activities}
                            onNavigate={setCurrentView}
                        />
                    )}
                    {currentView === 'users' && <UsersContent users={users} />}
                    {currentView === 'payments' && <PaymentsContent pendingPayments={pendingPayments} />}
                    {currentView === 'withdrawals' && <WithdrawalsContent withdrawals={withdrawals} />}
                    {currentView === 'ledger' && <LedgerContent transactions={transactions} />}
                    {currentView === 'matrix' && <MatrixContent />}
                    {currentView === 'settings' && <SettingsContent />}
                </div>
            </main>
        </div>
    );
};

// Navigation Item Component
const NavItem = ({
    icon,
    label,
    active,
    onClick,
    badge
}: {
    icon: string;
    label: string;
    active: boolean;
    onClick: () => void;
    badge?: number;
}) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${active
            ? 'bg-slate-100 text-slate-900 font-semibold'
            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
    >
        <Icon icon={icon} className="text-lg" />
        {label}
        {badge && badge > 0 && (
            <span className="ml-auto bg-rose-50 text-rose-600 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-rose-100">
                {badge}
            </span>
        )}
    </button>
);

// Dashboard Content
const DashboardContent = ({
    metrics,
    activities,
    onNavigate
}: {
    metrics: any;
    activities: any[];
    onNavigate: (view: ViewType) => void;
}) => (
    <div className="space-y-6 animate-in fade-in duration-400 max-w-7xl mx-auto">
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                    System Overview
                </h2>
                <p className="text-sm text-slate-500">Live metrics from production environment</p>
            </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
                title="Platform Revenue"
                value={`₹${(metrics?.totalRevenue || 0).toLocaleString()}`}
                change={`Fees: ₹${(metrics?.totalAdminFees || 0).toLocaleString()}`}
                color="emerald"
                icon="solar:wallet-money-bold-duotone"
            />
            <KPICard
                title="Active Users"
                value={metrics?.activeUsers || 0}
                change={`Paid: ₹${(metrics?.totalUserEarnings || 0).toLocaleString()}`}
                color="indigo"
                icon="solar:users-group-rounded-bold-duotone"
                onClick={() => onNavigate('users')}
            />
            <KPICard
                title="Pending Payouts"
                value={metrics?.pendingWithdrawals || 0}
                change={`₹${(metrics?.pendingWithdrawalAmount || 0).toLocaleString()}`}
                color="amber"
                icon="solar:card-transfer-bold-duotone"
                onClick={() => onNavigate('withdrawals')}
            />
            <KPICard
                title="Pending Approvals"
                value={metrics?.pendingPayments || 0}
                change={`Joining: ₹${(metrics?.totalJoiningFees || 0).toLocaleString()}`}
                color="purple"
                icon="solar:shield-check-bold-duotone"
                onClick={() => onNavigate('payments')}
            />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                    Recent Activity
                </h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
                {activities && activities.length > 0 ? (
                    activities.map((activity: any) => (
                        <div key={activity._id} className="flex items-center gap-4 px-5 py-3 border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <div className={`h-8 w-8 rounded-full ${activity.status === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} flex items-center justify-center text-sm border border-white shadow-sm`}>
                                <Icon icon={activity.status === 'credit' ? 'solar:arrow-left-down-linear' : 'solar:arrow-right-up-linear'} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{activity.type}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{activity.user?.username || activity.user?.fullname || 'N/A'}</p>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-semibold font-mono ${activity.status === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {activity.status === 'credit' ? '+' : '-'}₹{activity.amount}
                                </p>
                                <p className="text-[10px] text-slate-400">Just now</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center text-slate-500 text-sm">
                        No recent activity
                    </div>
                )}
            </div>
        </div>
    </div>
);

// KPI Card Component
const KPICard = ({
    title,
    value,
    change,
    color,
    icon,
    onClick
}: {
    title: string;
    value: string | number;
    change: string;
    color: string;
    icon: string;
    onClick?: () => void;
}) => {
    const colorClasses = {
        emerald: 'bg-emerald-50 text-emerald-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        amber: 'bg-amber-50 text-amber-600',
        purple: 'bg-purple-50 text-purple-600',
    }[color as 'emerald' | 'indigo' | 'amber' | 'purple'];

    return (
        <div
            onClick={onClick}
            className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all ${onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300 active:scale-[0.98]' : ''
                }`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        {title}
                    </p>
                    <h3 className="text-2xl font-semibold text-slate-900 font-mono leading-tight">
                        {value}
                    </h3>
                </div>
                <div className={`h-9 w-9 rounded-lg ${colorClasses} flex items-center justify-center`}>
                    <Icon icon={icon} className="text-lg" />
                </div>
            </div>
            <div className={`mt-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${colorClasses}`}>
                {change}
            </div>
        </div>
    );
};

// Users Content
const UsersContent = ({ users }: { users: any[] }) => {
    const { updateUserStatus } = useAdminStore();
    const { toast } = useToast();

    const handleBlockUser = async (userId: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
            await updateUserStatus(userId, newStatus);
            toast({
                title: "Success",
                description: `User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update user status",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="animate-in fade-in duration-400">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                    User Management
                </h2>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 sticky top-0">
                            <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                <th className="px-4 py-3 border-b border-slate-200">User Profile</th>
                                <th className="px-4 py-3 border-b border-slate-200">Wallet</th>
                                <th className="px-4 py-3 border-b border-slate-200">Earnings</th>
                                <th className="px-4 py-3 border-b border-slate-200">Status</th>
                                <th className="px-4 py-3 border-b border-slate-200 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users && users.length > 0 ? (
                                users.map((user: any) => (
                                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center font-semibold text-slate-600 text-xs">
                                                    {user.fullname?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{user.fullname}</div>
                                                    <div className="text-xs text-slate-500 font-semibold">{user.username}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono">{user.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-mono font-medium">₹{user.wallet?.balance?.toLocaleString() || 0}</td>
                                        <td className="px-4 py-3">
                                            <div className="text-xs text-slate-600">Total: <span className="font-semibold">₹{user.wallet?.totalEarnings?.toLocaleString() || 0}</span></div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${user.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                                <span className={`w-1 h-1 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleBlockUser(user._id, user.status)}
                                                className="text-slate-400 hover:text-indigo-600 font-medium text-xs border border-slate-200 hover:border-indigo-200 px-2 py-1 rounded bg-white transition-all"
                                            >
                                                {user.status === 'active' ? 'Block' : 'Unblock'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Withdrawals Content
const WithdrawalsContent = ({ withdrawals }: { withdrawals: any[] }) => {
    const { approveWithdrawal } = useAdminStore();
    const { toast } = useToast();

    const handleApprove = async (id: string, approved: boolean) => {
        try {
            await approveWithdrawal(id, approved ? 'approved' : 'rejected');
            toast({
                title: approved ? "Approved" : "Rejected",
                description: `Withdrawal ${approved ? 'approved' : 'rejected'} successfully`
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to process withdrawal",
                variant: "destructive"
            });
        }
    };

    const hasPending = withdrawals && withdrawals.length > 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-400 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                    Withdrawal Queue
                </h2>
            </div>

            {!hasPending ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center flex flex-col items-center justify-center">
                    <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-3xl mb-4">
                        <Icon icon="solar:check-circle-bold-duotone" />
                    </div>
                    <h3 className="text-slate-900 font-semibold">All Caught Up!</h3>
                    <p className="text-slate-500 text-sm mt-1">
                        No pending withdrawal requests in the queue.
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {withdrawals.map((w: any) => (
                            <div key={w._id} className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-semibold text-xs border border-slate-200">
                                        UPI
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-semibold text-slate-900 font-mono">₹{w.amount}</span>
                                            <span className="text-xs text-slate-400">Fee: ₹{w.adminFee}</span>
                                        </div>
                                        <div className="text-xs text-emerald-600 font-semibold">Net Payable: ₹{w.netPayable}</div>
                                    </div>
                                </div>

                                <div className="flex-1 md:px-8 w-full md:w-auto">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold text-slate-700">{w.user?.fullname}</span>
                                    </div>
                                    <div className="text-xs space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400">A/C:</span>
                                            <span className="font-mono text-slate-700 font-medium">{w.bankDetails?.accountNumber || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400">IFSC:</span>
                                            <span className="font-mono text-slate-500">{w.bankDetails?.ifscCode || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400">Name:</span>
                                            <span className="text-slate-600 font-medium">{w.bankDetails?.accountHolderName || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full md:w-auto justify-end">
                                    <button
                                        onClick={() => handleApprove(w._id, false)}
                                        className="px-3 py-1.5 rounded border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs font-semibold transition-all"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleApprove(w._id, true)}
                                        className="px-3 py-1.5 rounded bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
                                    >
                                        <Icon icon="solar:check-circle-linear" /> Approve
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Ledger Content
const LedgerContent = ({ transactions }: { transactions: any[] }) => (
    <div className="animate-in fade-in duration-400">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                Financial Ledger
            </h2>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 sticky top-0">
                    <tr className="text-xs font-semibold text-slate-500 uppercase">
                        <th className="px-4 py-3 border-b border-slate-200">Transaction ID</th>
                        <th className="px-4 py-3 border-b border-slate-200">Type</th>
                        <th className="px-4 py-3 border-b border-slate-200">Category</th>
                        <th className="px-4 py-3 border-b border-slate-200">User</th>
                        <th className="px-4 py-3 border-b border-slate-200 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {transactions && transactions.length > 0 ? (
                        transactions.map((tx: any) => (
                            <tr key={tx._id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-mono text-xs text-slate-500">{tx._id.slice(-8)}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${tx.status === 'credit' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'} uppercase`}>
                                        {tx.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-slate-900 font-medium">{tx.type}</td>
                                <td className="px-4 py-3 text-slate-600 text-xs">{tx.user?.fullname || 'N/A'}</td>
                                <td className={`px-4 py-3 text-right font-mono font-semibold ${tx.status === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {tx.status === 'credit' ? '+' : '-'}₹{tx.amount}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                No transactions found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

// Payments Content
const PaymentsContent = ({ pendingPayments }: { pendingPayments: any[] }) => {
    const { approvePayment, rejectPayment } = useAdminStore();
    const { toast } = useToast();

    const handleApprove = async (userId: string, fullname: string) => {
        try {
            await approvePayment(userId);
            toast({
                title: "Payment Approved",
                description: `${fullname}'s payment has been approved`
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to approve payment",
                variant: "destructive"
            });
        }
    };

    const handleReject = async (userId: string, fullname: string) => {
        try {
            await rejectPayment(userId, "Payment verification failed");
            toast({
                title: "Payment Rejected",
                description: `${fullname}'s payment has been rejected`
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reject payment",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="animate-in fade-in duration-400 max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                        Payment Approvals
                    </h2>
                    <p className="text-sm text-slate-500">Review and approve user payment submissions</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Icon icon="solar:shield-check-linear" className="text-emerald-600" />
                    <span>{pendingPayments.length} pending</span>
                </div>
            </div>

            {pendingPayments.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 text-center">
                    <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon icon="solar:check-circle-linear" className="text-3xl" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-2">All Caught Up!</h3>
                    <p className="text-sm text-slate-500">No pending payment approvals at the moment</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Submitted</th>
                                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pendingPayments.map((payment: any, index: number) => (
                                <tr key={payment._id || index} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                                                {payment.fullname?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{payment.fullname}</p>
                                                <p className="text-xs text-slate-500 font-semibold">{payment.username}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">ID: {payment._id?.slice(-6)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm font-mono text-slate-600">{payment.phone}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-xs text-slate-500">
                                            {payment.paymentProof?.submittedAt
                                                ? new Date(payment.paymentProof.submittedAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })
                                                : 'N/A'
                                            }
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleApprove(payment._id, payment.fullname)}
                                                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md hover:bg-emerald-100 transition-colors border border-emerald-200 flex items-center gap-1.5"
                                            >
                                                <Icon icon="solar:check-circle-linear" className="text-sm" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(payment._id, payment.fullname)}
                                                className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-semibold rounded-md hover:bg-rose-100 transition-colors border border-rose-200 flex items-center gap-1.5"
                                            >
                                                <Icon icon="solar:close-circle-linear" className="text-sm" />
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Matrix Content
const MatrixContent = () => (
    <div className="animate-in fade-in duration-400 max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-slate-900 tracking-tight mb-4">
            Matrix Engine Logic
        </h2>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center">
            <p className="text-slate-500">Matrix control interface will be implemented here</p>
        </div>
    </div>
);

// Settings Content
const SettingsContent = () => (
    <div className="animate-in fade-in duration-400 max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold text-slate-900 tracking-tight mb-4">
            System Configuration
        </h2>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center">
            <p className="text-slate-500">Settings interface will be implemented here</p>
        </div>
    </div>
);
