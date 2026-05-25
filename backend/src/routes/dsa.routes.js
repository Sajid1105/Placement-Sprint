import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';
import { DsaProblem } from '../models/DsaProblem.js';
import { UserProblem } from '../models/UserProblem.js';

const router = Router();

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { topic, difficulty, platform, solved } = req.query;
    const filter = {};
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;
    if (platform) filter.platform = platform;

    const problems = await DsaProblem.find(filter).sort({ order: 1 }).lean();
    const userProgress = await UserProblem.find({ user: req.user._id }).lean();
    const pmap = new Map(userProgress.map((p) => [p.problem.toString(), p]));

    let result = problems.map((p) => ({
      ...p,
      userProgress: pmap.get(p._id.toString()) || { solved: false, attempts: 0 },
    }));

    if (solved === 'true') result = result.filter((p) => p.userProgress.solved);
    if (solved === 'false') result = result.filter((p) => !p.userProgress.solved);

    const stats = {
      total: problems.length,
      solved: userProgress.filter((p) => p.solved).length,
      byTopic: {},
      byDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
    };
    for (const p of problems) {
      stats.byTopic[p.topic] = stats.byTopic[p.topic] || { total: 0, solved: 0 };
      stats.byTopic[p.topic].total++;
    }
    for (const up of userProgress.filter((p) => p.solved)) {
      const prob = problems.find((pr) => pr._id.toString() === up.problem.toString());
      if (prob) {
        stats.byTopic[prob.topic].solved = (stats.byTopic[prob.topic].solved || 0) + 1;
        stats.byDifficulty[prob.difficulty]++;
      }
    }

    res.json({ success: true, problems: result, stats });
  })
);

router.patch(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const { solved, attempts, notes } = req.body;
    const update = {};
    if (attempts !== undefined) update.attempts = attempts;
    if (notes !== undefined) update.notes = notes;
    if (solved !== undefined) {
      update.solved = solved;
      if (solved) {
        update.solvedAt = new Date();
        const existing = await UserProblem.findOne({
          user: req.user._id,
          problem: req.params.id,
        });
        if (!existing?.solved) {
          req.user.questionsSolved += 1;
          await req.user.save();
        }
      }
    }

    const record = await UserProblem.findOneAndUpdate(
      { user: req.user._id, problem: req.params.id },
      { $set: update, $inc: attempts === undefined && solved === undefined ? {} : {} },
      { upsert: true, new: true }
    );

    if (req.body.incrementAttempt) {
      record.attempts += 1;
      await record.save();
    }

    res.json({ success: true, record });
  })
);

export default router;
