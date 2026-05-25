import mongoose from 'mongoose';

const timelineDaySchema = new mongoose.Schema(
  {
    dayNumber: { type: Number, required: true, unique: true },
    week: { type: Number, required: true },
    category: { type: String, enum: ['JAVA', 'DSA', 'CORE', 'PLACEMENT'], required: true },
    title: { type: String, required: true },
    topics: [{ type: String }],
    hours: { type: Number, default: 5 },
    videos: [{ title: String, url: String, source: String }],
    questions: [{ title: String, url: String, difficulty: String, platform: String }],
    revision: { type: String, default: '' },
    unlockDay: { type: Number, required: true },
  },
  { timestamps: true }
);

export const TimelineDay = mongoose.model('TimelineDay', timelineDaySchema);
