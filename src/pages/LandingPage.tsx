import React from 'react';
import { Activity, ShieldAlert, Sparkles, FileText, Bot, Languages, ArrowRight, CheckCircle2, TrendingUp, Zap } from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner.js';

interface Props {
  onGetStarted: () => void;
  onTrySample: () => void;
}

export const LandingPage: React.FC<Props> = ({ onGetStarted, onTrySample }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Advisory Banner */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <DisclaimerBanner />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Powered by Gemini 3.6 Multimodal AI</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Transform Complex <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Medical Lab Reports</span> into Plain-English Insights
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Upload blood work, metabolic panels, or diagnostic documents. Get instant abnormal test explanations, health risk indicators, medication guides, and multilingual translations.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Activity className="w-5 h-5" />
              <span>Analyze My Medical Report</span>
            </button>

            <button
              onClick={onTrySample}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-800 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Explore Sample Demo Reports</span>
            </button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>PDF, PNG, JPG & DOCX Support</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Multilingual AI Translation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Private & Secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-12 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Comprehensive Health Intelligence</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Designed for non-medical individuals seeking clarity before or after doctor visits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Abnormal Value Flagging</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Highlights high, low, or critical lab parameters with clear reference range context and non-jargon explanations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Biometric Health Trends</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tracks blood glucose, HbA1c, cholesterol, thyroid TSH, and kidney markers across historical reports over time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Interactive AI Medical Chat</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ask follow-up questions directly grounded in your specific lab results with Gemini contextual intelligence.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Languages className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multilingual Translation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Translate report summaries into Hindi, Spanish, Tamil, Telugu, Malayalam, Kannada, French, or German.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Medication & Lifestyle Guidance</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Demystify prescribed medications, side effects, precautions, and actionable dietary and exercise recommendations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Doctor-Ready Export</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generate clean, printable PDF clinical summaries formatted for easy discussion with your attending physician.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">Ready to Understand Your Health Data?</h2>
            <p className="text-xs sm:text-sm text-slate-300 mb-8">
              No technical setup required. Upload your lab report or try our pre-loaded metabolic and CBC panels right now.
            </p>
            <button
              onClick={onGetStarted}
              className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm inline-flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
