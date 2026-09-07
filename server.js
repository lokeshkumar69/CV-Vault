const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/db');
const { initStorage } = require('./config/azureStorage');
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local upload files for local development mode
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/resumes', resumeRoutes);

// Root API Endpoint Info
app.get('/', (req, res) => {
  res.json({
    name: 'CV Vault Backend REST API',
    status: 'online',
    version: '1.0.0',
    documentation: {
      healthCheck: 'GET /api/health',
      uploadResume: 'POST /api/resumes/upload',
      listResumes: 'GET /api/resumes',
      getStats: 'GET /api/resumes/stats/summary',
      getSingleResume: 'GET /api/resumes/:id',
      deleteResume: 'DELETE /api/resumes/:id'
    }
  });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'CV Vault API',
    timestamp: new Date().toISOString()
  });
});

// 404 Route Handler for unhandled routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Start Server & Connections
const startServer = async () => {
  console.log('--------------------------------------------------');
  console.log('⚡ Initializing CV Vault Pure Backend Server...');
  console.log('--------------------------------------------------');

  await connectDB();
  await initStorage();

  const server = app.listen(PORT, () => {
    console.log('--------------------------------------------------');
    console.log(`🚀 CV Vault Pure Backend API running on http://localhost:${PORT}`);
    console.log(`📡 Health Check endpoint: http://localhost:${PORT}/api/health`);
    console.log('--------------------------------------------------');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[Port Error] Port ${PORT} is already in use by another process.`);
      console.error(`[Solution] Free port ${PORT} or run: Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess | Stop-Process -Force`);
    } else {
      console.error('[Server Error]', err);
    }
  });
};

startServer();
