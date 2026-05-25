import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';
import { TimelineDay } from '../models/TimelineDay.js';
import { UserTimelineProgress } from '../models/UserTimelineProgress.js';
import { dayNumberFromDate } from '../config/constants.js';

const router = Router();

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const unlockedThrough = Math.max(1, dayNumberFromDate(today));

    const days = await TimelineDay.find().sort({ dayNumber: 1 }).lean();
    const progress = await UserTimelineProgress.find({ user: req.user._id }).lean();
    const progressMap = new Map(progress.map((p) => [p.dayNumber, p]));

    const enriched = days.map((d) => ({
      ...d,
      locked: d.dayNumber > unlockedThrough,
      unlocked: d.dayNumber <= unlockedThrough,
      progress: progressMap.get(d.dayNumber) || null,
    }));

    res.json({ success: true, days: enriched, unlockedThrough });
  })
);

router.get(
  '/:dayNumber',
  protect,
  asyncHandler(async (req, res) => {
    const dayNumber = parseInt(req.params.dayNumber, 10);
    const day = await TimelineDay.findOne({ dayNumber }).lean();
    if (!day) return res.status(404).json({ success: false, message: 'Day not found' });
    const today = new Date();
    const unlockedThrough = dayNumberFromDate(today);
    const progress = await UserTimelineProgress.findOne({
      user: req.user._id,
      dayNumber,
    }).lean();
    res.json({
      success: true,
      day: { ...day, locked: dayNumber > unlockedThrough, progress },
    });
  })
);

router.post(
  '/:dayNumber/complete',
  protect,
  asyncHandler(async (req, res) => {
    const dayNumber = parseInt(req.params.dayNumber, 10);
    const { videoWatched, questionsDone } = req.body;
    const progress = await UserTimelineProgress.findOneAndUpdate(
      { user: req.user._id, dayNumber },
      {
        $set: {
          completed: true,
          completedAt: new Date(),
          ...(videoWatched && { videoWatched }),
          ...(questionsDone && { questionsDone }),
        },
      },
      { upsert: true, new: true }
    );
    res.json({ success: true, progress });
  })
);

router.patch(
  '/:dayNumber/progress',
  protect,
  asyncHandler(async (req, res) => {
    const dayNumber = parseInt(req.params.dayNumber, 10);
    const progress = await UserTimelineProgress.findOneAndUpdate(
      { user: req.user._id, dayNumber },
      { $set: req.body },
      { upsert: true, new: true }
    );
    res.json({ success: true, progress });
  })
);

export default router;
