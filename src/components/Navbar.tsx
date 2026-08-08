import React from 'react';
import { Activity, FileText, Upload, BookOpen, Sparkles, UserCheck, LogIn, Shield } from 'lucide-react';
import { User } from '../types.js';

interface NavbarProps {
  activeTab: 'landing' | 'dashboard' | 'upload' | 'ranges';
  setActiveTab: (tab: 'landing' | 'dashboard' | 'upload' | 'ranges') => void;
  currentUser: User | null;
  onOpenSampleModal?: () => void;
  onOpenLoginModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenSampleModal,
  onOpenLoginModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070a11]/90 backdrop-blur-xl border-b border-amber-500/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#070a11] rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-lg text-white tracking-tight">
                <span>AI Medical Report Analyzer</span>
              </div>
              <p className="text-[10px] text-amber-400/80 -mt-0.5 font-medium tracking-wide">
                Upload medical reports & view clear AI explanations
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0f1422] p-1.5 rounded-xl border border-amber-500/20">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500/10 text-amber-300 font-bold border border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>REPORTS & UPLOAD</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-amber-500/10 text-amber-300 font-bold border border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Upload className="w-4 h-4 text-amber-400" />
              <span>UPLOAD NEW</span>
            </button>

            <button
              onClick={() => setActiveTab('ranges')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'ranges'
                  ? 'bg-amber-500/10 text-amber-300 font-bold border border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>NORMAL RANGES</span>
            </button>
          </nav>

          {/* Action CTAs & Profile */}
          <div className="flex items-center gap-2.5">
            {onOpenSampleModal && (
              <button
                onClick={onOpenSampleModal}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 transition-all cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.15)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>TRY SAMPLE DEMO</span>
              </button>
            )}

            {onOpenLoginModal && (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md border border-slate-200"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="hidden sm:inline">{currentUser ? currentUser.email.split('@')[0] : 'Sign in with Gmail'}</span>
                <span className="sm:hidden">{currentUser ? 'Account' : 'Gmail'}</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Sub-Nav */}
        <div className="md:hidden flex items-center justify-between gap-1 py-2 overflow-x-auto border-t border-amber-500/20 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap ${
              activeTab === 'upload' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Upload
          </button>
          <button
            onClick={() => setActiveTab('ranges')}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap ${
              activeTab === 'ranges' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Normal Ranges
          </button>
        </div>

      </div>
    </header>
  );
};
