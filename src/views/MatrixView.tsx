import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { MatrixTree } from '@/components/MatrixTree';
import { PageHeader } from '@/components/PageHeader';
import { useState, useEffect } from 'react';
import { matrixApi, authApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export const MatrixView = () => {
  const { user } = useAuthStore();
  const { matrix: storeMatrix, fetchMatrixStatus } = useAppStore();
  const [matrixData, setMatrixData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<number | null>(null);
  const [maxCycle, setMaxCycle] = useState(user?.matrix?.cycle || 1);
  const { toast } = useToast();

  // Payment states for re-entry modal
  const [paymentStep, setPaymentStep] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [isModalDismissed, setIsModalDismissed] = useState(false);

  useEffect(() => {
    const refreshProfile = async () => {
      try {
        const { updateUser } = useAuthStore.getState();
        const profile = await authApi.getProfile();
        if (profile) updateUser(profile);
      } catch (error) {
        console.error('Failed to refresh profile:', error);
      }
    };
    refreshProfile();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await matrixApi.getHistory();
        if (data.history) setHistory(data.history);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      }
    };
    fetchHistory();
  }, [user]);

  // Initialize selectedCycle once user data is available
  useEffect(() => {
    if (user?.matrix?.cycle && selectedCycle === null) {
      setSelectedCycle(user.matrix.cycle);
      setMaxCycle(user.matrix.cycle);
    }
  }, [user]);

  useEffect(() => {
    const fetchMatrixData = async () => {
      if (selectedCycle === null) return;

      try {
        setLoading(true);
        // Always refresh status from store (Queue Position, etc)
        fetchMatrixStatus();

        const treeData = await matrixApi.getTree(selectedCycle);

        if (treeData) {
          setMatrixData(treeData);
          if (treeData.maxCycle) setMaxCycle(treeData.maxCycle);

          const { updateUser } = useAuthStore.getState();
          updateUser({ 
            isReEntryPending: treeData.isReEntryPending,
            paymentStatus: treeData.paymentStatus 
          });
        }
      } catch (error) {
        console.error('Failed to fetch matrix data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatrixData();

    // Auto-refresh queue status every 10 seconds
    const intervalId = setInterval(() => {
      fetchMatrixStatus();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [selectedCycle, fetchMatrixStatus]);

  const handleUPIPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsProcessingPayment(true);

    const trId = `BFE-RE-${user?.username}-${Date.now()}`;
    const receiverUpi = 'paytm.s21tpy8@pty';
    const amount = 1180;
    const data = `upi://pay?pa=${receiverUpi}&pn=BestForEveryone&am=${amount}&cu=INR&tr=${trId}`;

    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`);

    setTimeout(() => {
      setShowQR(true);
      setIsProcessingPayment(false);
      setPaymentStep(2);
      toast({
        title: 'QR Code Generated',
        description: 'Scan the QR code to complete re-entry payment',
      });
    }, 1000);
  };

  const handleConfirmPayment = async () => {
    try {
      setIsProcessingPayment(true);
      await matrixApi.submitReEntry();
      toast({
        title: 'Payment Submitted',
        description: 'Your re-entry request is now pending admin approval.',
      });
      // Refresh profile to get updated paymentStatus
      const profile = await authApi.getProfile();
      if (profile) useAuthStore.getState().updateUser(profile);
    } catch (error: any) {
      toast({
        title: 'Submission Failed',
        description: error.message || 'Failed to submit payment details',
        variant: 'destructive',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BFE-RE-ENTRY-QR-${Date.now()}.png`;
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

  const l1Filled = matrixData?.level1?.length || 0;
  const l1Total = 6; // Fixed for this system
  const l1Pct = (l1Filled / l1Total) * 100;
  const cycle = selectedCycle || user?.matrix?.cycle || 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading matrix data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4 sm:space-y-6 lg:space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <PageHeader title="6X Matrix Tree" subtitle="Auto-Fill System" />

        {/* Cycle Selector */}
        {maxCycle > 1 && (
          <div className="flex items-center gap-1.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-1.5 rounded-2xl shadow-sm">
            {[...Array(maxCycle)].map((_, i) => {
              const c = i + 1;
              const isActive = selectedCycle === c;
              return (
                <button
                  key={c}
                  onClick={() => {
                    if (c === maxCycle && user?.isReEntryPending) {
                      setIsModalDismissed(false);
                    }
                    setSelectedCycle(c);
                  }}
                  className={`px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 ${isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  Cycle {c}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Historical View Warning */}
      {selectedCycle !== null && selectedCycle < maxCycle && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 p-3 rounded-xl flex items-center gap-3"
        >
          <Icon icon="solar:history-bold-duotone" width={20} className="text-amber-600" />
          <p className="text-xs text-amber-800 dark:text-amber-400 font-semibold">
            You are viewing historical data for <span className="underline decoration-2 underline-offset-2">Cycle #{selectedCycle}</span>.
            This cycle is completed and finalized.
          </p>
        </motion.div>
      )}

      {/* Live Status Banner */}
      <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 sm:p-5 rounded-2xl flex gap-3 items-center">
        <div className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
        </div>
        <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 font-medium">
          Matrix is filling automatically from global spillover activity.
        </p>
      </div>

      {/* Level Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Level 1 Card */}
        <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-800 shadow-card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide mb-1">
                LEVEL 1 STATUS
              </p>
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tighter">
                {l1Filled}
                <span className="text-gray-300 dark:text-gray-600 text-xl sm:text-2xl">/{l1Total}</span>
              </h3>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <Icon icon="solar:users-group-two-rounded-bold" width={20} className="sm:hidden" />
              <Icon icon="solar:users-group-two-rounded-bold" width={24} className="hidden sm:block" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 sm:h-3 mb-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${l1Pct}%` }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-blue-600 h-full rounded-full"
            />
          </div>

          {/* Income Info */}
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
              Potential Income: <span className="font-bold text-gray-900 dark:text-white">₹2,400</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">(₹400 × 6)</span>
            </p>
            {l1Filled === l1Total ? (
              <span className="text-[10px] sm:text-xs font-bold text-white bg-emerald-600 px-3 py-1.5 rounded-xl shadow-lg shadow-emerald-500/30 animate-pulse">
                Completed
              </span>
            ) : (
              <span className="text-[10px] sm:text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-800">
                In Progress
              </span>
            )}
          </div>
        </div>

        {/* Queue Status Card */}
        <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-800 shadow-card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide mb-1">
                YOUR RANK IN QUEUE
              </p>
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tighter">
                #{storeMatrix?.queueRank || '--'}
              </h3>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Icon icon="solar:ranking-bold-duotone" width={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
               <p className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-bold mb-1">Next Child at</p>
               <p className="text-sm font-bold text-gray-900 dark:text-white">+{storeMatrix?.queuePosition || '--'}</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
               <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold mb-1">Waitlist Depth</p>
               <p className="text-sm font-bold text-gray-900 dark:text-white">
                 {storeMatrix?.globalWaitlistLength || 0} IDs
               </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 mt-3">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 flex justify-between items-center">
               <p className="text-[9px] text-gray-400 uppercase font-bold">Total Active Parents</p>
               <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{storeMatrix?.totalActiveParents || 0} People</p>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-4 leading-relaxed italic">
            *Rank represents your turn in the Global FIFO line. Next Child shows how many signups are needed before you receive a placement.
          </p>
        </div>
      </div>

      {/* Matrix Tree Visualization */}
      <MatrixTree level1={matrixData?.level1 || []} />

      {/* Completion History Section */}
      {history.length > 0 && (
        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2 px-1">
            <div className="h-6 w-1 bg-indigo-600 rounded-full" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Completion History</h3>
          </div>

          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                    <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cycle</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Completed On</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Income</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {history.map((h) => (
                    <tr key={h.cycle} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-all group">
                      <td className="px-5 py-4">
                        <span className="text-xs font-bold text-gray-900 dark:text-white bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                          Cycle {h.cycle}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                          {h.completedAt ? new Date(h.completedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {h.completedAt ? new Date(h.completedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : 'Estimated'}
                        </p>
                      </td>
                      <td className="px-5 py-4 font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        ₹2,400
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedCycle(h.cycle);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 ml-auto group-hover:translate-x-[-2px] transition-transform"
                        >
                          View Tree
                          <Icon icon="solar:arrow-right-linear" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Re-entry Modal */}
      {user?.isReEntryPending && !isModalDismissed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-950 w-full max-w-md rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalDismissed(true)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10"
            >
              <Icon icon="solar:close-circle-bold" width={24} />
            </button>
            <div className="p-6 sm:p-8 text-center">
              {user?.paymentStatus === 'submitted' ? (
                <>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon icon="solar:clock-circle-bold-duotone" width={48} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Awaiting Approval</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Your re-entry payment is currently being verified by our team. 
                    Please wait for approval to enter the next cycle.
                  </p>
                  <Button 
                    variant="outline" 
                    fullWidth 
                    onClick={() => setIsModalDismissed(true)}
                  >
                    Close
                  </Button>
                </>
              ) : paymentStep === 1 ? (
                <>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon icon="solar:crown-minimalistic-bold-duotone" width={40} className="sm:hidden" />
                    <Icon icon="solar:crown-minimalistic-bold-duotone" width={48} className="hidden sm:block" />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Cycle Completed! 🎊
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-6 leading-relaxed">
                    Congratulations! You've successfully completed <span className="text-indigo-600 font-bold">Cycle #{user?.matrix?.cycle - 1}</span> of the 6X Matrix.
                  </p>

                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 mb-6 space-y-3 border border-gray-100 dark:border-gray-800/50">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Total Earned</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">₹2,400</span>
                    </div>
                    <div className="h-px bg-gray-200 dark:bg-gray-800 w-full" />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Re-entry Fee</span>
                      <span className="text-gray-900 dark:text-white font-bold">₹1,180</span>
                    </div>
                  </div>

                  <div className="space-y-4">

                    <button
                      onClick={() => handleUPIPayment()}
                      disabled={isProcessingPayment || user?.paymentStatus === 'submitted'}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isProcessingPayment ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        user?.paymentStatus === 'submitted' ? 'Waiting for Approval...' : 'Generate QR & Pay ₹1,180'
                      )}
                    </button>
                    {user?.paymentStatus === 'submitted' && (
                      <p className="text-[10px] text-amber-600 font-bold mt-2 text-center">
                        You have already submitted a payment. Please wait for admin approval.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {user?.paymentStatus === 'submitted' ? (
                    <div className="py-6">
                      <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon icon="solar:clock-circle-bold" width={40} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Awaiting Approval</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                        Your re-entry payment has been submitted and is waiting for admin verification.
                        You can continue to use other platform features in the meantime.
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold py-3.5 rounded-xl transition-all"
                      >
                        Dismiss
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Step 2: Complete Payment</p>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Scan to Pay ₹1,180</h3>
                      </div>

                      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm inline-block mb-6 mx-auto">
                        <img src={qrUrl} alt="Payment QR" className="w-48 h-48 sm:w-56 sm:h-56" />
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 mb-6 text-center border border-gray-100 dark:border-gray-800">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment ID</p>
                        <p className="text-sm font-mono font-bold text-gray-900 dark:text-white">paytm.s21tpy8@pty</p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button
                          onClick={handleDownloadQR}
                          className="flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-transform"
                        >
                          <Icon icon="solar:download-minimalistic-bold" width={18} />
                          Download QR Code
                        </button>

                        <button
                          onClick={handleConfirmPayment}
                          disabled={isProcessingPayment}
                          className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isProcessingPayment ? (
                            <div className="w-5 h-5 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                          ) : "Done, I've Paid"}
                        </button>

                        <button
                          onClick={() => setPaymentStep(1)}
                          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          Back to details
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div >
  );
};
