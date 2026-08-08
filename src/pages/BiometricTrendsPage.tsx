import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, FileText } from 'lucide-react';
import { BiometricTrend } from '../types.js';
import { fetchDashboardStats } from '../services/api.js';
import { BiometricTrendChart } from '../components/BiometricTrendChart.js';
import { DisclaimerBanner } from '../components/DisclaimerBanner.js';

export const BiometricTrendsPage: React.FC = () => {
  const [trends, setTrends] = useState<BiometricTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(stats => setTrends(stats.biometricTrends || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Disclaimer */}
      <DisclaimerBanner />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-amber-400" />
          <span>Biometric Parameter History</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor your Fasting Blood Glucose, Hemoglobin, Total Cholesterol, Creatinine, Liver Enzymes (ALT), and TSH Thyroid hormone over past laboratory sessions.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">
          Fetching historical health trends...
        </div>
      ) : (
        <BiometricTrendChart trends={trends} />
      )}

      <div className="bg-[#0f1422] border border-amber-500/20 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <span>Clinical Reference Standard Notes</span>
        </h3>
        <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed">
          <li><strong>Fasting Blood Sugar (Glucose):</strong> Standard fasting reference range is 70 – 99 mg/dL. Values between 100 – 125 mg/dL reflect prediabetes, and values ≥ 126 mg/dL warrant evaluation for diabetes.</li>
          <li><strong>Hemoglobin (Hb):</strong> Normal ranges vary by sex (13.8 – 17.2 g/dL for adult males; 12.1 – 15.1 g/dL for adult females). Values below 12.0 g/dL indicate anemia.</li>
          <li><strong>Total Cholesterol:</strong> Desirable target is under 200 mg/dL. Borderline high is 200 – 239 mg/dL, and ≥ 240 mg/dL is high.</li>
          <li><strong>Serum Creatinine:</strong> Key biomarker for renal filtration. Normal range is typically 0.7 – 1.3 mg/dL. Elevated levels require nephrological evaluation.</li>
        </ul>
      </div>

    </div>
  );
};
