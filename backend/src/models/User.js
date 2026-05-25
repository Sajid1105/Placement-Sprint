import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    goal: { type: String, default: 'Software placement 5–12 LPA' },
    targetPackage: { type: String, default: '8 LPA' },
    startDate: { type: Date, default: () => new Date(process.env.SPRINT_START_DATE || '2025-06-01') },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalHoursStudied: { type: Number, default: 0 },
    questionsSolved: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    javaProgress: { type: Number, default: 0, min: 0, max: 100 },
    dsaProgress: { type: Number, default: 0, min: 0, max: 100 },
    coreProgress: { type: Number, default: 0, min: 0, max: 100 },
    applicationsSent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model('User', userSchema);
