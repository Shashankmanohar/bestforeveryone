import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import { Icon } from '@iconify/react';

type PaymentMethod = 'card' | 'upi';

export const PaymentView = () => {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
    const [isProcessing, setIsProcessing] = useState(false);

    // Card details
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVC, setCardCVC] = useState('');

    // UPI details
    const [upiId, setUpiId] = useState('');
    const [qrUrl, setQrUrl] = useState('');
    const [qrData, setQrData] = useState('');
    const [showQR, setShowQR] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { toast } = useToast();

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '').substring(0, 16);
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        return formatted;
    };

    const formatExpiry = (value: string) => {
        const cleaned = value.replace(/\D/g, '').substring(0, 4);
        if (cleaned.length >= 2) {
            return cleaned.substring(0, 2) + '/' + cleaned.substring(2);
        }
        return cleaned;
    };

    const handleCardPayment = async (e: FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            toast({
                title: 'Payment Successful',
                description: 'Your payment has been processed successfully',
            });
            setIsProcessing(false);
            navigate('/dashboard');
        }, 2000);
    };

    const handleUPIPayment = async (e: FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const trId = `BFE-PAY-${user?.username}-${Date.now()}`;
        const receiverUpi = 'paytm.s21tpy8@pty';
        const data = `upi://pay?pa=${receiverUpi}&pn=BestForEveryone&am=1000&cu=INR&tr=${trId}`;
        setQrData(data);
        setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`);

        setTimeout(() => {
            setShowQR(true);
            setIsProcessing(false);
            toast({
                title: 'QR Code Generated',
                description: 'Scan the QR code to complete payment',
            });
        }, 1000);
    };

    const handleDownloadQR = async () => {
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `BFE-PAY-QR-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast({
                title: "Download Failed",
                description: "Failed to download QR Code",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="border border-neutral-200 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
                    {/* Header */}
                    <div className="p-4 border-b border-neutral-100 flex items-center gap-3 bg-neutral-50/30">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-neutral-500 hover:text-black p-1 rounded hover:bg-neutral-200/50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h2 className="text-sm font-semibold">Secure Checkout</h2>
                        <div className="ml-auto flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-1 rounded text-[10px] font-medium border border-green-100">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            TLS 1.3 Encrypted
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Payment Method Tabs */}
                        <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-100 rounded-lg mb-6">
                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`text-xs font-medium py-1.5 rounded-md transition-all ${paymentMethod === 'card'
                                    ? 'bg-white dark:bg-gray-900 shadow-sm text-black border border-neutral-200/50'
                                    : 'text-neutral-500 hover:text-black'
                                    }`}
                            >
                                Credit Card
                            </button>
                            <button
                                onClick={() => setPaymentMethod('upi')}
                                className={`text-xs font-medium py-1.5 rounded-md transition-all ${paymentMethod === 'upi'
                                    ? 'bg-white dark:bg-gray-900 shadow-sm text-black border border-neutral-200/50'
                                    : 'text-neutral-500 hover:text-black'
                                    }`}
                            >
                                UPI / QR
                            </button>
                        </div>

                        {/* Card Payment */}
                        {paymentMethod === 'card' && (
                            <form onSubmit={handleCardPayment} className="space-y-4">
                                {/* Card Visual */}
                                <div className="h-40 w-full rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-950 p-5 text-white flex flex-col justify-between shadow-xl">
                                    <div className="flex justify-between items-start">
                                        <div className="w-9 h-6 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded"></div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="font-mono text-lg tracking-widest text-white/90">
                                            {cardNumber || '0000 0000 0000 0000'}
                                        </p>
                                        <div className="flex justify-between text-[9px] tracking-[0.2em] uppercase text-white/50 font-medium">
                                            <span>{cardName || 'CARD HOLDER'}</span>
                                            <span>{cardExpiry || 'MM/YY'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Form */}
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        placeholder="Card Number"
                                        maxLength={19}
                                        required
                                        className="flex h-10 w-full rounded-md border border-neutral-200 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-all font-mono"
                                    />
                                    <input
                                        type="text"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                        placeholder="Name on Card"
                                        required
                                        className="flex h-10 w-full rounded-md border border-neutral-200 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-all uppercase"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={cardExpiry}
                                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                            placeholder="MM/YY"
                                            maxLength={5}
                                            required
                                            className="flex h-10 w-full rounded-md border border-neutral-200 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-all font-mono"
                                        />
                                        <input
                                            type="password"
                                            value={cardCVC}
                                            onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').substring(0, 3))}
                                            placeholder="CVC"
                                            maxLength={3}
                                            required
                                            className="flex h-10 w-full rounded-md border border-neutral-200 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-all font-mono"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full inline-flex items-center justify-center rounded-md bg-neutral-950 h-10 text-sm font-medium text-white hover:bg-neutral-800 transition-all active:scale-[0.98] mt-2 shadow-sm disabled:opacity-50"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Pay ₹1000.00'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* UPI Payment */}
                        {paymentMethod === 'upi' && (
                            <form onSubmit={handleUPIPayment} className="space-y-6">
                                <div className="text-center py-2 space-y-4">
                                    <div className="flex justify-center -space-x-3">
                                        <div className="w-9 h-9 rounded-full bg-white dark:bg-gray-900 border border-neutral-200 shadow-sm flex items-center justify-center z-10">
                                            <span className="text-sm">G</span>
                                        </div>
                                        <div className="w-9 h-9 rounded-full bg-white dark:bg-gray-900 border border-neutral-200 shadow-sm flex items-center justify-center z-20">
                                            <span className="text-sm">P</span>
                                        </div>
                                        <div className="w-9 h-9 rounded-full bg-white dark:bg-gray-900 border border-neutral-200 shadow-sm flex items-center justify-center z-10">
                                            <span className="text-sm">₹</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-neutral-500 px-8">
                                        Enter your UPI ID to generate a payment QR code instantly.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium leading-none">UPI ID / VPA</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                placeholder="username@bank"
                                                required
                                                className="flex h-10 w-full rounded-md border border-neutral-200 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-all pl-9"
                                            />
                                            <svg
                                                className="absolute left-3 top-2.5 text-neutral-400 w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>

                                    {showQR ? (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <div className="bg-neutral-50 border border-dashed border-neutral-200 rounded-xl p-6 text-center">
                                                <div className="mb-3 flex justify-center">
                                                    <div className="h-12 w-12 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-neutral-100 flex items-center justify-center">
                                                        <Icon icon="solar:qr-code-linear" className="text-2xl text-neutral-400" />
                                                    </div>
                                                </div>
                                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Payment UPI ID</p>
                                                <p className="text-sm font-mono font-bold text-neutral-900">paytm.s21tpy8@pty</p>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={handleDownloadQR}
                                                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
                                                >
                                                    <Icon icon="solar:download-minimalistic-bold" />
                                                    Download QR Code to Pay
                                                </button>
                                                <p className="text-[10px] text-neutral-400">Download and scan in any UPI app to pay ₹1000.00</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => navigate('/dashboard')}
                                                className="w-full inline-flex items-center justify-center rounded-md bg-neutral-950 h-10 text-sm font-medium text-white hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-sm"
                                            >
                                                Done, Go to Dashboard
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full inline-flex items-center justify-center rounded-md bg-neutral-950 h-10 text-sm font-medium text-white hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-sm disabled:opacity-50"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                    Generating...
                                                </>
                                            ) : (
                                                'Generate QR & Pay'
                                            )}
                                        </button>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
