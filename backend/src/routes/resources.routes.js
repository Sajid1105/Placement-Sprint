import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';
import { Resource } from '../models/Resource.js';
import { UserResourceProgress } from '../models/UserResourceProgress.js';

const router = Router();

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { category, topic } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (topic) filter.topic = new RegExp(topic, 'i');
    const resources = await Resource.find(filter).sort({ order: 1 }).lean();
    const progress = await UserResourceProgress.find({ user: req.user._id }).lean();
    const pmap = new Map(progress.map((p) => [p.resource.toString(), p]));
    res.json({
      success: true,
      resources: resources.map((r) => ({
        ...r,
        progress: pmap.get(r._id.toString()) || null,
      })),
    });
  })
);

router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const resource = await Resource.findById(req.params.id).lean();
    if (!resource) return res.status(404).json({ success: false, message: 'Not found' });
    const progress = await UserResourceProgress.findOne({
      user: req.user._id,
      resource: resource._id,
    }).lean();
    res.json({ success: true, resource, progress });
  })
);

router.patch(
  '/:id/progress',
  protect,
  asyncHandler(async (req, res) => {
    const progress = await UserResourceProgress.findOneAndUpdate(
      { user: req.user._id, resource: req.params.id },
      { $set: req.body },
      { upsert: true, new: true }
    );
    res.json({ success: true, progress });
  })
);

export default router;
