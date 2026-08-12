const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadFile, deleteFile, getStorageStatus } = require('../config/azureStorage');
const { getDBStatus } = require('../config/db');
const Resume = require('../models/Resume');

const memoryDb = [];

router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a file to upload.' });
    }

    const { category, tags, notes, candidateName } = req.body;
    const parsedTags = tags ? tags.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];

    const storageResult = await uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    const resumeData = {
      originalName: req.file.originalname,
      storageName: storageResult.storageName,
      fileUrl: storageResult.fileUrl,
      mimeType: req.file.mimetype,
      size: req.file.size,
      category: category || 'General',
      tags: parsedTags,
      notes: notes || '',
      candidateName: candidateName || 'Anonymous Candidate',
      storageProvider: storageResult.provider
    };

    let savedResume;
    if (getDBStatus()) {
      savedResume = await Resume.create(resumeData);
    } else {
      savedResume = {
        _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        ...resumeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memoryDb.unshift(savedResume);
    }

    res.status(201).json({
      success: true,
      message: `Resume uploaded successfully to ${storageResult.provider === 'azure' ? 'Azure Blob Storage' : 'Local Storage'}.`,
      data: savedResume
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to upload resume.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;

    if (getDBStatus()) {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { originalName: { $regex: search, $options: 'i' } },
          { candidateName: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      const resumes = await Resume.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: resumes.length, data: resumes });
    } else {
      let results = [...memoryDb];
      if (category && category !== 'All') {
        results = results.filter(r => r.category === category);
      }
      if (search) {
        const s = search.toLowerCase();
        results = results.filter(
          r =>
            r.originalName.toLowerCase().includes(s) ||
            r.candidateName.toLowerCase().includes(s) ||
            r.notes.toLowerCase().includes(s) ||
            r.tags.some(t => t.toLowerCase().includes(s))
        );
      }
      return res.json({ success: true, count: results.length, data: results });
    }
  } catch (error) {
    console.error('Get Resumes Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve resumes.' });
  }
});

router.get('/stats/summary', async (req, res) => {
  try {
    let items = [];
    if (getDBStatus()) {
      items = await Resume.find();
    } else {
      items = memoryDb;
    }

    const totalCount = items.length;
    const totalSizeBytes = items.reduce((acc, curr) => acc + (curr.size || 0), 0);
    const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);

    const categoriesCount = items.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});

    const storageProvider = getStorageStatus();

    res.json({
      success: true,
      data: {
        totalCount,
        totalSizeBytes,
        totalSizeMB: `${totalSizeMB} MB`,
        categoriesCount,
        storageProvider: storageProvider.provider,
        dbStatus: getDBStatus() ? 'Connected (MongoDB Atlas/Local)' : 'In-Memory (Offline Mode)'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get stats.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let resume;
    if (getDBStatus()) {
      resume = await Resume.findById(req.params.id);
    } else {
      resume = memoryDb.find(r => r._id === req.params.id);
    }

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }
    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving resume.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let resume;
    if (getDBStatus()) {
      resume = await Resume.findById(req.params.id);
    } else {
      const idx = memoryDb.findIndex(r => r._id === req.params.id);
      if (idx !== -1) resume = memoryDb[idx];
    }

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    await deleteFile(resume.storageName, resume.storageProvider);

    if (getDBStatus()) {
      await Resume.findByIdAndDelete(req.params.id);
    } else {
      const idx = memoryDb.findIndex(r => r._id === req.params.id);
      if (idx !== -1) memoryDb.splice(idx, 1);
    }

    res.json({ success: true, message: 'Resume deleted successfully.' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete resume.' });
  }
});

module.exports = router;
