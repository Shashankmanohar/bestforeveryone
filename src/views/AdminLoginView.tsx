import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import adminApi from '@/lib/adminApi';

export const AdminLoginView = () => {
    const [email, setEmail] = useState('admin@bestforeveryone.in');
    const [password, setPassword] = useState('admin@123');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { loginAsAdmin } = useAuthStore();
    const { toast } = useToast();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await adminApi.post('/login', {
                email,
                password,
            });

            const { token, admin } = response.data;
            sessionStorage.setItem('adminToken', token);
            loginAsAdmin(admin, token);


            toast({
                title: 'Login Successful',
                description: 'Welcome to the admin console',
            });

            navigate('/admin');
        } catch (error: any) {
            toast({
                title: 'Access Denied',
                description: error.response?.data?.message || 'Invalid credentials provided',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-[#070b14] flex items-center justify-center p-4 transition-colors duration-300">
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
                        Best For Everyone <span className="text-gray-400 font-medium">Enterprise</span>
                    </h1>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-2">
                        Authorized Personnel Only
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-0.5">
                            Administrator ID
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
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-0.5">
                            Secure Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 transition-all placeholder:text-gray-400 font-medium"
                                placeholder="••••••••"
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

                    <div className="flex items-center justify-between mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 dark:border-gray-700 text-gray-900 focus:ring-0 w-3.5 h-3.5 bg-transparent"
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400">Remember session</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/forgot-password')}
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Forgot access?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-[#070b14] font-bold py-4 rounded-xl shadow-lg shadow-gray-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-50 click-scale"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-gray-900/30 dark:border-t-gray-900 rounded-full animate-spin" />
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <>
                                <span>Authenticate</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 text-center flex flex-col gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-xs font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider"
                    >
                        Return to User Portal
                    </button>
                    <p className="text-[10px] text-slate-400 font-mono mb-2">
                        SYSTEM V2.4.0 • SECURE CONNECTION
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                        Made by <a href="https://webfloratechnologies.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-bold">Webflora Technologies</a>
                    </p>
                </div>
            </div>
        </div>
    );
};
