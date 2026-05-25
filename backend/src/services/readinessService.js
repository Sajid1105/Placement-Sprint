import { UserProblem } from '../models/UserProblem.js';
import { DsaProblem } from '../models/DsaProblem.js';
import { UserTimelineProgress } from '../models/UserTimelineProgress.js';
import { TimelineDay } from '../models/TimelineDay.js';
import { computeStreakStats } from './streakService.js';

export async function calculateReadiness(user) {
  const javaDayNums = await TimelineDay.find({ category: 'JAVA' }).distinct('dayNumber');
  const dsaDayNums = await TimelineDay.find({ category: 'DSA' }).distinct('dayNumber');
  const coreDayNums = await TimelineDay.find({ category: 'CORE' }).distinct('dayNumber');

  const javaDone = await UserTimelineProgress.countDocuments({
    user: user._id,
    completed: true,
    dayNumber: { $in: javaDayNums },
  });
  const javaProgress =
    javaDayNums.length > 0
      ? Math.min(100, Math.round((javaDone / javaDayNums.length) * 100))
      : user.javaProgress;

  const dsaTotal = await DsaProblem.countDocuments();
  const dsaSolved = await UserProblem.countDocuments({ user: user._id, solved: true });
  const dsaProgress =
    dsaTotal > 0 ? Math.min(100, Math.round((dsaSolved / dsaTotal) * 100)) : user.dsaProgress;

  const coreDone = await UserTimelineProgress.countDocuments({
    user: user._id,
    completed: true,
    dayNumber: { $in: coreDayNums },
  });
  const coreProgress =
    coreDayNums.length > 0
      ? Math.min(100, Math.round((coreDone / coreDayNums.length) * 100))
      : user.coreProgress;

  const { consistency } = await computeStreakStats(user._id);

  const score = Math.round(
    (javaProgress * 0.3 + dsaProgress * 0.4 + coreProgress * 0.2 + consistency * 0.1) / 1
  );

  const weaknesses = [];
  if (javaProgress < 60) weaknesses.push({ area: 'Java', score: javaProgress, weight: 30 });
  if (dsaProgress < 60) weaknesses.push({ area: 'DSA', score: dsaProgress, weight: 40 });
  if (coreProgress < 60) weaknesses.push({ area: 'Core', score: coreProgress, weight: 20 });
  if (consistency < 60) weaknesses.push({ area: 'Consistency', score: consistency, weight: 10 });

  user.javaProgress = javaProgress;
  user.dsaProgress = dsaProgress;
  user.coreProgress = coreProgress;
  await user.save();

  return {
    score,
    breakdown: {
      java: { score: javaProgress, weight: 30 },
      dsa: { score: dsaProgress, weight: 40 },
      core: { score: coreProgress, weight: 20 },
      consistency: { score: consistency, weight: 10 },
    },
    weaknesses: weaknesses.sort((a, b) => a.score - b.score),
  };
}
