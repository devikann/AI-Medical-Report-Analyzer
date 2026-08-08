import React, { useState, useEffect } from 'react';
import {
  Activity,
  FileText,
  AlertTriangle,
  Upload,
  Sparkles,
  Clock,
  ArrowRight,
  ShieldCheck,
  Trash2,
  ChevronRight,
  Loader2,
  AlertCircle,
  Search,
  CheckCircle2
} from 'lucide-react';
import { DashboardStats, MedicalReport, SampleReportOption } from '../types.js';
import { fetchDashboardStats, fetchSampleReports, analyzeSampleReport, deleteReportById, uploadAndAnalyzeReport } from '../services/api.js';
import { DisclaimerBanner } from '../components/DisclaimerBanner.js';

interface Props {
  onSelectReport: (reportId: string) => void;
  onNavigateUpload: () => void;
}

export const Dashboard: React.FC<Props> = ({
  onSelectReport,
  onNavigateUpload
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [samples, setSamples] = useState<SampleReportOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Upload States
  const [activeUploadTab, setActiveUploadTab] = useState<'file' | 'text' | 'sample'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sData, sampleList] = await Promise.all([
        fetchDashboardStats(),
        fetchSampleReports()
      ]);
      setStats(sData);
      setSamples(sampleList);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setUploadError(null);
    }
  };

  const processFileUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setUploadError(null);
    setProcessingStatus('Extracting report content and lab parameters...');

    try {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64Data = (reader.result as string).split(',')[1];
            setProcessingStatus('Analyzing report image with Gemini Vision AI...');

            const report = await uploadAndAnalyzeReport({
              imageBase64: base64Data,
              imageMimeType: file.type,
              fileName: file.name
            });

            await loadData();
            setIsProcessing(false);
            onSelectReport(report.id);
          } catch (err: any) {
            setUploadError(err.message || 'Failed to process image report.');
            setIsProcessing(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const textContent = (reader.result as string) || `Medical Report Document: ${file.name}`;
            setProcessingStatus('Evaluating biomarkers and clinical reference ranges...');

            const report = await uploadAndAnalyzeReport({
              reportText: textContent,
              fileName: file.name
            });

            await loadData();
            setIsProcessing(false);
            onSelectReport(report.id);
          } catch (err: any) {
            setUploadError(err.message || 'Failed to analyze report.');
            setIsProcessing(false);
          }
        };
        reader.readAsText(file);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading file.');
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setIsProcessing(true);
    setUploadError(null);
    setProcessingStatus('Analyzing medical text and identifying lab parameters...');

    try {
      const report = await uploadAndAnalyzeReport({
        reportText: rawText,
        fileName: 'Text_Report_' + new Date().toLocaleDateString().replace(/\//g, '-') + '.txt'
      });
      await loadData();
      setIsProcessing(false);
      onSelectReport(report.id);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to analyze pasted text.');
      setIsProcessing(false);
    }
  };

  const handleAnalyzeSample = async (sampleId: string) => {
    try {
      setIsProcessing(true);
      setUploadError(null);
      setProcessingStatus('Loading pre-configured medical sample report...');
      const report = await analyzeSampleReport(sampleId);
      await loadData();
      setIsProcessing(false);
      onSelectReport(report.id);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to analyze sample report.');
      setIsProcessing(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, reportId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this medical report?')) {
      await deleteReportById(reportId);
      loadData();
    }
  };

  const filteredReports = (stats?.recentReports || []).filter(report => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      report.fileName.toLowerCase().includes(term) ||
      report.summary.toLowerCase().includes(term) ||
      (report.riskScore && report.riskScore.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Medical Advisory Disclaimer */}
      <DisclaimerBanner />

      {/* SECTION 1: UPLOAD MEDICAL REPORT */}
      <div className="bg-[#0f1422] border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/10 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Upload className="w-6 h-6 text-amber-400" />
              <span>Upload Medical Report</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select a PDF, image (PNG/JPG), or text report. Google Gemini AI will extract test values, explain terminology, and highlight findings.
            </p>
          </div>

          {/* Upload Method Selector Tabs */}
          <div className="flex items-center p-1 bg-[#070a11] rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveUploadTab('file')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeUploadTab === 'file' ? 'bg-amber-500 text-slate-950 shadow-md font-mono' : 'text-slate-400 hover:text-white'
              }`}
            >
              Document / Image
            </button>
            <button
              onClick={() => setActiveUploadTab('text')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeUploadTab === 'text' ? 'bg-amber-500 text-slate-950 shadow-md font-mono' : 'text-slate-400 hover:text-white'
              }`}
            >
              Paste Text
            </button>
            <button
              onClick={() => setActiveUploadTab('sample')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeUploadTab === 'sample' ? 'bg-amber-500 text-slate-950 shadow-md font-mono' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sample Demos
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {uploadError && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Loading Spinner during analysis */}
        {isProcessing ? (
          <div className="bg-[#070a11] border border-amber-500/30 rounded-2xl p-10 text-center space-y-4 shadow-inner">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Analyzing Medical Report</h3>
              <p className="text-xs text-amber-400 font-medium mt-1 animate-pulse">{processingStatus}</p>
            </div>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Extracting lab parameters, parsing reference ranges, and generating easy-to-understand explanations.
            </p>
          </div>
        ) : (
          <>
            {/* FILE DROPZONE TAB */}
            {activeUploadTab === 'file' && (
              <div className="space-y-4">
                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-amber-500/30 hover:border-amber-500/60 bg-[#070a11] hover:bg-[#0c101c] rounded-2xl p-8 text-center transition-all cursor-pointer group"
                >
                  <input
                    type="file"
                    id="dash-file-upload"
                    accept=".pdf,.png,.jpg,.jpeg,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <label htmlFor="dash-file-upload" className="cursor-pointer block space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#0f1422] border border-slate-800 flex items-center justify-center mx-auto text-amber-400 group-hover:scale-110 transition-transform">
                      {file ? <FileText className="w-7 h-7 text-amber-400" /> : <Upload className="w-7 h-7 text-slate-400 group-hover:text-amber-400" />}
                    </div>

                    {file ? (
                      <div>
                        <span className="text-sm font-bold text-amber-400 block">{file.name}</span>
                        <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(1)} KB) • Ready to analyze</span>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          Drag & drop report or <span className="text-amber-400 underline">browse files</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Supports PDF pathology reports, PNG/JPG lab photos, or DOCX files
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                {file && (
                  <button
                    onClick={processFileUpload}
                    className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer border border-amber-400"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Uploaded File</span>
                  </button>
                )}
              </div>
            )}

            {/* RAW TEXT TAB */}
            {activeUploadTab === 'text' && (
              <form onSubmit={handleTextSubmit} className="space-y-4">
                <div className="bg-[#070a11] border border-slate-800 rounded-2xl p-4">
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Paste Pathology Lab Results or Medical Text
                  </label>
                  <textarea
                    value={rawText}
                    onChange={e => setRawText(e.target.value)}
                    rows={5}
                    placeholder="Paste lab text here (e.g., Fasting Glucose: 138 mg/dL, HbA1c: 7.2%, Total Cholesterol: 240 mg/dL)..."
                    className="w-full bg-[#0f1422] border border-slate-800 focus:border-amber-500/60 rounded-xl p-3 text-xs text-slate-200 focus:outline-none placeholder-slate-600 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!rawText.trim()}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 border border-amber-400"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Pasted Text</span>
                </button>
              </form>
            )}

            {/* SAMPLE DEMOS TAB */}
            {activeUploadTab === 'sample' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {samples.map(sample => (
                  <div
                    key={sample.id}
                    onClick={() => handleAnalyzeSample(sample.id)}
                    className="bg-[#070a11] border border-slate-800 hover:border-amber-500/60 rounded-2xl p-4 hover:bg-[#0d1220] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-amber-400 font-semibold mb-1.5 font-mono">
                        <span>{sample.category}</span>
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors mb-1">
                        {sample.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                        {sample.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>Analyze Sample</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>

      {/* SECTION 2: RECENT UPLOADED DETAILS & HISTORY */}
      <div className="bg-[#0f1422] border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Section Header & Metrics */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/10 pb-5">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Recent Uploaded Medical Reports</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              View previous report analyses, lab parameter breakdowns, and AI recommendations.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3">
            <div className="bg-[#070a11] border border-slate-800 rounded-xl px-3.5 py-2 text-center">
              <div className="text-[10px] text-slate-400 font-mono">TOTAL REPORTS</div>
              <div className="text-base font-black text-amber-400">{stats?.totalReports || 0}</div>
            </div>
            <div className="bg-[#070a11] border border-slate-800 rounded-xl px-3.5 py-2 text-center">
              <div className="text-[10px] text-slate-400 font-mono">ABNORMAL FINDINGS</div>
              <div className="text-base font-black text-amber-400">{stats?.abnormalCount || 0}</div>
            </div>
            <div className="bg-[#070a11] border border-slate-800 rounded-xl px-3.5 py-2 text-center">
              <div className="text-[10px] text-slate-400 font-mono">LATEST RISK</div>
              <div className={`text-xs font-bold mt-1 ${
                stats?.latestRiskScore === 'Critical' ? 'text-red-400' :
                stats?.latestRiskScore === 'High' ? 'text-orange-400' :
                stats?.latestRiskScore === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {stats?.latestRiskScore || 'Low'}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search report by name, summary, or findings..."
            className="w-full bg-[#070a11] border border-slate-800 focus:border-amber-500/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>Loading uploaded report history...</span>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="py-12 text-center bg-[#070a11] border border-dashed border-amber-500/20 rounded-2xl p-6">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-300">No medical reports found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchTerm ? 'Try adjusting your search filter.' : 'Upload a medical document or text report above to view detailed analysis.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReports.map(report => (
              <div
                key={report.id}
                onClick={() => onSelectReport(report.id)}
                className="bg-[#070a11] border border-slate-800/80 hover:border-amber-500/60 rounded-2xl p-4 sm:p-5 hover:bg-[#0d1220] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group shadow-lg"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                    report.riskScore === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    report.riskScore === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                    report.riskScore === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                        {report.fileName}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                        report.riskScore === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        report.riskScore === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        report.riskScore === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {report.riskScore} Risk
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {report.summary}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono pt-0.5 flex-wrap">
                      <span>Date: {report.reportDate || report.uploadDate.split('T')[0]}</span>
                      <span>•</span>
                      <span>{report.labResults.length} Lab Biomarkers Parsed</span>
                      <span>•</span>
                      <span className="text-amber-400 font-medium">Confidence: {report.confidenceScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2.5 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                  <button
                    onClick={(e) => handleDelete(e, report.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all">
                    <span>View Analysis</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
