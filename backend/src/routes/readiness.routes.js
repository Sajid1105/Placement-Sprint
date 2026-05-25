import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';
import { calculateReadiness } from '../services/readinessService.js';

const router = Router();

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const readiness = await calculateReadiness(req.user);
    res.json({ success: true, ...readiness });
  })
);

export default router;
