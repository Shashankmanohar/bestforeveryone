import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';

export const ProfileView = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout();
    logout();
    navigate('/login');
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
