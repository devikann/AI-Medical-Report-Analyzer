import React, { useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Sparkles, AlertCircle, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { uploadAndAnalyzeReport, analyzeSampleReport, fetchSampleReports } from '../services/api.js';
import { SampleReportOption } from '../types.js';
import { DisclaimerBanner } from '../components/DisclaimerBanner.js';

interface Props {
  onReportAnalyzed: (reportId: string) => void;
}

export const UploadReportPage: React.FC<Props> = ({ onReportAnalyzed }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'sample'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [samples, setSamples] = useState<SampleReportOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    fetchSampleReports().then(setSamples).catch(console.error);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const processFileUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setLoadingStatus('Reading document & extracting text/multimodal structure...');

    try {
      if (file.type.startsWith('image/')) {
        // Read as base64 for Gemini Multimodal Vision analysis
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64Data = (reader.result as string).split(',')[1];
            setLoadingStatus('Sending image report to Gemini AI Vision Model...');

            const report = await uploadAndAnalyzeReport({
              imageBase64: base64Data,
              imageMimeType: file.type,
              fileName: file.name
            });

            onReportAnalyzed(report.id);
          } catch (err: any) {
            setError(err.message || 'Failed to process image report.');
            setLoading(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // Text / PDF fallback extraction
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const textContent = (reader.result as string) || `Medical Report Document: ${file.name}`;
            setLoadingStatus('Analyzing lab parameters & evaluating reference ranges...');

            const report = await uploadAndAnalyzeReport({
              reportText: textContent,
              fileName: file.name
            });

            onReportAnalyzed(report.id);
          } catch (err: any) {
            setError(err.message || 'Failed to analyze report.');
            setLoading(false);
          }
        };
        reader.readAsText(file);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during file upload.');
      setLoading(false);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setLoading(true);
    setError(null);
    setLoadingStatus('Running AI pathology parser & clinical assessment...');

    try {
      const report = await uploadAndAnalyzeReport({
        reportText: rawText,
        fileName: 'Pasted_Medical_Report_' + Date.now() + '.txt'
      });
      onReportAnalyzed(report.id);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze text report.');
      setLoading(false);
    }
  };

  const handleSampleClick = async (sampleId: string) => {
    setLoading(true);
    setError(null);
    setLoadingStatus('Loading pre-configured clinical sample panel...');

    try {
      const report = await analyzeSampleReport(sampleId);
      onReportAnalyzed(report.id);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze sample report.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Medical Disclaimer */}
      <DisclaimerBanner />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Analyze Medical Laboratory Report
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Upload PDF, PNG, JPG, or DOCX medical reports. Gemini AI will parse abnormal test values, explain clinical significance, and generate actionable lifestyle advice.
        </p>
      </div>

      {/* Upload Mode Tabs */}
      <div className="flex items-center justify-center p-1.5 bg-[#0f1422] rounded-2xl border border-amber-500/20 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'upload' ? 'bg-amber-500 text-slate-950 shadow-md font-mono' : 'text-slate-400 hover:text-white'
          }`}
        >
          Document / Image File
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'text' ? 'bg-amber-500 text-slate-950 shadow-md font-mono' : 'text-slate-400 hover:text-white'
          }`}
        >
          Paste Raw Text
        </button>
        <button
          onClick={() => setActiveTab('sample')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'sample' ? 'bg-amber-500 text-slate-950 shadow-md font-mono' : 'text-slate-400 hover:text-white'
          }`}
        >
          Try Sample Demo
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Processing Loader */}
      {loading ? (
        <div className="bg-[#0f1422] border border-amber-500/30 rounded-2xl p-12 text-center shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Analyzing Medical Report</h3>
            <p className="text-xs text-amber-400 font-medium mt-1 animate-pulse">{loadingStatus}</p>
          </div>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
            Extracting biomarkers, calculating clinical risk indices, and formatting non-jargon explanations.
          </p>
        </div>
      ) : (
        <>
          {/* TAB 1: FILE DROPZONE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-amber-500/30 hover:border-amber-500/60 bg-[#0f1422] hover:bg-[#131929] rounded-2xl p-10 text-center transition-all cursor-pointer group"
              >
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf,.png,.jpg,.jpeg,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <label htmlFor="file-upload" className="cursor-pointer block space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-[#070a11] border border-slate-800 flex items-center justify-center mx-auto text-amber-400 group-hover:scale-110 transition-transform">
                    {file ? <FileText className="w-8 h-8 text-amber-400" /> : <Upload className="w-8 h-8 text-slate-400 group-hover:text-amber-400" />}
                  </div>

                  {file ? (
                    <div>
                      <span className="text-sm font-bold text-amber-400 block">{file.name}</span>
                      <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(1)} KB) • Ready to analyze</span>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Drag & Drop report document or <span className="text-amber-400 underline">browse files</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Supports PDF pathology reports, PNG/JPG lab images, or DOCX files (Up to 25MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {file && (
                <button
                  onClick={processFileUpload}
                  className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer border border-amber-400"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Start AI Analysis</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 2: RAW TEXT PASTE */}
          {activeTab === 'text' && (
            <form onSubmit={handleTextSubmit} className="space-y-4">
              <div className="bg-[#0f1422] border border-amber-500/20 rounded-2xl p-4">
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Paste Pathology Lab Text or EHR Summary
                </label>
                <textarea
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  rows={8}
                  placeholder="Paste lab result text here (e.g. Glucose: 142 mg/dL, Total Cholesterol: 245 mg/dL, Hemoglobin: 9.2 g/dL)..."
                  className="w-full bg-[#070a11] border border-slate-800 focus:border-amber-500/60 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none placeholder-slate-600 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={!rawText.trim()}
                className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 border border-amber-400"
              >
                <Sparkles className="w-5 h-5" />
                <span>Analyze Pasted Text</span>
              </button>
            </form>
          )}

          {/* TAB 3: SAMPLE PRESETS */}
          {activeTab === 'sample' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {samples.map(sample => (
                <div
                  key={sample.id}
                  onClick={() => handleSampleClick(sample.id)}
                  className="bg-[#0f1422] border border-slate-800 hover:border-amber-500/60 rounded-2xl p-5 hover:bg-[#131929] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-2 font-mono">
                      <span>{sample.category}</span>
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                      {sample.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {sample.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>Load & Analyze Sample</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
};
