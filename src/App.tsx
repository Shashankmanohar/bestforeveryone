import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { DashboardView } from "./views/DashboardView";
import { MatrixView } from "./views/MatrixView";
import { WithdrawView } from "./views/WithdrawView";
import { WalletView } from "./views/WalletView";
import { ReferralsView } from "./views/ReferralsView";
import { LeadershipView } from "./views/LeadershipView";
import { BonanzaView } from "./views/BonanzaView";
import { ProfileView } from "./views/ProfileView";
import { TermsView } from "./views/TermsView";
import { LoginPage } from "./views/LoginPage";
import { SignupPage } from "./views/SignupPage";
import { AdminLoginView } from "./views/AdminLoginView";
import { AdminView } from "./views/AdminView";
import { PaymentView } from "./views/PaymentView";
import { PaymentVerificationView } from "./views/PaymentVerificationView";
import { ActivateOthers } from "./views/ActivateOthers";
import { useAuthStore } from "./store/useAuthStore";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has verified payment
  if (user && user.paymentStatus !== 'approved' && !user.verified) {
    return <Navigate to="/payment-verification" replace />;
  }

  return <>{children}</>;
};

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdminAuthenticated } = useAuthStore();
  return isAdminAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

const App = () => {
  const { isAuthenticated, isAdminAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
            />
            <Route
              path="/signup"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />}
            />

            {/* Payment Verification (authenticated but not verified) */}
            <Route
              path="/payment-verification"
              element={isAuthenticated ? <PaymentVerificationView /> : <Navigate to="/login" replace />}
            />

            {/* Admin routes */}
            <Route
              path="/admin/login"
              element={isAdminAuthenticated ? <Navigate to="/admin" replace /> : <AdminLoginView />}
            />
            <Route
              path="/admin"
              element={<AdminProtectedRoute><AdminView /></AdminProtectedRoute>}
            />

            {/* Protected routes */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardView />} />
              <Route path="/matrix" element={<MatrixView />} />
              <Route path="/withdraw" element={<WithdrawView />} />
              <Route path="/wallet" element={<WalletView />} />
              <Route path="/referrals" element={<ReferralsView />} />
              <Route path="/leadership" element={<LeadershipView />} />
              <Route path="/bonanza" element={<BonanzaView />} />
              <Route path="/profile" element={<ProfileView />} />
              <Route path="/activate-others" element={<ActivateOthers />} />
              <Route path="/terms" element={<TermsView />} />
              <Route path="/notifications" element={<DashboardView />} />
              <Route path="/payment" element={<PaymentView />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
