import React, { useState, useEffect } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  VolumeX,
  Languages,
  Printer,
  Bot,
  ArrowLeft,
  ShieldAlert,
  HelpCircle,
  Activity,
  Heart,
  Pill,
  Apple,
  Sparkles,
  Loader2,
  Clock,
  User,
  ShieldCheck
} from 'lucide-react';
import { MedicalReport, ChatMessage } from '../types.js';
import { fetchReportById, translateReport } from '../services/api.js';
import { ChatbotDrawer } from '../components/ChatbotDrawer.js';
import { ReportPrintModal } from '../components/ReportPrintModal.js';
import { DisclaimerBanner } from '../components/DisclaimerBanner.js';

interface Props {
  reportId: string;
  onBack: () => void;
}

export const ReportDetailPage: React.FC<Props> = ({ reportId, onBack }) => {
  const [report, setReport] = useState<MedicalReport | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  // Text To Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchReportById(reportId);
      setReport(data.report);
      setChatHistory(data.chatHistory || []);
      if (data.report.language) {
        setSelectedLanguage(data.report.language);
      }
    } catch (err) {
      console.error('Failed to load report detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [reportId]);

  const handleTranslate = async (langCode: string) => {
    if (!report || langCode === selectedLanguage || translating) return;
    setTranslating(true);
    try {
      const translated = await translateReport(report.id, langCode);
      setReport(translated);
      setSelectedLanguage(langCode);
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setTranslating(false);
    }
  };

  const handleToggleSpeech = () => {
    if (!report || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `Medical Report Summary for ${report.fileName}. Risk level: ${report.riskScore}. ${report.summary}. Doctor Advice: ${report.doctorConsultation}. ${report.doctorNotes || ''}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-400 mx-auto" />
        <p className="text-sm font-semibold text-slate-300">Retrieving Medical Report Intelligence...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-12 text-center bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-white">Report Not Found</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">The requested report could not be located in database.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const filteredLabResults = report.labResults.filter(lr => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'ABNORMAL') return lr.status === 'High' || lr.status === 'Low' || lr.status === 'Critical';
    return lr.status === filterStatus;
  });

  const languageOptions = [
    { code: 'en', label: 'English (Default)' },
    { code: 'ml', label: 'Malayalam (മലയാളം)' },
    { code: 'hi', label: 'Hindi (हिंदी)' },
    { code: 'ta', label: 'Tamil (தமிழ்)' },
    { code: 'te', label: 'Telugu (తెలుగు)' },
    { code: 'kn', label: 'Kannada (കന്നഡ)' },
    { code: 'es', label: 'Spanish (Español)' },
    { code: 'fr', label: 'French (Français)' },
    { code: 'de', label: 'German (Deutsch)' }
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Advisory Banner */}
      <DisclaimerBanner />

      {/* Back Button & Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Reports</span>
        </button>

        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          {/* Quick Language Switcher Pills */}
          <div className="flex items-center gap-1 bg-[#070a11] p-1 rounded-xl border border-amber-500/30">
            <button
              onClick={() => handleTranslate('en')}
              disabled={translating}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedLanguage === 'en'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-mono'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleTranslate('ml')}
              disabled={translating}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedLanguage === 'ml'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-mono'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              മലയാളം
            </button>
            <button
              onClick={() => handleTranslate('hi')}
              disabled={translating}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedLanguage === 'hi'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-mono'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Extended Multilingual Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#0f1422] border border-amber-500/20 rounded-xl px-2.5 py-1 text-xs text-slate-300">
            <Languages className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              value={selectedLanguage}
              onChange={e => handleTranslate(e.target.value)}
              disabled={translating}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer pr-1 font-mono"
            >
              {languageOptions.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-[#070a11] text-white">
                  {lang.label}
                </option>
              ))}
            </select>
            {translating && <Loader2 className="w-3 h-3 animate-spin text-amber-400 ml-1" />}
          </div>

          {/* Text to Speech Voice Reader */}
          <button
            onClick={handleToggleSpeech}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : 'bg-[#0f1422] hover:bg-amber-500/10 text-slate-300 border-slate-800 hover:border-amber-500/40'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isSpeaking ? 'Stop Voice Reader' : 'Read Aloud'}</span>
          </button>

          {/* Print / Save PDF Export */}
          <button
            onClick={() => setIsPrintOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f1422] hover:bg-amber-500/10 text-slate-200 border border-slate-800 hover:border-amber-500/40 text-xs font-bold transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Doctor PDF Export</span>
          </button>

          {/* Launch Chatbot Drawer */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer border border-amber-400"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Main Overview Card */}
      <div className="bg-[#0f1422] border border-amber-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-mono">
                {report.labName || 'Diagnostic Center'}
              </span>
              <span className="text-xs text-slate-400">Date: {report.reportDate || report.uploadDate.split('T')[0]}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {report.fileName}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span>Patient: <strong className="text-white">{report.patientName || 'Patient'}</strong></span>
              <span>•</span>
              <span>Age / Sex: <strong className="text-white">{report.patientAge || 'Unspecified'} / {report.patientGender || 'Unspecified'}</strong></span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">AI Confidence: {report.confidenceScore}%</span>
            </div>
          </div>

          {/* Risk Badge & Doctor Urgency Callout */}
          <div className="flex flex-col items-start lg:items-end gap-2 w-full lg:w-auto">
            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-xs font-black uppercase tracking-wider ${
              report.riskScore === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
              report.riskScore === 'High' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
              report.riskScore === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' :
              'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`}>
              <ShieldAlert className="w-4 h-4" />
              <span>Assessed Risk: {report.riskScore}</span>
            </div>

            <div className="bg-[#070a11] border border-slate-800 p-2.5 rounded-xl text-xs text-slate-300 max-w-sm">
              <span className="font-bold text-amber-400 block mb-0.5">Doctor Consultation Advice:</span>
              <p className="text-[11px] font-semibold text-white">{report.doctorConsultation}</p>
              {report.doctorNotes && <p className="text-[10px] text-slate-400 mt-1">{report.doctorNotes}</p>}
            </div>
          </div>
        </div>

        {/* Executive Summary Section */}
        <div className="pt-6">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Executive Clinical Summary</span>
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed font-normal bg-[#070a11] p-4 rounded-xl border border-slate-800/80">
            {report.summary}
          </p>
        </div>

      </div>

      {/* SECTION 1: LAB RESULTS TABLE */}
      <div className="bg-[#0f1422] border border-amber-500/20 rounded-2xl p-6 shadow-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <span>Parsed Laboratory Test Values</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Individual biomarker findings matched against standard reference clinical ranges
            </p>
          </div>

          {/* Table Filters */}
          <div className="flex items-center gap-1.5 bg-[#070a11] p-1 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'ABNORMAL', 'High', 'Low', 'Normal'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-mono'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-amber-400 font-mono font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Test Name & Category</th>
                <th className="py-3 px-3">Result Value</th>
                <th className="py-3 px-3">Reference Range</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Plain-English Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLabResults.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No test results found for filter "{filterStatus}".
                  </td>
                </tr>
              ) : (
                filteredLabResults.map(lr => (
                  <tr key={lr.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-white">
                      <div>{lr.testName}</div>
                      <span className="text-[10px] text-slate-500 font-normal">{lr.category}</span>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-amber-300">
                      {lr.resultValue} <span className="text-[10px] text-slate-400 font-normal">{lr.unit}</span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-400 font-mono">
                      {lr.referenceRange} {lr.unit}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        lr.status === 'High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        lr.status === 'Low' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                        lr.status === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {lr.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-300 leading-relaxed">
                      {lr.explanation}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* SECTION 2: CONDITION PREDICTIONS */}
      {report.conditionPredictions.length > 0 && (
        <div className="bg-[#0f1422] border border-amber-500/20 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            <span>Potential Clinical Indications</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.conditionPredictions.map((cp, idx) => (
              <div key={idx} className="bg-[#070a11] p-4 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">{cp.conditionName}</h4>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold font-mono">
                    {cp.possibilityLevel} Correlation
                  </span>
                </div>
                <p className="text-xs text-slate-300">{cp.description}</p>
                {cp.keyIndicators.length > 0 && (
                  <div className="text-[11px] text-slate-400">
                    <strong>Key Markers:</strong> {cp.keyIndicators.join(', ')}
                  </div>
                )}
                <div className="text-[10px] text-amber-400/80 italic pt-1">
                  * {cp.disclaimer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: PRESCRIBED MEDICATIONS */}
      {report.medicationExplanations.length > 0 && (
        <div className="bg-[#0f1422] border border-amber-500/20 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Pill className="w-5 h-5 text-indigo-400" />
            <span>Prescribed Medication Overview</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.medicationExplanations.map((med, idx) => (
              <div key={idx} className="bg-[#070a11] p-4 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">{med.medicineName}</h4>
                  <span className="text-xs text-amber-400 font-semibold font-mono">{med.dosage}</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Purpose:</strong> {med.primaryPurpose}
                </p>
                {med.potentialSideEffects.length > 0 && (
                  <p className="text-[11px] text-slate-400">
                    <strong>Side Effects:</strong> {med.potentialSideEffects.join(', ')}
                  </p>
                )}
                {med.precautions.length > 0 && (
                  <p className="text-[11px] text-amber-300">
                    <strong>Precautions:</strong> {med.precautions.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: LIFESTYLE RECOMMENDATIONS */}
      {report.lifestyleRecommendations.length > 0 && (
        <div className="bg-[#0f1422] border border-amber-500/20 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Apple className="w-5 h-5 text-emerald-400" />
            <span>Actionable Lifestyle & Dietary Recommendations</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.lifestyleRecommendations.map((rec, idx) => (
              <div key={idx} className="bg-[#070a11] p-4 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                    [{rec.category}]
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    rec.priority === 'High' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {rec.priority} Priority
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">{rec.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{rec.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Chatbot FAB */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-2xl shadow-amber-500/30 hover:scale-105 transition-transform cursor-pointer flex items-center gap-2 border border-amber-400"
      >
        <Bot className="w-6 h-6 text-slate-950" />
        <span className="hidden sm:inline text-xs font-extrabold uppercase tracking-wider">Ask AI Assistant</span>
      </button>

      {/* Interactive Chatbot Drawer */}
      <ChatbotDrawer
        report={report}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialHistory={chatHistory}
      />

      {/* Printable Doctor PDF Export Modal */}
      <ReportPrintModal
        report={report}
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
      />

    </div>
  );
};
