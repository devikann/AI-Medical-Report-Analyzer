export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
}

export type RiskScore = 'Low' | 'Medium' | 'High' | 'Critical';
export type TestStatus = 'Normal' | 'High' | 'Low' | 'Critical';
export type PossibilityLevel = 'Low' | 'Moderate' | 'High';
export type DoctorUrgency = 'Routine Follow-up' | 'Consult Doctor Soon' | 'Immediate Medical Evaluation';

export interface LabResultItem {
  id: string;
  testName: string;
  category: string;
  resultValue: string;
  unit: string;
  referenceRange: string;
  status: TestStatus;
  clinicalSignificance: string;
  explanation: string; // Plain language explanation
}

export interface ConditionPrediction {
  conditionName: string;
  possibilityLevel: PossibilityLevel;
  description: string;
  keyIndicators: string[];
  disclaimer: string;
}

export interface MedicationExplanation {
  medicineName: string;
  dosage: string;
  primaryPurpose: string;
  potentialSideEffects: string[];
  precautions: string[];
}

export interface LifestyleRecommendation {
  category: 'Diet' | 'Exercise' | 'Hydration' | 'Sleep' | 'Stress Management' | 'Follow-up';
  title: string;
  detail: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface MedicalReport {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  originalText: string;
  uploadDate: string;
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  labName?: string;
  reportDate?: string;
  summary: string;
  riskScore: RiskScore;
  confidenceScore: number;
  doctorConsultation: DoctorUrgency;
  doctorNotes?: string;
  labResults: LabResultItem[];
  conditionPredictions: ConditionPrediction[];
  medicationExplanations: MedicationExplanation[];
  lifestyleRecommendations: LifestyleRecommendation[];
  language: string;
}

export interface ChatMessage {
  id: string;
  reportId: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: string;
}

export interface BiometricTrend {
  date: string;
  reportName: string;
  bloodSugar: number | null; // mg/dL
  hemoglobin: number | null; // g/dL
  cholesterol: number | null; // mg/dL
  creatinine: number | null; // mg/dL
  alt: number | null; // U/L
  tsh: number | null; // mIU/L
}

export interface DashboardStats {
  totalReports: number;
  abnormalCount: number;
  criticalAlerts: number;
  latestRiskScore: RiskScore;
  overallHealthScore: number; // 0-100
  recentReports: MedicalReport[];
  biometricTrends: BiometricTrend[];
}

export interface SampleReportOption {
  id: string;
  title: string;
  category: string;
  description: string;
  sampleText: string;
  sampleFileName: string;
}
