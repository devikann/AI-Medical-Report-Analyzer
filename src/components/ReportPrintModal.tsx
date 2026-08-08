import React from 'react';
import { X, Printer, Download, ShieldCheck, Activity } from 'lucide-react';
import { MedicalReport } from '../types.js';

interface Props {
  report: MedicalReport;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportPrintModal: React.FC<Props> = ({ report, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Doctor-Ready Export Preview ({report.fileName})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-white text-slate-900 print:p-0 print:overflow-visible font-sans">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Document Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="w-6 h-6 text-blue-600" />
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">CLINICAL MEDICAL REPORT SUMMARY</h1>
                </div>
                <p className="text-xs text-slate-600 mt-1">Medical Report Intelligence & Pathology Biomarker Analysis</p>
              </div>
              <div className="text-right text-xs text-slate-600">
                <p><strong className="text-slate-900">Report Date:</strong> {report.reportDate || report.uploadDate.split('T')[0]}</p>
                <p><strong className="text-slate-900">Lab Provider:</strong> {report.labName || 'Diagnostic Center'}</p>
              </div>
            </div>

            {/* Patient Header Box */}
            <div className="grid grid-cols-3 gap-4 bg-slate-100 p-4 rounded-lg text-xs border border-slate-300">
              <div>
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Patient Name</span>
                <span className="font-bold text-slate-900">{report.patientName || 'Anonymous'}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Age / Gender</span>
                <span className="font-bold text-slate-900">{report.patientAge || 'N/A'} / {report.patientGender || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Assessed Risk Level</span>
                <span className="font-bold text-slate-900">{report.riskScore}</span>
              </div>
            </div>

            {/* Executive Summary */}
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5 border-b border-slate-200 pb-1">
                Executive Clinical Summary
              </h3>
              <p className="text-xs text-slate-800 leading-relaxed bg-blue-50/60 p-3 rounded border border-blue-200">
                {report.summary}
              </p>
            </div>

            {/* Doctor Urgency Note */}
            <div className="bg-amber-50 p-3 rounded border border-amber-300 text-xs">
              <span className="font-bold text-amber-900 block mb-0.5">Doctor Follow-up Advice: {report.doctorConsultation}</span>
              <p className="text-amber-800">{report.doctorNotes}</p>
            </div>

            {/* Pathology Test Findings */}
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider mb-2 border-b border-slate-200 pb-1">
                Lab Biomarker Evaluations
              </h3>
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-200 text-slate-800 font-bold">
                    <th className="p-2 border border-slate-300">Test Name</th>
                    <th className="p-2 border border-slate-300">Result Value</th>
                    <th className="p-2 border border-slate-300">Reference Range</th>
                    <th className="p-2 border border-slate-300">Status</th>
                    <th className="p-2 border border-slate-300">Plain Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  {report.labResults.map((lr, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-2 border border-slate-300 font-bold text-slate-900">{lr.testName}</td>
                      <td className="p-2 border border-slate-300 font-mono font-bold">
                        {lr.resultValue} {lr.unit}
                      </td>
                      <td className="p-2 border border-slate-300 text-slate-600">{lr.referenceRange}</td>
                      <td className={`p-2 border border-slate-300 font-bold ${
                        lr.status === 'High' ? 'text-amber-700' :
                        lr.status === 'Low' ? 'text-yellow-700' :
                        lr.status === 'Critical' ? 'text-red-700' : 'text-emerald-700'
                      }`}>
                        {lr.status}
                      </td>
                      <td className="p-2 border border-slate-300 text-slate-700">{lr.explanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Prescribed Medications */}
            {report.medicationExplanations.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider mb-2 border-b border-slate-200 pb-1">
                  Medication Overview
                </h3>
                <div className="space-y-2">
                  {report.medicationExplanations.map((med, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs">
                      <div className="font-bold text-slate-900">{med.medicineName} ({med.dosage})</div>
                      <p className="text-slate-700 mt-0.5"><strong>Purpose:</strong> {med.primaryPurpose}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lifestyle Guidance */}
            {report.lifestyleRecommendations.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider mb-2 border-b border-slate-200 pb-1">
                  Recommended Health Adjustments
                </h3>
                <ul className="list-disc list-inside text-xs text-slate-800 space-y-1">
                  {report.lifestyleRecommendations.map((rec, idx) => (
                    <li key={idx}>
                      <strong className="text-slate-900">[{rec.category}] {rec.title}:</strong> {rec.detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Document Disclaimer */}
            <div className="border-t border-slate-300 pt-3 text-[10px] text-slate-500 leading-tight">
              <strong>DISCLAIMER:</strong> This report is generated by Medical Report Analyzer for educational reference and record synthesis. It does not replace a registered physician's diagnostic examination or medical prescription.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
