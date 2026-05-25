import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';
import { AppError } from '../utils/errors.js';
import { StudySession } from '../models/StudySession.js';
import { DayEntry } from '../models/DayEntry.js';
import { DAILY_GOAL_HOURS, dayNumberFromDate } from '../config/constants.js';
import { xpForMinutes, addXp } from '../services/xpService.js';
import { updateUserStreak } from '../services/streakService.js';

const router = Router();

router.get(
  '/active',
  protect,
  asyncHandler(async (req, res) => {
    const session = await StudySession.findOne({
      user: req.user._id,
      status: { $in: ['active', 'paused'] },
    }).sort({ createdAt: -1 });
    res.json({ success: true, session });
  })
);

router.post(
  '/start',
  protect,
  asyncHandler(async (req, res) => {
    const existing = await StudySession.findOne({
      user: req.user._id,
      status: { $in: ['active', 'paused'] },
    });
    if (existing) throw new AppError('Session already active', 400);

    const session = await StudySession.create({
      user: req.user._id,
      startedAt: new Date(),
      topic: req.body.topic || 'General',
      status: 'active',
    });
    res.status(201).json({ success: true, session });
  })
);

router.post(
  '/:id/pause',
  protect,
  asyncHandler(async (req, res) => {
    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'active',
    });
    if (!session) throw new AppError('Active session not found', 404);
    session.status = 'paused';
    session.pausedAt = new Date();
    await session.save();
    res.json({ success: true, session });
  })
);

router.post(
  '/:id/resume',
  protect,
  asyncHandler(async (req, res) => {
    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'paused',
    });
    if (!session) throw new AppError('Paused session not found', 404);
    if (session.pausedAt) {
      session.totalPausedMs += Date.now() - session.pausedAt.getTime();
    }
    session.status = 'active';
    session.pausedAt = null;
    await session.save();
    res.json({ success: true, session });
  })
);

router.post(
  '/:id/end',
  protect,
  asyncHandler(async (req, res) => {
    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: { $in: ['active', 'paused'] },
    });
    if (!session) throw new AppError('Session not found', 404);

    const end = new Date();
    let pausedExtra = 0;
    if (session.status === 'paused' && session.pausedAt) {
      pausedExtra = end.getTime() - session.pausedAt.getTime();
    }
    const elapsed =
      end.getTime() -
      session.startedAt.getTime() -
      (session.totalPausedMs + pausedExtra);
    const minutes = Math.max(0, Math.floor(elapsed / 60000));
    const hours = minutes / 60;

    session.endedAt = end;
    session.durationMinutes = minutes;
    session.status = 'completed';
    session.xpEarned = xpForMinutes(minutes);
    await session.save();

    const xpResult = await addXp(req.user, session.xpEarned);
    req.user.totalHoursStudied = Math.round((req.user.totalHoursStudied + hours) * 10) / 10;
    await req.user.save();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const entry = await DayEntry.findOneAndUpdate(
      { user: req.user._id, date: today },
      {
        $inc: { hours: Math.round(hours * 10) / 10 },
        $setOnInsert: {
          dayNumber: dayNumberFromDate(today),
          topics: [],
          questions: 0,
          notes: '',
          tasks: [],
          completed: false,
        },
      },
      { upsert: true, new: true }
    );
    const fixedHours = entry.hours;
    await DayEntry.updateOne(
      { _id: entry._id },
      { $set: { completed: fixedHours >= DAILY_GOAL_HOURS } }
    );

    if (fixedHours >= DAILY_GOAL_HOURS) {
      await updateUserStreak(req.user);
    }

    res.json({
      success: true,
      session,
      hoursAdded: hours,
      xp: xpResult,
      dayEntry: await DayEntry.findById(entry._id),
    });
  })
);

router.get(
  '/history',
  protect,
  asyncHandler(async (req, res) => {
    const sessions = await StudySession.find({
      user: req.user._id,
      status: 'completed',
    })
      .sort({ endedAt: -1 })
      .limit(50)
      .lean();
    res.json({ success: true, sessions });
  })
);

export default router;
