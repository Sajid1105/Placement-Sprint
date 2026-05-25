import { verifyAccessToken } from '../utils/tokens.js';
import { AppError } from '../utils/errors.js';
import { User } from '../models/User.js';

export async function protect(req, _res, next) {
  const auth = req.headers.authorization;
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : req.cookies?.accessToken;
  if (!token) return next(new AppError('Not authenticated', 401));
  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.sub);
    if (!user) return next(new AppError('User not found', 401));
    req.user = user;
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
}
