import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi, epinApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Icon } from '@iconify/react';

export const PaymentVerificationView = () => {
    const [submitting, setSubmitting] = useState(false);
    const { user, updateUser } = useAuthStore();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [qrUrl, setQrUrl] = useState('');
    const [qrData, setQrData] = useState('');
    const [pin, setPin] = useState('');
    const [activating, setActivating] = useState(false);

    useEffect(() => {
        if (user) {
            const trId = `BFE-${user.username}-${Date.now()}`;
            const upiId = 'paytm.s21tpy8@pty';
            const data = `upi://pay?pa=${upiId}&pn=BestForEveryone&am=1180&cu=INR&tr=${trId}`;
            setQrData(data);
            setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`);
        }
    }, [user]);

    const handleDownloadQR = async () => {
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `BFE-QR-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast({
                title: "Download Started",
                description: "QR Code is being downloaded."
            });
        } catch (error) {
            toast({
                title: "Download Failed",
                description: "Could not download the QR Code. Please try again.",
                variant: "destructive"
            });
        }
    };

    // Immediate redirect if already verified
    useEffect(() => {
        if (user?.verified && user?.paymentStatus === 'approved') {
            navigate('/dashboard', { replace: true });
        }
    }, [user?.verified, user?.paymentStatus, navigate]);

    const handlePaymentSubmit = async () => {
        setSubmitting(true);
        try {
            const response = await authApi.submitPayment();

            toast({
                title: "Payment Submitted",
                description: response.message
            });

            // Update user state
            if (user) {
                updateUser({ ...user, paymentStatus: 'submitted' });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to submit payment",
                variant: "destructive"
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleEpinActivate = async () => {
        if (!pin.trim()) {
            toast({ title: "Error", description: "Please enter E-pin code", variant: "destructive" });
            return;
        }

        setActivating(true);
        try {
            const response = await epinApi.use(pin.trim(), user?.username || '');
            toast({ title: "Success", description: response.message });

            // Refresh profile to get verified status
            const profileRes = await authApi.getProfile();
            updateUser(profileRes.user);
            navigate('/dashboard', { replace: true });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Activation failed",
                variant: "destructive"
            });
        } finally {
            setActivating(false);
        }
    };

    // Poll for status updates
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (user && !user.verified) {
            interval = setInterval(async () => {
                try {
                    const response = await authApi.getProfile();
                    // Update if status changed or verified
                    if (response.user.paymentStatus !== user.paymentStatus || response.user.verified !== user.verified) {
                        updateUser(response.user);

                        if (response.user.paymentStatus === 'approved' && response.user.verified) {
                            toast({
                                title: "Account Activated!",
                                description: "Welcome to Best For Everyone!",
                                variant: "default"
                            });
                            navigate('/dashboard', { replace: true });
                        } else if (response.user.paymentStatus === 'rejected') {
                            toast({
                                title: "Payment Rejected",
                                description: "Please check your details and try again.",
                                variant: "destructive"
                            });
                        }
                    }
                } catch (error) {
                    console.error("Failed to poll status", error);
                }
            }, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [user?.paymentStatus, updateUser, navigate, toast]);

    const getStatusMessage = () => {
        if (user?.matrix?.cycle > 5) {
            return {
                title: 'Reactivation Required',
                message: 'You have completed 5 matrix cycles. Please pay ₹1,180 to activate your account for the next set of cycles.',
                color: 'amber'
            };
        }

        switch (user?.paymentStatus) {
            case 'pending':
            case undefined:
            case null:
            case '':
                return {
                    title: 'Complete Your Payment',
                    message: 'Please scan the QR code and complete the payment to activate your account',
                    color: 'amber'
                };
            case 'submitted':
                return {
                    title: 'Payment Verification in Progress',
                    message: 'Your payment is being verified by our admin team. You will be notified once approved.',
                    color: 'blue'
                };
            case 'rejected':
                return {
                    title: 'Payment Rejected',
                    message: 'Your payment was rejected. Please contact support for assistance.',
                    color: 'rose'
                };
            default:
                return {
                    title: 'Complete Your Payment',
                    message: 'Please complete payment to continue',
                    color: 'amber'
                };
        }
    };

    const status = getStatusMessage();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 bg-white dark:bg-gray-900/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                <Icon icon="solar:shield-check-linear" className="text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold">Payment Verification</h1>
                                <p className="text-xs text-slate-300">Secure Checkout</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Status Alert */}
                        <div className={`p-4 rounded-lg border ${status.color === 'amber' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700' :
                            status.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200' :
                                'bg-rose-50 border-rose-200'
                            }`}>
                            <div className="flex items-start gap-3">
                                <Icon
                                    icon={
                                        status.color === 'amber' ? 'solar:info-circle-linear' :
                                            status.color === 'blue' ? 'solar:clock-circle-linear' :
                                                'solar:close-circle-linear'
                                    }
                                    className={`text-xl ${status.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                                        status.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                                            'text-rose-600'
                                        }`}
                                />
                                <div>
                                    <h3 className={`text-sm font-semibold ${status.color === 'amber' ? 'text-amber-900 dark:text-amber-200' :
                                        status.color === 'blue' ? 'text-blue-900' :
                                            'text-rose-900'
                                        }`}>
                                        {status.title}
                                    </h3>
                                    <p className={`text-xs mt-1 ${status.color === 'amber' ? 'text-amber-700 dark:text-amber-400' :
                                        status.color === 'blue' ? 'text-blue-700' :
                                            'text-rose-700'
                                        }`}>
                                        {status.message}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* E-pin Information for Referred Users */}
                        {user?.referredBy && (
                            <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded-xl p-4 flex gap-3">
                                <Icon icon="solar:ticket-bold" className="text-emerald-500 shrink-0 mt-0.5" width={20} />
                                <div className="space-y-1">
                                    <h3 className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">E-pin Activation</h3>
                                    <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                                        Ask your friend who referring you, for activate your account by epin.
                                    </p>
                                </div>
                            </div>
                        )}

                        {(!user?.paymentStatus || user?.paymentStatus === 'pending') && (
                            <>
                                {/* Payment Details */}
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Joining Fee</span>
                                        <span className="text-xs text-slate-400">One-time payment</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Subtotal</span>
                                            <span className="font-mono">₹1,000.00</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">GST (18%)</span>
                                            <span className="font-mono">₹180.00</span>
                                        </div>
                                        <div className="h-px bg-slate-200 my-2"></div>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-sm font-semibold">Total Amount</span>
                                            <span className="text-2xl font-bold tracking-tight">₹1,180.00</span>
                                        </div>
                                    </div>
                                </div>

                                {/* QR Code */}
                                <div className="text-center space-y-4">
                                    <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center gap-4">
                                        <div className="h-16 w-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm flex items-center justify-center border border-slate-100">
                                            <Icon icon="solar:qr-code-linear" className="text-3xl text-slate-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company UPI ID</p>
                                            <p className="text-sm font-mono font-bold text-slate-900">paytm.s21tpy8@pty</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-3">
                                        <button
                                            onClick={handleDownloadQR}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all click-scale"
                                        >
                                            <Icon icon="solar:download-minimalistic-bold" />
                                            Download QR Code
                                        </button>
                                        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-medium">
                                            <Icon icon="solar:shield-check-linear" className="text-emerald-600 dark:text-emerald-400" />
                                            <span>Secure payment via UPI • Unique Transaction ID</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg p-4">
                                    <h4 className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                        <Icon icon="solar:info-circle-linear" />
                                        Payment Instructions
                                    </h4>
                                    <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                                        <li>Scan the QR code using any UPI app</li>
                                        <li>Complete the payment of ₹1,180</li>
                                        <li>Click "Payment Done" button below</li>
                                        <li>Wait for admin approval</li>
                                    </ol>
                                </div>

                                {/* Support Section */}
                                <div className="space-y-4 pt-2">
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">Facing issues? Contact Support</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                        <a
                                            href="https://wa.me/916299347375"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded-xl hover:bg-emerald-100 transition-all click-scale"
                                        >
                                            <div className="h-8 w-8 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-sm">
                                                <Icon icon="logos:whatsapp-icon" className="text-lg" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-bold text-emerald-900 leading-none mb-1">WhatsApp Support</p>
                                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">+91 6299347375 / 9693794089</p>
                                            </div>
                                            <Icon icon="solar:round-alt-arrow-right-bold" className="ml-auto text-emerald-400" width={16} />
                                        </a>

                                        <a
                                            href="mailto:ishuraj25122002@gmail.com"
                                            className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-xl hover:bg-blue-100 transition-all click-scale"
                                        >
                                            <div className="h-8 w-8 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-sm">
                                                <Icon icon="solar:letter-bold-duotone" className="text-blue-600 dark:text-blue-400 text-lg" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-bold text-blue-900 leading-none mb-1">Email Support</p>
                                                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">ishuraj25122002@gmail.com</p>
                                            </div>
                                            <Icon icon="solar:round-alt-arrow-right-bold" className="ml-auto text-blue-400" width={16} />
                                        </a>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handlePaymentSubmit}
                                    disabled={submitting}
                                    className="w-full bg-slate-900 text-white h-11 rounded-lg font-semibold hover:bg-slate-800 transition-all active:scale-[0.98] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Icon icon="solar:check-circle-linear" className="text-lg" />
                                            Payment Done
                                        </>
                                    )}
                                </button>
                            </>
                        )}

                        {user?.paymentStatus === 'submitted' && (
                            <div className="text-center py-8">
                                <div className="h-16 w-16 bg-blue-100 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Icon icon="solar:clock-circle-linear" className="text-3xl" />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900">Verification in Progress</h3>
                                    <p className="text-sm text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                                        Our admin team is reviewing your payment. You'll be notified once approved.
                                    </p>
                                </div>

                                {/* Support Contacts during wait */}
                                <div className="w-full max-w-[320px] mx-auto pt-4 border-t border-slate-100">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center mb-3">Need help? Contact Support</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        <a
                                            href="https://wa.me/916299347375"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded-xl hover:bg-emerald-100 transition-all click-scale"
                                        >
                                            <div className="h-8 w-8 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-sm">
                                                <Icon icon="logos:whatsapp-icon" className="text-lg" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-bold text-emerald-900 leading-none mb-1">WhatsApp Support</p>
                                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">+91 6299347375 / 9693794089</p>
                                            </div>
                                        </a>

                                        <a
                                            href="mailto:ishuraj25122002@gmail.com"
                                            className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-xl hover:bg-blue-100 transition-all click-scale"
                                        >
                                            <div className="h-8 w-8 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-sm">
                                                <Icon icon="solar:letter-bold-duotone" className="text-blue-600 dark:text-blue-400 text-lg" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-bold text-blue-900 leading-none mb-1">Email Support</p>
                                                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">ishuraj25122002@gmail.com</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {user?.paymentStatus === 'rejected' && (
                            <div className="text-center py-8">
                                <div className="h-16 w-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Icon icon="solar:close-circle-linear" className="text-3xl" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">Payment Rejected</h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    Please contact support for assistance.
                                </p>
                                <button
                                    onClick={() => navigate('/support')}
                                    className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
                                >
                                    Contact Support
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Need help?</span>
                            <button className="text-slate-700 font-medium hover:text-slate-900">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
