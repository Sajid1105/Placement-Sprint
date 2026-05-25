import mongoose from 'mongoose';

const userResourceProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
    videoCompleted: { type: Boolean, default: false },
    practiceCompleted: { type: Boolean, default: false },
    notesRead: { type: Boolean, default: false },
    questionsSolved: [{ type: String }],
  },
  { timestamps: true }
);

userResourceProgressSchema.index({ user: 1, resource: 1 }, { unique: true });

export const UserResourceProgress = mongoose.model('UserResourceProgress', userResourceProgressSchema);
