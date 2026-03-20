import { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { authApi } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { useToast } from '@/hooks/use-toast';
import { UserIDCard } from '@/components/UserIDCard';

export const ProfileView = () => {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showIDCard, setShowIDCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleLogout = () => {
    authApi.logout();
    logout();
    navigate('/login');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (passwords.new.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new
      });

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      setPasswords({ current: '', new: '', confirm: '' });
      setShowPasswordForm(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const themeOptions: Array<{ value: 'light' | 'dark' | 'system'; icon: string; label: string }> = [
    { value: 'light', icon: 'solar:sun-bold', label: 'Light' },
    { value: 'dark', icon: 'solar:moon-bold', label: 'Dark' },
    { value: 'system', icon: 'solar:monitor-bold', label: 'System' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6 md:space-y-8"
    >
      <PageHeader title="Profile" subtitle="Settings" />

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 flex items-center gap-5 shadow-card">
        <div className="h-20 w-20 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center text-2xl font-bold text-white dark:text-gray-900 shadow-lg">
          {user.fullname?.split(' ').map((n: string) => n[0]).join('') || 'U'}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.fullname}</h3>
          <p className="text-sm text-gray-900 dark:text-white font-bold">@{user.username}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{user.email}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-md text-[10px] font-bold border border-emerald-100 dark:border-emerald-800">
            <Icon icon="solar:verified-check-bold" /> {user.verified ? 'KYC Verified' : 'Pending Verification'}
          </div>
        </div>
        <button
          onClick={() => setShowIDCard(true)}
          className="ml-auto p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all click-scale flex flex-col items-center justify-center gap-1"
        >
          <Icon icon="solar:card-id-bold" width={24} />
          <span className="text-[10px] font-black">ID CARD</span>
        </button>
      </div>

      {/* Profile Details */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Account Details</h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Icon icon="solar:user-id-linear" className="text-gray-400 dark:text-gray-500" width={20} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Username</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{user.username}</span>
          </div>
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Icon icon="solar:user-id-linear" className="text-gray-400 dark:text-gray-500" width={20} />
              <span className="text-sm text-gray-600 dark:text-gray-400">User ID</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{user.id}</span>
          </div>
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Icon icon="solar:link-linear" className="text-gray-400 dark:text-gray-500" width={20} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Referral Code</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{user.referralCode}</span>
          </div>
          {user.createdAt && (
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <Icon icon="solar:calendar-linear" className="text-gray-400 dark:text-gray-500" width={20} />
                <span className="text-sm text-gray-600 dark:text-gray-400">Joined</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Icon icon="solar:check-circle-linear" className="text-gray-400 dark:text-gray-500" width={20} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
            </div>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 capitalize">{user.status || 'Active'}</span>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Appearance</h3>
        </div>
        <div className="p-5">
          <div className="flex gap-3">
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                  theme === opt.value
                    ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:border-gray-200 dark:hover:border-gray-600 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <Icon icon={opt.icon} width={24} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Change Password</h3>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            {showPasswordForm ? 'Cancel' : 'Update'}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Current Password</label>
              <div className="relative">
                <Icon icon="solar:lock-password-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="password"
                  required
                  value={passwords.current}
                  onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Enter current password"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">New Password</label>
              <div className="relative">
                <Icon icon="solar:key-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="password"
                  required
                  value={passwords.new}
                  onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Min. 6 characters"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Confirm New Password</label>
              <div className="relative">
                <Icon icon="solar:key-bold" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="password"
                  required
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Repeat new password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold shadow-lg shadow-gray-900/10 dark:shadow-none hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 click-scale flex items-center justify-center gap-2 transition-all mt-2"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 dark:border-gray-900/30 border-t-white dark:border-t-gray-900 rounded-full animate-spin" />
              ) : (
                <>Update Password</>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full py-4 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 shadow-sm text-sm font-bold click-scale transition-colors"
      >
        Log Out
      </button>

      <AnimatePresence>
        {showIDCard && (
          <UserIDCard user={user} onClose={() => setShowIDCard(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
