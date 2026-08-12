const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/db');
const { initStorage } = require('./config/azureStorage');
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/resumes', resumeRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'CV Vault API',
    timestamp: new Date().toISOString()
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const startServer = async () => {
  console.log('--------------------------------------------------');
  console.log('⚡ Initializing CV Vault Server...');
  console.log('--------------------------------------------------');

  await connectDB();
  await initStorage();

  const server = app.listen(PORT, () => {
    console.log('--------------------------------------------------');
    console.log(`🚀 Server running smoothly on http://localhost:${PORT}`);
    console.log(`📄 Dashboard live at http://localhost:${PORT}`);
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
