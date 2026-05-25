import { DayEntry } from '../models/DayEntry.js';
import { DAILY_GOAL_HOURS, getSprintStartDate, SPRINT_DAYS } from '../config/constants.js';

export async function computeStreakStats(userId) {
  const entries = await DayEntry.find({ user: userId }).sort({ date: -1 }).lean();
  const byDate = new Map(entries.map((e) => [e.date.toISOString().slice(0, 10), e]));

  let current = 0;
  let longest = 0;
  let temp = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < SPRINT_DAYS; i++) {
    const d = new Date(getSprintStartDate());
    d.setDate(d.getDate() + i);
    if (d > today) break;
    const key = d.toISOString().slice(0, 10);
    const entry = byDate.get(key);
    const met = entry && entry.hours >= DAILY_GOAL_HOURS;
    if (met) {
      temp++;
      longest = Math.max(longest, temp);
    } else {
      temp = 0;
    }
  }

  temp = 0;
  for (let i = SPRINT_DAYS - 1; i >= 0; i--) {
    const d = new Date(getSprintStartDate());
    d.setDate(d.getDate() + i);
    if (d > today) continue;
    const key = d.toISOString().slice(0, 10);
    const entry = byDate.get(key);
    const met = entry && entry.hours >= DAILY_GOAL_HOURS;
    if (met) temp++;
    else break;
  }
  current = temp;

  const pastDays = entries.filter((e) => {
    const d = new Date(e.date);
    return d <= today;
  });
  const completedDays = pastDays.filter((e) => e.hours >= DAILY_GOAL_HOURS).length;
  const totalPast = Math.min(
    SPRINT_DAYS,
    Math.floor((today - getSprintStartDate()) / (1000 * 60 * 60 * 24)) + 1
  );
  const consistency =
    totalPast > 0 ? Math.round((completedDays / Math.max(totalPast, 1)) * 100) : 0;

  return { currentStreak: current, longestStreak: longest, consistency };
}

export async function updateUserStreak(user) {
  const stats = await computeStreakStats(user._id);
  user.currentStreak = stats.currentStreak;
  user.longestStreak = Math.max(user.longestStreak, stats.longestStreak);
  await user.save();
  return stats;
}
