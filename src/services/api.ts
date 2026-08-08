import { MedicalReport, User, DashboardStats, ChatMessage, SampleReportOption } from '../types.js';

const API_BASE = '/api';

export async function fetchHealthCheck() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function getCurrentUser(): Promise<User> {
  const token = localStorage.getItem('health_ai_token');
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: token ? { Authorization: token } : {}
  });
  const data = await res.json();
  return data.user;
}

export async function loginUser(email: string): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('health_ai_token', data.token);
  }
  return data.user;
}

export async function googleLoginUser(email: string, fullName?: string): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, fullName })
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('health_ai_token', data.token);
  }
  return data.user;
}

export async function fetchSampleReports(): Promise<SampleReportOption[]> {
  const res = await fetch(`${API_BASE}/reports/samples`);
  const data = await res.json();
  return data.samples || [];
}

export async function uploadAndAnalyzeReport(payload: {
  reportText?: string;
  imageBase64?: string;
  imageMimeType?: string;
  fileName?: string;
  userId?: string;
}): Promise<MedicalReport> {
  const res = await fetch(`${API_BASE}/reports/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to analyze report.');
  }
  return data.report;
}

export async function analyzeSampleReport(sampleId: string, userId?: string): Promise<MedicalReport> {
  const res = await fetch(`${API_BASE}/reports/sample-analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sampleId, userId })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to analyze sample report.');
  }
  return data.report;
}

export async function fetchUserReports(userId?: string, search?: string): Promise<MedicalReport[]> {
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE}/reports?${params.toString()}`);
  const data = await res.json();
  return data.reports || [];
}

export async function fetchReportById(id: string): Promise<{ report: MedicalReport; chatHistory: ChatMessage[] }> {
  const res = await fetch(`${API_BASE}/reports/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Report not found');
  }
  return data;
}

export async function deleteReportById(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/reports/${id}`, { method: 'DELETE' });
  const data = await res.json();
  return data.success;
}

export async function sendReportChatMessage(id: string, userQuestion: string): Promise<ChatMessage[]> {
  const res = await fetch(`${API_BASE}/reports/${id}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userQuestion })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to send message.');
  }
  return data.chatHistory || [];
}

export async function translateReport(id: string, targetLanguage: string): Promise<MedicalReport> {
  const res = await fetch(`${API_BASE}/reports/${id}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetLanguage })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to translate report.');
  }
  return data.report;
}

export async function fetchDashboardStats(userId?: string): Promise<DashboardStats> {
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);

  const res = await fetch(`${API_BASE}/dashboard/stats?${params.toString()}`);
  const data = await res.json();
  return data.stats;
}

export async function fetchAdminAnalytics() {
  const res = await fetch(`${API_BASE}/admin/analytics`);
  return res.json();
}

export async function seedDemoReports() {
  const res = await fetch(`${API_BASE}/admin/seed`, { method: 'POST' });
  return res.json();
}
