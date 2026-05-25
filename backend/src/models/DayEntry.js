import mongoose from 'mongoose';

const dayEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    dayNumber: { type: Number, required: true },
    hours: { type: Number, default: 0 },
    topics: [{ type: String }],
    questions: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    tasks: [{ type: String }],
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

dayEntrySchema.index({ user: 1, date: 1 }, { unique: true });

export const DayEntry = mongoose.model('DayEntry', dayEntrySchema);
