import React, { useState, useEffect } from 'react';
import { User, MedicalReport, SampleReportOption } from './types.js';
import { getCurrentUser, fetchSampleReports, analyzeSampleReport } from './services/api.js';
import { Navbar } from './components/Navbar.js';
import { LandingPage } from './pages/LandingPage.js';
import { Dashboard } from './pages/Dashboard.js';
import { UploadReportPage } from './pages/UploadReportPage.js';
import { ReportDetailPage } from './pages/ReportDetailPage.js';
import { ReferenceRangesPage } from './pages/ReferenceRangesPage.js';
import { GmailLoginModal } from './components/GmailLoginModal.js';
import { X, Sparkles, FileText, ArrowRight, Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'dashboard' | 'upload' | 'ranges'>('dashboard');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modals
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [samples, setSamples] = useState<SampleReportOption[]>([]);
  const [sampleLoadingId, setSampleLoadingId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser().then(setCurrentUser).catch(console.error);
    fetchSampleReports().then(setSamples).catch(console.error);
  }, []);

  const handleSelectReport = (reportId: string) => {
    setSelectedReportId(reportId);
  };

  const handleBackToDashboard = () => {
    setSelectedReportId(null);
    setActiveTab('dashboard');
  };

  const handleTabChange = (tab: 'landing' | 'dashboard' | 'upload' | 'ranges') => {
    setSelectedReportId(null);
    setActiveTab(tab);
  };

  const handleSampleSelect = async (sampleId: string) => {
    try {
      setSampleLoadingId(sampleId);
      const report = await analyzeSampleReport(sampleId);
      setIsSampleModalOpen(false);
      setSelectedReportId(report.id);
    } catch (err) {
      console.error('Failed to analyze sample report:', err);
    } finally {
      setSampleLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentUser={currentUser}
        onOpenSampleModal={() => setIsSampleModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {selectedReportId ? (
          <ReportDetailPage
            reportId={selectedReportId}
            onBack={handleBackToDashboard}
          />
        ) : activeTab === 'landing' ? (
          <LandingPage
            onGetStarted={() => setActiveTab('upload')}
            onTrySample={() => setIsSampleModalOpen(true)}
          />
        ) : activeTab === 'dashboard' ? (
          <Dashboard
            onSelectReport={handleSelectReport}
            onNavigateUpload={() => setActiveTab('upload')}
          />
        ) : activeTab === 'upload' ? (
          <UploadReportPage
            onReportAnalyzed={(reportId) => setSelectedReportId(reportId)}
          />
        ) : activeTab === 'ranges' ? (
          <ReferenceRangesPage />
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-500/20 bg-[#070a11]/90 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white">AI Medical Report Analyzer</span>
          </div>

          <p className="text-[11px] text-slate-500 max-w-md">
            For educational & informational reference only. Does not replace professional clinical diagnosis.
          </p>
        </div>
      </footer>

      {/* Sample Demonstration Selector Modal */}
      {isSampleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070a11]/90 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0f1422] border border-amber-500/30 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Select Pre-Loaded Medical Sample</span>
              </div>

              <button
                onClick={() => setIsSampleModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {samples.map(sample => (
                <div
                  key={sample.id}
                  onClick={() => handleSampleSelect(sample.id)}
                  className="p-4 rounded-2xl bg-[#070a11] hover:bg-[#131a2d] border border-slate-800 hover:border-amber-500/60 transition-all cursor-pointer group flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                      {sample.category}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {sample.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {sample.description}
                    </p>
                  </div>

                  <button
                    disabled={sampleLoadingId === sample.id}
                    className="shrink-0 p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-slate-950 font-bold transition-all"
                  >
                    {sampleLoadingId === sample.id ? (
                      <span className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin block" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Gmail Login Modal */}
      <GmailLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => setCurrentUser(user)}
        onLogout={() => {
          localStorage.removeItem('health_ai_token');
          setCurrentUser(null);
        }}
      />
    </div>
  );
}
