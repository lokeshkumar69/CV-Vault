const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
      trim: true
    },
    storageName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      default: 'General',
      enum: ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Data Science', 'UI/UX Design', 'General', 'Other']
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    notes: {
      type: String,
      default: ''
    },
    candidateName: {
      type: String,
      default: 'Anonymous Candidate'
    },
    storageProvider: {
      type: String,
      enum: ['azure', 'local'],
      default: 'local'
    }
  },
  {
    timestamps: true
  }
);

ResumeSchema.index({ originalName: 'text', candidateName: 'text', notes: 'text', tags: 'text' });

module.exports = mongoose.model('Resume', ResumeSchema);
