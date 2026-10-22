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

// Serve static frontend UI files
app.use(express.static(path.join(__dirname, 'public')));

// Serve local upload files for local development mode
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/resumes', resumeRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'CV Vault API',
    timestamp: new Date().toISOString()
  });
});

// Fallback to index.html for Web UI
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server & Connections
const startServer = async () => {
  console.log('--------------------------------------------------');
  console.log('⚡ Initializing CV Vault Full-Stack Server...');
  console.log('--------------------------------------------------');

  await connectDB();
  await initStorage();

  const server = app.listen(PORT, () => {
    console.log('--------------------------------------------------');
    console.log(`🚀 CV Vault App running on http://localhost:${PORT}`);
    console.log(`🌐 Web Interface Live at http://localhost:${PORT}`);
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
