import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date },
    durationMinutes: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
    pausedAt: { type: Date },
    totalPausedMs: { type: Number, default: 0 },
    topic: { type: String, default: 'General' },
    xpEarned: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const StudySession = mongoose.model('StudySession', studySessionSchema);
