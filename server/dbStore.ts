import { User, MedicalReport, ChatMessage, BiometricTrend, DashboardStats } from '../src/types.js';
import { MOCK_SEED_REPORTS } from './sampleReports.js';

class DatabaseStore {
  private users: User[] = [
    {
      id: 'user-demo-1',
      email: 'patient@example.com',
      fullName: 'Patient',
      role: 'user',
      createdAt: '2026-01-10T08:00:00.000Z'
    },
    {
      id: 'admin-demo-1',
      email: 'admin@healthai.com',
      fullName: 'Dr. Sarah Connor (Admin)',
      role: 'admin',
      createdAt: '2026-01-01T00:00:00.000Z'
    }
  ];

  private reports: MedicalReport[] = [...MOCK_SEED_REPORTS];

  private chatMessages: ChatMessage[] = [
    {
      id: 'chat-1',
      reportId: 'report-demo-1',
      sender: 'bot',
      message: 'Hello! I am your AI Medical Report Assistant. I have thoroughly analyzed your Lipid & Glucose Metabolic Panel. Feel free to ask any question regarding your lab results, high glucose values, or medication guidance.',
      timestamp: '2026-05-12T10:31:00.000Z'
    }
  ];

  // User Management
  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(fullName: string, email: string, role: 'user' | 'admin' = 'user'): User {
    const newUser: User = {
      id: 'user-' + Date.now(),
      email,
      fullName,
      role,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  // Reports Management
  getReports(userId?: string, search?: string): MedicalReport[] {
    let list = this.reports;
    if (userId) {
      list = list.filter(r => r.userId === userId || userId === 'admin-demo-1');
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.fileName.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        (r.patientName && r.patientName.toLowerCase().includes(q)) ||
        (r.labName && r.labName.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  }

  getReportById(id: string): MedicalReport | undefined {
    return this.reports.find(r => r.id === id);
  }

  saveReport(report: MedicalReport): MedicalReport {
    const index = this.reports.findIndex(r => r.id === report.id);
    if (index >= 0) {
      this.reports[index] = report;
    } else {
      this.reports.unshift(report);
    }
    return report;
  }

  deleteReport(id: string): boolean {
    const initialLen = this.reports.length;
    this.reports = this.reports.filter(r => r.id !== id);
    this.chatMessages = this.chatMessages.filter(c => c.reportId !== id);
    return this.reports.length < initialLen;
  }

  seedSampleReports(): MedicalReport[] {
    this.reports = [...MOCK_SEED_REPORTS];
    return this.reports;
  }

  // Chat Messages
  getChatHistory(reportId: string): ChatMessage[] {
    return this.chatMessages.filter(c => c.reportId === reportId);
  }

  addChatMessage(reportId: string, sender: 'user' | 'bot', message: string): ChatMessage {
    const msg: ChatMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      reportId,
      sender,
      message,
      timestamp: new Date().toISOString()
    };
    this.chatMessages.push(msg);
    return msg;
  }

  // Dashboard Stats & Biometric Trends
  getDashboardStats(userId?: string): DashboardStats {
    const userReports = this.getReports(userId);
    const totalReports = userReports.length;

    let abnormalCount = 0;
    let criticalAlerts = 0;

    userReports.forEach(r => {
      r.labResults.forEach(lr => {
        if (lr.status === 'High' || lr.status === 'Low') abnormalCount++;
        if (lr.status === 'Critical') criticalAlerts++;
      });
    });

    const latestRiskScore = userReports[0]?.riskScore || 'Low';

    // Calculate overall health score (0-100)
    let healthScore = 85;
    if (latestRiskScore === 'Critical') healthScore = 45;
    else if (latestRiskScore === 'High') healthScore = 62;
    else if (latestRiskScore === 'Medium') healthScore = 75;

    // Build trend history from user reports
    const biometricTrends: BiometricTrend[] = userReports
      .map(r => {
        const getVal = (testNameSub: string): number | null => {
          const item = r.labResults.find(l => l.testName.toLowerCase().includes(testNameSub.toLowerCase()));
          if (!item) return null;
          const num = parseFloat(item.resultValue.replace(/[^0-9.]/g, ''));
          return isNaN(num) ? null : num;
        };

        return {
          date: r.reportDate || r.uploadDate.split('T')[0],
          reportName: r.fileName.replace('.pdf', '').replace('.jpg', ''),
          bloodSugar: getVal('glucose') || getVal('blood sugar') || getVal('fbs'),
          hemoglobin: getVal('hemoglobin') || getVal('hb'),
          cholesterol: getVal('total cholesterol') || getVal('cholesterol'),
          creatinine: getVal('creatinine'),
          alt: getVal('alt') || getVal('sgpt'),
          tsh: getVal('tsh')
        };
      })
      .reverse();

    return {
      totalReports,
      abnormalCount,
      criticalAlerts,
      latestRiskScore,
      overallHealthScore: healthScore,
      recentReports: userReports.slice(0, 5),
      biometricTrends
    };
  }
}

export const db = new DatabaseStore();
