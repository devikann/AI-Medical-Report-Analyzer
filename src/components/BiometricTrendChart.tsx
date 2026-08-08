import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceArea
} from 'recharts';
import { BiometricTrend } from '../types.js';
import { TrendingUp, Activity, AlertCircle } from 'lucide-react';

interface Props {
  trends: BiometricTrend[];
}

export const BiometricTrendChart: React.FC<Props> = ({ trends }) => {
  const [selectedMetric, setSelectedMetric] = useState<
    'bloodSugar' | 'hemoglobin' | 'cholesterol' | 'creatinine' | 'alt' | 'tsh'
  >('bloodSugar');

  const metricConfigs = {
    bloodSugar: {
      label: 'Fasting Blood Sugar',
      unit: 'mg/dL',
      color: '#38bdf8',
      normalMin: 70,
      normalMax: 99,
      dataKey: 'bloodSugar'
    },
    hemoglobin: {
      label: 'Hemoglobin (Hb)',
      unit: 'g/dL',
      color: '#f43f5e',
      normalMin: 12.0,
      normalMax: 15.5,
      dataKey: 'hemoglobin'
    },
    cholesterol: {
      label: 'Total Cholesterol',
      unit: 'mg/dL',
      color: '#fbbf24',
      normalMin: 120,
      normalMax: 200,
      dataKey: 'cholesterol'
    },
    creatinine: {
      label: 'Serum Creatinine',
      unit: 'mg/dL',
      color: '#a855f7',
      normalMin: 0.7,
      normalMax: 1.3,
      dataKey: 'creatinine'
    },
    alt: {
      label: 'Liver ALT (SGPT)',
      unit: 'U/L',
      color: '#10b981',
      normalMin: 7,
      normalMax: 56,
      dataKey: 'alt'
    },
    tsh: {
      label: 'Thyroid TSH',
      unit: 'mIU/L',
      color: '#ec4899',
      normalMin: 0.45,
      normalMax: 4.5,
      dataKey: 'tsh'
    }
  };

  const currentConfig = metricConfigs[selectedMetric];

  const validData = trends.filter(t => t[selectedMetric] !== null);

  return (
    <div className="bg-[#0f1422] border border-amber-500/20 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Biometric Health Trends</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Historical progression across uploaded lab reports
          </p>
        </div>

        {/* Metric Selector Pills */}
        <div className="flex items-center gap-1.5 flex-wrap bg-[#070a11] p-1.5 rounded-xl border border-slate-800">
          {(Object.keys(metricConfigs) as Array<keyof typeof metricConfigs>).map(key => {
            const conf = metricConfigs[key];
            const isActive = selectedMetric === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-mono'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {conf.label.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Reference Range Banner */}
      <div className="flex items-center justify-between bg-[#070a11] border border-slate-800/80 px-4 py-2.5 rounded-xl mb-5 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-white">{currentConfig.label}</span>
          <span className="text-slate-400">({currentConfig.unit})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Target Normal Range:</span>
          <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
            {currentConfig.normalMin} - {currentConfig.normalMax} {currentConfig.unit}
          </span>
        </div>
      </div>

      {validData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
          <AlertCircle className="w-8 h-8 text-slate-500 mb-2" />
          <p className="text-sm text-slate-300 font-medium">No historical data recorded for {currentConfig.label}</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Upload or analyze lab reports containing {currentConfig.label} to map interactive timeline trends.
          </p>
        </div>
      ) : (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                domain={['auto', 'auto']}
                unit={` ${currentConfig.unit}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                }}
                formatter={(val: any) => [`${val} ${currentConfig.unit}`, currentConfig.label]}
                labelFormatter={label => `Report Date: ${label}`}
              />
              <Legend />

              <ReferenceArea
                y1={currentConfig.normalMin}
                y2={currentConfig.normalMax}
              />

              <Line
                type="monotone"
                dataKey={currentConfig.dataKey}
                name={currentConfig.label}
                stroke={currentConfig.color}
                strokeWidth={3}
                dot={{ r: 6, fill: currentConfig.color, stroke: '#0f172a', strokeWidth: 2 }}
                activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
