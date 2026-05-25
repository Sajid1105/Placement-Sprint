import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';
import { Application } from '../models/Application.js';

const router = Router();

const columns = ['wishlist', 'applied', 'oa', 'interview', 'offer', 'rejected'];

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const apps = await Application.find({ user: req.user._id }).sort({ updatedAt: -1 });
    const board = {};
    for (const col of columns) board[col] = [];
    for (const app of apps) {
      const col = columns.includes(app.status) ? app.status : 'wishlist';
      board[col].push(app);
    }
    res.json({ success: true, applications: apps, board, columns });
  })
);

router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const app = await Application.create({ user: req.user._id, ...req.body });
    if (app.applied) {
      req.user.applicationsSent = await Application.countDocuments({
        user: req.user._id,
        applied: true,
      });
      await req.user.save();
    }
    res.status(201).json({ success: true, application: app });
  })
);

router.patch(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true }
    );
    if (!app) return res.status(404).json({ success: false, message: 'Not found' });
    req.user.applicationsSent = await Application.countDocuments({
      user: req.user._id,
      applied: true,
    });
    await req.user.save();
    res.json({ success: true, application: app });
  })
);

router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    await Application.deleteOne({ _id: req.params.id, user: req.user._id });
    req.user.applicationsSent = await Application.countDocuments({
      user: req.user._id,
      applied: true,
    });
    await req.user.save();
    res.json({ success: true, message: 'Deleted' });
  })
);

export default router;
