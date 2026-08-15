import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { initPaymentPreloader } from './utils/paymentPreloader';
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

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { ImportResumePage } from './pages/ImportResumePage';
import { ATSCheckerPage } from './pages/ATSCheckerPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { EcosystemDashboardPage } from './pages/EcosystemDashboardPage';
import { PublicRecruiterViewPage } from './pages/PublicRecruiterViewPage';
import { LegalPage } from './pages/LegalPage';
import { FounderPage } from './pages/FounderPage';

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

function AppContent() {
  const location = useLocation();
  const isWorkspace = location.pathname === '/builder';

  useEffect(() => {
    initPaymentPreloader();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--ox-bg)] text-[var(--ox-text-primary)] font-sans flex flex-col transition-colors duration-300 selection:bg-orange-500/30 selection:text-slate-950 dark:selection:text-orange-100">
      <Navbar />
      <main className="flex-1 flex flex-col overflow-hidden">
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
