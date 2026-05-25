import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    applied: { type: Boolean, default: false },
    appliedAt: { type: Date },
    oa: { type: String, enum: ['pending', 'scheduled', 'cleared', 'rejected', 'na'], default: 'na' },
    interview: { type: String, enum: ['pending', 'scheduled', 'cleared', 'rejected', 'na'], default: 'na' },
    offer: { type: String, enum: ['pending', 'received', 'rejected', 'na'], default: 'na' },
    status: {
      type: String,
      enum: ['wishlist', 'applied', 'oa', 'interview', 'offer', 'rejected'],
      default: 'wishlist',
    },
    notes: { type: String, default: '' },
    package: { type: String, default: '' },
    link: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Application = mongoose.model('Application', applicationSchema);
