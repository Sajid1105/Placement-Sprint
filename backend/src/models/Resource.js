import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, index: true },
    category: { type: String, enum: ['JAVA', 'DSA', 'CORE', 'PLACEMENT'], required: true },
    subtopic: { type: String },
    video: { title: String, url: String, source: String },
    notes: { title: String, url: String },
    practice: { title: String, url: String, platform: String },
    questions: {
      easy: [{ title: String, url: String, platform: String }],
      medium: [{ title: String, url: String, platform: String }],
      hard: [{ title: String, url: String, platform: String }],
    },
    revision: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Resource = mongoose.model('Resource', resourceSchema);
