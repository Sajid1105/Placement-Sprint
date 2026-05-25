import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';
import { AppError } from '../utils/errors.js';
import { Note } from '../models/Note.js';

const router = Router();

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { folder, q } = req.query;
    const filter = { user: req.user._id };
    if (folder) filter.folder = folder;
    let notes;
    if (q) {
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      notes = await Note.find({
        ...filter,
        $or: [{ title: regex }, { content: regex }],
      }).sort({ updatedAt: -1 });
    } else {
      notes = await Note.find(filter).sort({ updatedAt: -1 });
    }
    res.json({ success: true, notes });
  })
);

router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { title, content, folder } = req.body;
    if (!title) throw new AppError('Title required', 400);
    const note = await Note.create({
      user: req.user._id,
      title,
      content: content || '',
      folder: folder || 'General',
    });
    res.status(201).json({ success: true, note });
  })
);

router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, note });
  })
);

router.put(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true }
    );
    if (!note) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, note });
  })
);

router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    await Note.deleteOne({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Deleted' });
  })
);

export default router;
