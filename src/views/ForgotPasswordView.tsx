import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '@/store/useToastStore';

const API_BASE_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5005' : '')).replace(/\/+$/, '');

export const ForgotPasswordView = () => {
    const [step, setStep] = useState<'request' | 'reset'>('request');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const navigate = useNavigate();
    const { showToast } = useToastStore();

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE_URL}/user/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setSuccess(data.message);
            setStep('reset');
            showToast('Success', 'OTP sent to your email!');
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/user/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, otp, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            showToast('Success', 'Password reset successfully!');
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8">
                <div className="flex flex-col items-center gap-6 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-900 dark:bg-white text-white dark:text-[#070b14] rounded-2xl flex items-center justify-center font-bold tracking-tighter text-base shadow-xl shadow-gray-200 dark:shadow-none">
                            B
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Best For <span className="text-gray-400 dark:text-gray-400 font-medium">Everyone</span>
                        </span>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                    {step === 'request' ? 'Forgot Password' : 'Reset Password'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">
                    {step === 'request'
                        ? 'Enter your username and email to receive an OTP'
                        : 'Enter the OTP sent to your email and your new password'}
                </p>

                {step === 'request' ? (
                    <form onSubmit={handleRequestOTP} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-600 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-600 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                placeholder="Enter your registered email"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-xs font-bold flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-900 dark:bg-white text-white dark:text-[#070b14] py-4 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all disabled:opacity-50 shadow-lg shadow-gray-200 dark:shadow-none click-scale"
                        >
                            {isLoading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-600 mb-2">
                                OTP Code
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20 focus:border-transparent outline-none transition-all text-center text-2xl font-bold tracking-[0.5em] placeholder:text-gray-400"
                                placeholder="• • • • • •"
                                maxLength={6}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-600 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20 focus:border-transparent outline-none transition-all pr-12 placeholder:text-gray-400"
                                    placeholder="Enter new password"
                                    minLength={6}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:text-gray-500 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-600 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                placeholder="Confirm new password"
                                minLength={6}
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-900 dark:bg-white text-white dark:text-[#070b14] py-4 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all disabled:opacity-50 shadow-lg shadow-gray-200 dark:shadow-none click-scale"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>

                        <button
                            type="button"
                            onClick={() => { setStep('request'); setError(null); setSuccess(null); }}
                            className="w-full text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:text-gray-600 font-medium"
                        >
                            Didn't receive OTP? Go back
                        </button>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center gap-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Remember your password?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-gray-900 dark:text-white font-bold hover:underline"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
