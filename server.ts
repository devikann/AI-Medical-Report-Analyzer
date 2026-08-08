import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/dbStore.js';
import { analyzeMedicalReportWithGemini, askGeminiReportChat, translateReportWithGemini } from './server/geminiService.js';
import { SAMPLE_REPORTS_LIST } from './server/sampleReports.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // --- API ROUTES ---

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Auth Routes
  app.post('/api/auth/signup', (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }
    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    const newUser = db.createUser(fullName, email, 'user');
    return res.json({ user: newUser, token: 'jwt-token-' + newUser.id });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    let user = db.getUserByEmail(email);
    if (!user) {
      // Auto-create demo user for smooth testing
      user = db.createUser(email.split('@')[0] || 'User', email, email.includes('admin') ? 'admin' : 'user');
    }
    return res.json({ user, token: 'jwt-token-' + user.id });
  });

  app.post('/api/auth/google', (req, res) => {
    const { email, fullName } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Google email is required' });
    }
    let user = db.getUserByEmail(email);
    if (!user) {
      const name = fullName || email.split('@')[0];
      user = db.createUser(name, email, email.includes('admin') ? 'admin' : 'user');
    }
    return res.json({ user, token: 'jwt-token-' + user.id });
  });

  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // Default to demo user
      const defaultUser = db.getUsers()[0];
      return res.json({ user: defaultUser });
    }
    const userId = authHeader.replace('Bearer jwt-token-', '');
    const user = db.getUserById(userId) || db.getUsers()[0];
    return res.json({ user });
  });

  // Sample Reports Options
  app.get('/api/reports/samples', (req, res) => {
    res.json({ samples: SAMPLE_REPORTS_LIST });
  });

  // Upload & Analyze Report
  app.post('/api/reports/upload', async (req, res) => {
    try {
      const { reportText, imageBase64, imageMimeType, fileName, userId } = req.body;

      if (!reportText && !imageBase64) {
        return res.status(400).json({ error: 'Please provide either document text or an image file to analyze.' });
      }

      const activeUserId = userId || 'user-demo-1';
      const nameOfFile = fileName || 'Medical_Report_' + Date.now() + '.pdf';

      const analyzedReport = await analyzeMedicalReportWithGemini({
        reportText,
        imageBase64,
        imageMimeType,
        fileName: nameOfFile,
        userId: activeUserId
      });

      db.saveReport(analyzedReport);

      return res.json({ report: analyzedReport });
    } catch (err: any) {
      console.error('Upload route error:', err);
      return res.status(500).json({ error: err.message || 'Failed to process and analyze medical report.' });
    }
  });

  // Analyze Preset Sample
  app.post('/api/reports/sample-analyze', async (req, res) => {
    try {
      const { sampleId, userId } = req.body;
      const sample = SAMPLE_REPORTS_LIST.find(s => s.id === sampleId) || SAMPLE_REPORTS_LIST[0];
      const activeUserId = userId || 'user-demo-1';

      const analyzedReport = await analyzeMedicalReportWithGemini({
        reportText: sample.sampleText,
        fileName: sample.sampleFileName,
        userId: activeUserId
      });

      db.saveReport(analyzedReport);

      return res.json({ report: analyzedReport });
    } catch (err: any) {
      console.error('Sample analyze error:', err);
      return res.status(500).json({ error: 'Failed to analyze sample report.' });
    }
  });

  // List User Reports
  app.get('/api/reports', (req, res) => {
    const userId = (req.query.userId as string) || 'user-demo-1';
    const search = req.query.search as string;
    const reports = db.getReports(userId, search);
    return res.json({ reports });
  });

  // Get Single Report
  app.get('/api/reports/:id', (req, res) => {
    const report = db.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Medical report not found' });
    }
    const chatHistory = db.getChatHistory(req.params.id);
    return res.json({ report, chatHistory });
  });

  // Delete Report
  app.delete('/api/reports/:id', (req, res) => {
    const success = db.deleteReport(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Report not found or already deleted' });
    }
    return res.json({ success: true, message: 'Report removed successfully' });
  });

  // Chat with Report Context
  app.post('/api/reports/:id/chat', async (req, res) => {
    try {
      const { id } = req.params;
      const { userQuestion } = req.body;

      if (!userQuestion || !userQuestion.trim()) {
        return res.status(400).json({ error: 'Message cannot be empty' });
      }

      const report = db.getReportById(id);
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      // Add user message
      db.addChatMessage(id, 'user', userQuestion);

      const history = db.getChatHistory(id);

      // Get AI bot answer
      const botReply = await askGeminiReportChat({
        report,
        chatHistory: history,
        userQuestion
      });

      const botMessage = db.addChatMessage(id, 'bot', botReply);

      return res.json({ botMessage, chatHistory: db.getChatHistory(id) });
    } catch (err: any) {
      console.error('Chat endpoint error:', err);
      return res.status(500).json({ error: 'Error generating response from AI Assistant' });
    }
  });

  // Translate Report
  app.post('/api/reports/:id/translate', async (req, res) => {
    try {
      const { id } = req.params;
      const { targetLanguage } = req.body;

      const report = db.getReportById(id);
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      const translatedReport = await translateReportWithGemini(report, targetLanguage || 'en');
      db.saveReport(translatedReport);

      return res.json({ report: translatedReport });
    } catch (err: any) {
      console.error('Translate route error:', err);
      return res.status(500).json({ error: 'Failed to translate report.' });
    }
  });

  // Dashboard Statistics & Biometric Trends
  app.get('/api/dashboard/stats', (req, res) => {
    const userId = (req.query.userId as string) || 'user-demo-1';
    const stats = db.getDashboardStats(userId);
    return res.json({ stats });
  });

  // Admin Routes
  app.get('/api/admin/users', (req, res) => {
    const users = db.getUsers();
    return res.json({ users });
  });

  app.get('/api/admin/analytics', (req, res) => {
    const reports = db.getReports();
    const users = db.getUsers();
    const totalReports = reports.length;
    const totalUsers = users.length;

    const riskBreakdown = {
      Low: reports.filter(r => r.riskScore === 'Low').length,
      Medium: reports.filter(r => r.riskScore === 'Medium').length,
      High: reports.filter(r => r.riskScore === 'High').length,
      Critical: reports.filter(r => r.riskScore === 'Critical').length
    };

    return res.json({
      totalReports,
      totalUsers,
      riskBreakdown,
      aiModel: 'Gemini 3.6 Flash',
      systemHealth: 'Operational 100%'
    });
  });

  app.post('/api/admin/seed', (req, res) => {
    const seeded = db.seedSampleReports();
    return res.json({ message: 'Seeded sample reports successfully', count: seeded.length });
  });

  // --- VITE / STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  🚀 AI Medical Analyzer server is running!`);
    console.log(`  👉 Open in your browser: http://localhost:${PORT}\n`);
  });
}

startServer();
