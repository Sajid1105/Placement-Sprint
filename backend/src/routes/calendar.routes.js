import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';
import { AppError } from '../utils/errors.js';
import {
  SPRINT_DAYS,
  DAILY_GOAL_HOURS,
  getSprintStartDate,
  dayNumberFromDate,
} from '../config/constants.js';
import { DayEntry } from '../models/DayEntry.js';
import { computeStreakStats } from '../services/streakService.js';

const router = Router();

function dayStatus(entry, dateRef, today) {
  const d = new Date(dateRef);
  d.setHours(0, 0, 0, 0);
  if (d > today) return 'future';
  if (d.getTime() === today.getTime()) return 'today';
  if (!entry || entry.hours === 0) return 'missed';
  if (entry.hours >= DAILY_GOAL_HOURS) return 'complete';
  return 'partial';
}

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { month, year } = req.query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = getSprintStartDate();
    const end = new Date(start);
    end.setDate(end.getDate() + SPRINT_DAYS - 1);

    let rangeStart = start;
    let rangeEnd = end;
    if (month && year) {
      rangeStart = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      rangeEnd = new Date(parseInt(year, 10), parseInt(month, 10), 0);
      if (rangeStart < start) rangeStart = start;
      if (rangeEnd > end) rangeEnd = end;
    }

    const entries = await DayEntry.find({
      user: req.user._id,
      date: { $gte: rangeStart, $lte: rangeEnd },
    }).lean();

    const entryMap = new Map(entries.map((e) => [e.date.toISOString().slice(0, 10), e]));
    const days = [];

    for (let i = 0; i < SPRINT_DAYS; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      if (d < rangeStart || d > rangeEnd) continue;
      const key = d.toISOString().slice(0, 10);
      const entry = entryMap.get(key);
      days.push({
        date: d,
        dayNumber: i + 1,
        hours: entry?.hours || 0,
        topics: entry?.topics || [],
        questions: entry?.questions || 0,
        notes: entry?.notes || '',
        tasks: entry?.tasks || [],
        completed: entry?.completed || false,
        status: dayStatus(entry, d, today),
        entryId: entry?._id,
      });
    }

    const stats = await computeStreakStats(req.user._id);
    res.json({
      success: true,
      days,
      stats: {
        currentStreak: stats.currentStreak,
        longestStreak: stats.longestStreak,
        consistency: stats.consistency,
      },
      sprintStart: start,
      sprintDays: SPRINT_DAYS,
    });
  })
);

router.get(
  '/heatmap',
  protect,
  asyncHandler(async (req, res) => {
    const start = getSprintStartDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const entries = await DayEntry.find({ user: req.user._id }).lean();
    const map = new Map(entries.map((e) => [e.date.toISOString().slice(0, 10), e.hours || 0]));
    const heatmap = [];
    for (let i = 0; i < SPRINT_DAYS; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      heatmap.push({
        date: key,
        dayNumber: i + 1,
        hours: map.get(key) || 0,
        level: Math.min(4, Math.floor((map.get(key) || 0) / 1.25)),
      });
    }
    res.json({ success: true, heatmap });
  })
);

router.get(
  '/:date',
  protect,
  asyncHandler(async (req, res) => {
    const date = new Date(req.params.date + 'T00:00:00');
    if (isNaN(date.getTime())) throw new AppError('Invalid date', 400);
    let entry = await DayEntry.findOne({ user: req.user._id, date });
    if (!entry) {
      entry = await DayEntry.create({
        user: req.user._id,
        date,
        dayNumber: dayNumberFromDate(date),
        hours: 0,
        topics: [],
        questions: 0,
        notes: '',
        tasks: [],
        completed: false,
      });
    }
    res.json({ success: true, entry });
  })
);

router.put(
  '/:date',
  protect,
  asyncHandler(async (req, res) => {
    const date = new Date(req.params.date + 'T00:00:00');
    const { hours, topics, questions, notes, tasks, completed } = req.body;
    let entry = await DayEntry.findOneAndUpdate(
      { user: req.user._id, date },
      {
        $set: {
          dayNumber: dayNumberFromDate(date),
          ...(hours !== undefined && { hours }),
          ...(topics !== undefined && { topics }),
          ...(questions !== undefined && { questions }),
          ...(notes !== undefined && { notes }),
          ...(tasks !== undefined && { tasks }),
          ...(completed !== undefined && { completed }),
        },
        $setOnInsert: { user: req.user._id },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, entry });
  })
);

export default router;
