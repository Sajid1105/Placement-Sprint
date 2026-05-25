import mongoose from 'mongoose';

const userTimelineProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    dayNumber: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    videoWatched: [{ type: String }],
    questionsDone: [{ type: String }],
  },
  { timestamps: true }
);

userTimelineProgressSchema.index({ user: 1, dayNumber: 1 }, { unique: true });

export const UserTimelineProgress = mongoose.model('UserTimelineProgress', userTimelineProgressSchema);
