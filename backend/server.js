import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './services/db.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Root API Health & Startup Verification
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    system: 'Smart AI Mentor–Mentee Management System',
    version: '2.0.0-PROD-READY',
    architecture: 'Express REST MVC + Pluggable Heuristic AI Engine',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contact', contactRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `API Route ${req.originalUrl} not found.`
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error occurred in Smart AI Mentor service layer.'
  });
});

// Initialize database and start server
async function startServer() {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Smart AI Mentor–Mentee Management System Backend Online`);
    console.log(`   Listening on http://localhost:${PORT}`);
    console.log(`   Health Check: http://localhost:${PORT}/api/health`);
    console.log(`   Authentication: /api/auth/register, /api/auth/login`);
    console.log(`   AI Engine: /api/ai/match-mentors, /api/ai/info`);
    console.log(`=======================================================`);
  });
}

startServer();

export default app;
