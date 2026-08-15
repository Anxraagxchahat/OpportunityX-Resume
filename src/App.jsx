import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { initPaymentPreloader } from './utils/paymentPreloader';
import { captureReferralFromUrl } from './utils/referralAttribution';
import { ThemeProvider } from './context/ThemeProvider';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ResumeProvider, useResume } from './context/ResumeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthLoadingScreen } from './components/AuthLoadingScreen';
import { AuthModal } from './components/AuthModal';
import { SupportOpportunityXModal } from './components/SupportOpportunityXModal';
import { DownloadSuccessModal } from './components/DownloadSuccessModal';
import { UnlockAIModal } from './components/UnlockAIModal';
import { BuyCreditsModal } from './components/BuyCreditsModal';
import { AICreditsModal } from './components/AICreditsModal';
import { AIUpgradePromptModal } from './components/AIUpgradePromptModal';
import { GitHubImportModal } from './components/GitHubImportModal';
import { OpportunityXImportModal } from './components/OpportunityXImportModal';
import ResumeMigrationModal from './components/ResumeMigrationModal';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { MobileNavigationProvider } from './context/MobileNavigationContext';
import { MobileMoreMenuModal } from './components/mobile/MobileMoreMenuModal';

import { ScrollToTop } from './components/ScrollToTop';

import {
  NotFoundPage,
  UnauthorizedPage,
  ForbiddenPage,
  ServerErrorPage,
  MaintenancePage
} from './pages/ErrorPages';

// Route-level Code Splitting for Performance
const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const ResumeBuilderPage = lazy(() => import('./pages/ResumeBuilderPage').then((m) => ({ default: m.ResumeBuilderPage })));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage').then((m) => ({ default: m.TemplatesPage })));
const ImportResumePage = lazy(() => import('./pages/ImportResumePage').then((m) => ({ default: m.ImportResumePage })));
const ATSCheckerPage = lazy(() => import('./pages/ATSCheckerPage').then((m) => ({ default: m.ATSCheckerPage })));
const AIAssistantPage = lazy(() => import('./pages/AIAssistantPage').then((m) => ({ default: m.AIAssistantPage })));
const EcosystemDashboardPage = lazy(() => import('./pages/EcosystemDashboardPage').then((m) => ({ default: m.EcosystemDashboardPage })));
const PublicRecruiterViewPage = lazy(() => import('./pages/PublicRecruiterViewPage').then((m) => ({ default: m.PublicRecruiterViewPage })));
const LegalPage = lazy(() => import('./pages/LegalPage').then((m) => ({ default: m.LegalPage })));
const FounderPage = lazy(() => import('./pages/FounderPage').then((m) => ({ default: m.FounderPage })));

/**
 * AuthGate — Prevents rendering the app until Firebase resolves initial auth state.
 * Shows a branded loading screen to prevent UI flickering.
 */
function AuthGate({ children }) {
  const { authLoading } = useAuth();

  if (authLoading) {
    return <AuthLoadingScreen />;
  }

  return children;
}

function ResumeMigrationModalWrapper() {
  const {
    isMigrationModalOpen,
    localGuestResumes,
    migrateLocalResumesToCloud,
    dismissMigrationModal,
    isMigrating
  } = useResume();

  return (
    <ResumeMigrationModal
      isOpen={isMigrationModalOpen}
      onClose={dismissMigrationModal}
      localResumes={localGuestResumes}
      onMigrateToCloud={migrateLocalResumesToCloud}
      onKeepLocalOnly={dismissMigrationModal}
      isMigrating={isMigrating}
    />
  );
}

function RouteLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-400">Loading module...</span>
      </div>
    </div>
  );
}
function AppContent() {
  const location = useLocation();
  const isWorkspace = location.pathname === '/builder';

  useEffect(() => {
    captureReferralFromUrl();
    initPaymentPreloader();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--ox-bg)] text-[var(--ox-text-primary)] font-sans flex flex-col transition-colors duration-300 selection:bg-orange-500/30 selection:text-slate-950 dark:selection:text-orange-100">
      <Navbar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/builder" element={<ResumeBuilderPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/import" element={<ImportResumePage />} />
            <Route path="/ats-checker" element={<ATSCheckerPage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/ecosystem" element={<EcosystemDashboardPage />} />
            <Route path="/u/:slug" element={<PublicRecruiterViewPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/legal/:slug" element={<LegalPage />} />
            <Route path="/founder" element={<FounderPage />} />
            <Route path="/meet-the-founder" element={<FounderPage />} />
            <Route path="/401" element={<UnauthorizedPage />} />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/500" element={<ServerErrorPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      {!isWorkspace && <Footer />}
      <CookieConsentBanner />
    </div>
  );
}

function AuthModalWrapper() {
  const { isAuthOpen, setIsAuthOpen } = useResume();
  return <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />;
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGate>
          <ResumeProvider>
            <Router>
              <MobileNavigationProvider>
                <ScrollToTop />
                <AppContent />
                <MobileMoreMenuModal />
                <AuthModalWrapper />
                <SupportOpportunityXModal />
                <DownloadSuccessModal />
                <UnlockAIModal />
                <BuyCreditsModal />
                <AICreditsModal />
                <AIUpgradePromptModal />
                <GitHubImportModal />
                <OpportunityXImportModal />
                <ResumeMigrationModalWrapper />
              </MobileNavigationProvider>
            </Router>
          </ResumeProvider>
        </AuthGate>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
