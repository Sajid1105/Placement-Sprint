import mongoose from 'mongoose';

const userProblemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'DsaProblem', required: true },
    solved: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
    solvedAt: { type: Date },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

userProblemSchema.index({ user: 1, problem: 1 }, { unique: true });

export const UserProblem = mongoose.model('UserProblem', userProblemSchema);
