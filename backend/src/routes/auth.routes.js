import { Router } from 'express';
import validator from 'validator';
import { User } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { asyncHandler } from '../utils/errors.js';
import { AppError } from '../utils/errors.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';
import { protect } from '../middleware/auth.js';
import { getSprintStartDate } from '../config/constants.js';

const router = Router();

function setTokens(res, accessToken, refreshToken) {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password, goal, targetPackage, startDate } = req.body;
    if (!name || !email || !password) throw new AppError('Name, email and password required', 400);
    if (!validator.isEmail(email)) throw new AppError('Invalid email', 400);
    if (password.length < 6) throw new AppError('Password must be at least 6 characters', 400);
    const exists = await User.findOne({ email });
    if (exists) throw new AppError('Email already registered', 409);

    const user = await User.create({
      name,
      email,
      password,
      goal: goal || 'Software placement 5–12 LPA',
      targetPackage: targetPackage || '8 LPA',
      startDate: startDate ? new Date(startDate) : getSprintStartDate(),
    });

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({ user: user._id, token: refreshToken, expiresAt });
    setTokens(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        goal: user.goal,
        targetPackage: user.targetPackage,
        startDate: user.startDate,
        currentStreak: user.currentStreak,
        level: user.level,
        xp: user.xp,
      },
      accessToken,
      refreshToken,
    });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new AppError('Email and password required', 400);
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid credentials', 401);
    }
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({ user: user._id, token: refreshToken, expiresAt });
    setTokens(res, accessToken, refreshToken);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        goal: user.goal,
        targetPackage: user.targetPackage,
        startDate: user.startDate,
        currentStreak: user.currentStreak,
        level: user.level,
        xp: user.xp,
      },
      accessToken,
      refreshToken,
    });
  })
);

router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const token = req.body.refreshToken || req.cookies?.refreshToken;
    if (!token) throw new AppError('Refresh token required', 401);
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      throw new AppError('Invalid refresh token', 401);
    }
    const stored = await RefreshToken.findOne({ token, user: decoded.sub });
    if (!stored || stored.expiresAt < new Date()) {
      throw new AppError('Refresh token expired', 401);
    }
    const accessToken = signAccessToken(decoded.sub);
    setTokens(res, accessToken, token);
    res.json({ success: true, accessToken });
  })
);

router.post(
  '/logout',
  protect,
  asyncHandler(async (req, res) => {
    const token = req.body.refreshToken || req.cookies?.refreshToken;
    if (token) await RefreshToken.deleteOne({ token });
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out' });
  })
);

router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    res.json({ success: true, user: req.user });
  })
);

router.patch(
  '/profile',
  protect,
  asyncHandler(async (req, res) => {
    const { name, goal, targetPackage, startDate } = req.body;
    if (name) req.user.name = name;
    if (goal) req.user.goal = goal;
    if (targetPackage) req.user.targetPackage = targetPackage;
    if (startDate) req.user.startDate = new Date(startDate);
    await req.user.save();
    res.json({ success: true, user: req.user });
  })
);

export default router;
