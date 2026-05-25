import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';
import {
  SPRINT_DAYS,
  DAILY_GOAL_HOURS,
  getSprintStartDate,
  dayNumberFromDate,
} from '../config/constants.js';
import { DayEntry } from '../models/DayEntry.js';
import { StudySession } from '../models/StudySession.js';
import { Application } from '../models/Application.js';
import { computeStreakStats } from '../services/streakService.js';
import { calculateReadiness } from '../services/readinessService.js';
import { UserProblem } from '../models/UserProblem.js';

const router = Router();

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentDay = Math.max(1, Math.min(SPRINT_DAYS, dayNumberFromDate(today)));
    const daysRemaining = Math.max(0, SPRINT_DAYS - currentDay);

    const todayEntry = await DayEntry.findOne({ user: req.user._id, date: today });
    const streakStats = await computeStreakStats(req.user._id);
    req.user.currentStreak = streakStats.currentStreak;
    req.user.longestStreak = Math.max(req.user.longestStreak, streakStats.longestStreak);
    await req.user.save();

    const readiness = await calculateReadiness(req.user);
    const questionsSolved = await UserProblem.countDocuments({
      user: req.user._id,
      solved: true,
    });
    const applicationsSent = await Application.countDocuments({
      user: req.user._id,
      applied: true,
    });

    const activeSession = await StudySession.findOne({
      user: req.user._id,
      status: { $in: ['active', 'paused'] },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        hero: 'Placement Sprint',
        currentDay,
        daysRemaining,
        sprintStart: getSprintStartDate(),
        sprintDays: SPRINT_DAYS,
        currentStreak: streakStats.currentStreak,
        longestStreak: streakStats.longestStreak,
        consistency: streakStats.consistency,
        hoursStudied: req.user.totalHoursStudied,
        questionsSolved,
        placementReadiness: readiness.score,
        readinessBreakdown: readiness.breakdown,
        weaknesses: readiness.weaknesses,
        applicationsSent,
        dailyGoalHours: DAILY_GOAL_HOURS,
        todayHours: todayEntry?.hours || 0,
        xp: req.user.xp,
        level: req.user.level,
        goal: req.user.goal,
        targetPackage: req.user.targetPackage,
        activeSession: activeSession || null,
      },
    });
  })
);

export default router;
