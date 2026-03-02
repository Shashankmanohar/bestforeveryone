import { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { useToast } from '@/hooks/use-toast';

export const ProfileView = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6 md:space-y-8"
    >
      <PageHeader title="Profile" subtitle="Settings" />

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 flex items-center gap-5 shadow-card">
        <div className="h-20 w-20 bg-gray-900 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
          {user.fullname?.split(' ').map((n: string) => n[0]).join('') || 'U'}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{user.fullname}</h3>
          <p className="text-sm text-gray-900 font-bold">@{user.username}</p>
          <p className="text-xs text-gray-500 font-medium">{user.phone}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-bold border border-emerald-100">
            <Icon icon="solar:verified-check-bold" /> {user.verified ? 'KYC Verified' : 'Pending Verification'}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-900">Account Details</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Icon icon="solar:user-id-linear" className="text-gray-400" width={20} />
              <span className="text-sm text-gray-600">Username</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{user.username}</span>
          </div>
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Icon icon="solar:user-id-linear" className="text-gray-400" width={20} />
              <span className="text-sm text-gray-600">User ID</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{user.id}</span>
          </div>
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Icon icon="solar:link-linear" className="text-gray-400" width={20} />
              <span className="text-sm text-gray-600">Referral Code</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{user.referralCode}</span>
          </div>
          {user.createdAt && (
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <Icon icon="solar:calendar-linear" className="text-gray-400" width={20} />
                <span className="text-sm text-gray-600">Joined</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Icon icon="solar:check-circle-linear" className="text-gray-400" width={20} />
              <span className="text-sm text-gray-600">Status</span>
            </div>
            <span className="text-sm font-bold text-emerald-600 capitalize">{user.status || 'Active'}</span>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Change Password</h3>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {showPasswordForm ? 'Cancel' : 'Update'}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 ml-1">Current Password</label>
              <div className="relative">
                <Icon icon="solar:lock-password-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={passwords.current}
                  onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="Enter current password"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 ml-1">New Password</label>
              <div className="relative">
                <Icon icon="solar:key-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={passwords.new}
                  onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="Min. 6 characters"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 ml-1">Confirm New Password</label>
              <div className="relative">
                <Icon icon="solar:key-bold" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                  placeholder="Repeat new password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-bold shadow-lg shadow-gray-900/10 hover:bg-gray-800 disabled:opacity-50 click-scale flex items-center justify-center gap-2 transition-all mt-2"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
        className="w-full py-4 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 shadow-sm text-sm font-bold click-scale transition-colors"
      >
        Log Out
      </button>
    </motion.div>
  );
};
