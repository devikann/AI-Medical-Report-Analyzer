import { execFile } from 'child_process';
import path from 'path';
import { MedicalReport } from '../src/types.js';

function runPythonAnalyzer(action: string, payload: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), 'server', 'analyzer.py');
    const child = execFile('python3', [scriptPath, action], { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Python execution error (${action}):`, stderr || error.message);
        return reject(error);
      }
      try {
        const parsed = JSON.parse(stdout);
        resolve(parsed);
      } catch (parseErr) {
        console.error(`Python JSON output parse error (${action}):`, stdout);
        reject(parseErr);
      }
    });

    if (child.stdin) {
      child.stdin.write(JSON.stringify(payload));
      child.stdin.end();
    }
  });
}

export async function analyzeMedicalReportWithGemini(params: {
  reportText?: string;
  imageBase64?: string;
  imageMimeType?: string;
  fileName: string;
  userId: string;
}): Promise<MedicalReport> {
  try {
    const result = await runPythonAnalyzer('analyze', params);
    return result as MedicalReport;
  } catch (err) {
    console.error('Failed to run Python medical analyzer:', err);
    throw err;
  }
}

export async function askGeminiReportChat(params: {
  report: MedicalReport;
  chatHistory: { sender: string; message: string }[];
  userQuestion: string;
}): Promise<string> {
  try {
    const result = await runPythonAnalyzer('chat', params);
    return typeof result === 'string' ? result : (result.response || JSON.stringify(result));
  } catch (err) {
    console.error('Failed to run Python chat assistant:', err);
    return `Regarding your report (${params.report.fileName}): ${params.report.summary}`;
  }
}

export async function translateReportWithGemini(report: MedicalReport, targetLanguage: string): Promise<MedicalReport> {
  try {
    const result = await runPythonAnalyzer('translate', { report, targetLanguage });
    return result as MedicalReport;
  } catch (err) {
    console.error('Failed to run Python translator:', err);
    return { ...report, language: targetLanguage };
  }
}
