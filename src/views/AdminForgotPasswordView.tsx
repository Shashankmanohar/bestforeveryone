import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5005' : '')).replace(/\/+$/, '');

export const AdminForgotPasswordView = () => {
    const [step, setStep] = useState<'request' | 'reset'>('request');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { toast } = useToast();

    const handleRequestOTP = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/admin/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast({
                title: 'OTP Sent',
                description: 'Check your email for the verification code',
            });
            setStep('reset');
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message || 'Failed to send OTP',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (newPassword !== confirmPassword) {
            toast({
                title: 'Error',
                description: 'Passwords do not match',
                variant: 'destructive',
            });
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/admin/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast({
                title: 'Password Reset',
                description: 'Your password has been reset successfully',
            });
            navigate('/admin/login');
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message || 'Failed to reset password',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-50 flex items-center justify-center p-4">
            {/* Background Blur Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-100/50 blur-3xl opacity-60 mix-blend-multiply"></div>
                <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-100/50 blur-3xl opacity-60 mix-blend-multiply"></div>
            </div>

            <div className="relative w-full max-w-sm bg-white dark:bg-gray-950/80 backdrop-blur-xl border border-gray-100 dark:border-white/10 shadow-2xl rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-400">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-12 w-12 bg-gray-900 dark:bg-white text-white dark:text-[#070b14] rounded-2xl flex items-center justify-center font-bold tracking-tighter text-xl shadow-xl mb-4">
                        B
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {step === 'request' ? 'Forgot Password' : 'Reset Password'}
                    </h1>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-2">
                        {step === 'request'
                            ? 'Enter your admin email to receive an OTP'
                            : 'Enter the OTP and your new password'}
                    </p>
                </div>

                {step === 'request' ? (
                    <form onSubmit={handleRequestOTP} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-0.5">
                                Administrator Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 transition-all placeholder:text-gray-400 font-medium"
                                    placeholder="name@company.com"
                                    required
                                />
                                <svg
                                    className="absolute left-3 top-2.5 text-slate-400 w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-900 dark:bg-white text-white dark:text-[#070b14] font-bold py-4 rounded-xl shadow-lg shadow-gray-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-50 click-scale"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-gray-900/30 dark:border-t-gray-900 rounded-full animate-spin" />
                                    <span>Sending OTP...</span>
                                </>
                            ) : (
                                <>
                                    <span>Send OTP</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-0.5">
                                Verification Code
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 transition-all text-center text-xl font-bold tracking-[0.5em] placeholder:text-gray-400 placeholder:tracking-normal placeholder:text-sm placeholder:font-normal"
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-0.5">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 transition-all placeholder:text-gray-400 font-medium"
                                    placeholder="••••••••"
                                    minLength={6}
                                    required
                                />
                                <svg
                                    className="absolute left-3 top-2.5 text-slate-400 w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
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
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-0.5">
                                Confirm Password
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 transition-all placeholder:text-gray-400 font-medium"
                                placeholder="••••••••"
                                minLength={6}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-900 dark:bg-white text-white dark:text-[#070b14] font-bold py-4 rounded-xl shadow-lg shadow-gray-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-50 click-scale"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-gray-900/30 dark:border-t-gray-900 rounded-full animate-spin" />
                                    <span>Resetting...</span>
                                </>
                            ) : (
                                <>
                                    <span>Reset Password</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => { setStep('request'); }}
                            className="w-full text-xs text-slate-400 hover:text-slate-600 font-medium mt-1"
                        >
                            Didn't receive OTP? Go back
                        </button>
                    </form>
                )}

                <div className="mt-6 pt-6 border-t border-slate-100 text-center flex flex-col gap-4">
                    <button
                        onClick={() => navigate('/admin/login')}
                        className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider"
                    >
                        Back to Admin Login
                    </button>
                    <p className="text-[10px] text-slate-400 font-mono">
                        SYSTEM V2.4.0 • SECURE CONNECTION
                    </p>
                </div>
            </div>
        </div>
    );
};
