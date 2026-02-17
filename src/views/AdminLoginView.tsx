import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import adminApi from '@/lib/adminApi';

export const AdminLoginView = () => {
    const [email, setEmail] = useState('admin@bestforever.com');
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
            localStorage.setItem('adminToken', token);
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
        <div className="fixed inset-0 z-50 bg-slate-50 flex items-center justify-center p-4">
            {/* Background Blur Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-100/50 blur-3xl opacity-60 mix-blend-multiply"></div>
                <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-100/50 blur-3xl opacity-60 mix-blend-multiply"></div>
            </div>

            <div className="relative w-full max-w-sm bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-400">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center text-white text-lg font-semibold shadow-lg mb-4">
                        B
                    </div>
                    <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                        Best For Everyone Enterprise
                    </h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">
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
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 pl-9 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all placeholder:text-slate-400"
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
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 pl-9 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all placeholder:text-slate-400"
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
                                className="rounded border-slate-300 text-slate-900 focus:ring-0 w-3.5 h-3.5"
                            />
                            <span className="text-xs text-slate-500">Remember session</span>
                        </label>
                        <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                            Forgot access?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg shadow-lg shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

                <div className="mt-6 pt-6 border-t border-slate-100 text-center flex flex-col gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider"
                    >
                        Return to User Portal
                    </button>
                    <p className="text-[10px] text-slate-400 font-mono">
                        SYSTEM V2.4.0 • SECURE CONNECTION
                    </p>
                </div>
            </div>
        </div>
    );
};
