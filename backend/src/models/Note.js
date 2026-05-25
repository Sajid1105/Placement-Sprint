import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    folder: {
      type: String,
      enum: ['Java', 'DSA', 'DBMS', 'OS', 'CN', 'General'],
      default: 'General',
    },
  },
  { timestamps: true }
);

export const Note = mongoose.model('Note', noteSchema);
