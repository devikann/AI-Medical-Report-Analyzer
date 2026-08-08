import React, { useState } from 'react';
import { X, LogIn, Mail, CheckCircle2, ShieldCheck, User as UserIcon, LogOut } from 'lucide-react';
import { User } from '../types.js';
import { googleLoginUser } from '../services/api.js';

interface GmailLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLoginSuccess: (user: User) => void;
  onLogout: () => void;
}

export const GmailLoginModal: React.FC<GmailLoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout
}) => {
  const [gmailAddress, setGmailAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleSimulating, setGoogleSimulating] = useState(false);

  if (!isOpen) return null;

  const handleGmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gmailAddress.trim()) return;

    if (!gmailAddress.includes('@')) {
      setError('Please enter a valid Gmail address (e.g., user@gmail.com)');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const user = await googleLoginUser(gmailAddress.trim(), fullName.trim() || undefined);
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Gmail.');
    } finally {
      setLoading(false);
    }
  };

  const handleOneClickGoogleSignIn = async () => {
    try {
      setGoogleSimulating(true);
      setError(null);
      
      // Simulate quick Google Auth popup response or auto-detect
      const sampleEmail = gmailAddress.trim() || 'user.health@gmail.com';
      const sampleName = fullName.trim() || 'Gmail User';
      
      setTimeout(async () => {
        try {
          const user = await googleLoginUser(sampleEmail, sampleName);
          onLoginSuccess(user);
          setGoogleSimulating(false);
          onClose();
        } catch (err: any) {
          setError(err.message || 'Google Auth failed.');
          setGoogleSimulating(false);
        }
      }, 600);
    } catch (err: any) {
      setError('Failed to initiate Google sign in.');
      setGoogleSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0f1422] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-amber-500/40 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Sign In with Google / Gmail
          </h2>
          <p className="text-xs text-slate-400">
            Access your secure medical reports and upload new lab results
          </p>
        </div>

        {/* Current User Logged In state */}
        {currentUser ? (
          <div className="bg-[#070a11] border border-amber-500/30 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'G'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">{currentUser.fullName}</p>
                <p className="text-xs text-amber-400 font-mono truncate">{currentUser.email}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Account</span>
            </button>
          </div>
        ) : (
          <>
            {/* Primary Google One-Click Button */}
            <button
              onClick={handleOneClickGoogleSignIn}
              disabled={googleSimulating}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-lg transition-all cursor-pointer border border-slate-300 active:scale-95"
            >
              {/* Official Google SVG Logo */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{googleSimulating ? 'Connecting Google Account...' : 'Continue with Google / Gmail'}</span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-800 w-full"></div>
              <span className="bg-[#0f1422] px-3 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                Or enter Gmail details
              </span>
            </div>

            {/* Manual Gmail Form */}
            <form onSubmit={handleGmailSignIn} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Gmail Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={gmailAddress}
                      onChange={e => setGmailAddress(e.target.value)}
                      placeholder="your.email@gmail.com"
                      className="w-full bg-[#070a11] border border-slate-800 focus:border-amber-500/60 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Full Name (Optional)
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-[#070a11] border border-slate-800 focus:border-amber-500/60 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !gmailAddress.trim()}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-40"
              >
                {loading ? 'Signing In...' : 'Sign In with Gmail'}
              </button>
            </form>
          </>
        )}

        <div className="text-center pt-2 border-t border-slate-800/80">
          <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1 font-mono">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span>Encrypted Session • Medical Data Privacy Protected</span>
          </p>
        </div>

      </div>
    </div>
  );
};
