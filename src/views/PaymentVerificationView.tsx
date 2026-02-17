import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Icon } from '@iconify/react';

export const PaymentVerificationView = () => {
    const [submitting, setSubmitting] = useState(false);
    const { user, updateUser } = useAuthStore();
    const { toast } = useToast();
    const navigate = useNavigate();

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

    // Poll for status updates
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (user?.paymentStatus === 'submitted') {
            interval = setInterval(async () => {
                try {
                    const response = await authApi.getProfile();
                    if (response.user.paymentStatus !== 'submitted') {
                        updateUser(response.user);
                        if (response.user.paymentStatus === 'approved') {
                            toast({
                                title: "Payment Approved",
                                description: "Welcome to Best For Everyone!",
                                variant: "default" // success
                            });
                            navigate('/dashboard');
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
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
                        <div className={`p-4 rounded-lg border ${status.color === 'amber' ? 'bg-amber-50 border-amber-200' :
                            status.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                                'bg-rose-50 border-rose-200'
                            }`}>
                            <div className="flex items-start gap-3">
                                <Icon
                                    icon={
                                        status.color === 'amber' ? 'solar:info-circle-linear' :
                                            status.color === 'blue' ? 'solar:clock-circle-linear' :
                                                'solar:close-circle-linear'
                                    }
                                    className={`text-xl ${status.color === 'amber' ? 'text-amber-600' :
                                        status.color === 'blue' ? 'text-blue-600' :
                                            'text-rose-600'
                                        }`}
                                />
                                <div>
                                    <h3 className={`text-sm font-semibold ${status.color === 'amber' ? 'text-amber-900' :
                                        status.color === 'blue' ? 'text-blue-900' :
                                            'text-rose-900'
                                        }`}>
                                        {status.title}
                                    </h3>
                                    <p className={`text-xs mt-1 ${status.color === 'amber' ? 'text-amber-700' :
                                        status.color === 'blue' ? 'text-blue-700' :
                                            'text-rose-700'
                                        }`}>
                                        {status.message}
                                    </p>
                                </div>
                            </div>
                        </div>

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
                                    <div className="bg-white border-2 border-slate-200 rounded-xl p-6 inline-block">
                                        <div className="w-56 h-56 bg-white rounded-lg flex items-center justify-center p-2">
                                            <img
                                                src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=shashankmanohar1734@okaxis&pn=BestForEveryone&am=1180&cu=INR"
                                                alt="Payment QR"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                                        <Icon icon="solar:shield-check-linear" className="text-emerald-600" />
                                        <span>Secure payment via UPI</span>
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
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
                                <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Icon icon="solar:clock-circle-linear" className="text-3xl" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">Verification in Progress</h3>
                                <p className="text-sm text-slate-500">
                                    Our admin team is reviewing your payment. You'll be notified once approved.
                                </p>
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
