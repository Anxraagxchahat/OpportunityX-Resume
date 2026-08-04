import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DonationSupportModal } from './components/DonationSupportModal';
import { UnlockAIModal } from './components/UnlockAIModal';
import { BuyCreditsModal } from './components/BuyCreditsModal';
import { AICreditsModal } from './components/AICreditsModal';
import { AIUpgradePromptModal } from './components/AIUpgradePromptModal';

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

export function App() {
  return (
    <ResumeProvider>
      <Router>
        <div className="min-h-screen bg-[#05070D] text-slate-100 font-sans flex flex-col selection:bg-orange-500/30 selection:text-orange-200">
          <Navbar />
          <main className="flex-1">
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
            </Routes>
          </main>
          <Footer />
        </div>
        <DonationSupportModal />
        <UnlockAIModal />
        <BuyCreditsModal />
        <AICreditsModal />
        <AIUpgradePromptModal />
      </Router>
    </ResumeProvider>
  );
}

export default App;

