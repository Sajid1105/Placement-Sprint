import mongoose from 'mongoose';

const dsaProblemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    topic: { type: String, required: true, index: true },
    platform: { type: String, enum: ['LeetCode', 'GFG', 'Striver', 'CodeStudio'], required: true },
    url: { type: String, required: true },
    tags: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const DsaProblem = mongoose.model('DsaProblem', dsaProblemSchema);
