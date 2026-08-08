import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<Props> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>For educational & informational purposes only. Not a substitute for professional medical advice.</span>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1422] border border-amber-500/30 rounded-xl p-3.5 sm:p-4 text-slate-300 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-lg backdrop-blur-md">
      <div className="p-2 bg-amber-500/15 text-amber-400 rounded-lg shrink-0">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-amber-300 flex items-center gap-1.5 text-xs uppercase tracking-wider mb-0.5">
          <span>Medical Advisory Disclaimer</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          AI Medical Report Analyzer results are generated for educational interpretation only. They do not constitute formal medical diagnosis, clinical prognosis, or prescription guidance. Always share your complete pathology reports with a licensed medical professional or physician for clinical decision-making.
        </p>
      </div>
    </div>
  );
};
