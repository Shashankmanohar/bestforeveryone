import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { UserIDCardInline } from '@/components/UserIDCardInline';

export const IdCardView = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 md:space-y-12 pb-20 print:p-0 print:m-0"
        >
            {/* Header */}
            <div className="flex items-center justify-between print:hidden">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Your Credentials</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Digital ID & Gift Cards</p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="h-12 w-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-200 dark:border-gray-800 shadow-sm click-scale"
                >
                    <Icon icon="solar:arrow-left-linear" width={24} />
                </button>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-3 px-1">
                    <div className="h-8 w-8 bg-blue-500/10 text-blue-600 rounded-lg flex items-center justify-center">
                        <Icon icon="solar:user-id-bold" width={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Digital ID Card</h2>
                </div>

                <div className="id-card-container print:shadow-none">
                    <UserIDCardInline user={user} />
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4 font-medium italic">
                        Official digital identification for Best For Everyone members.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
