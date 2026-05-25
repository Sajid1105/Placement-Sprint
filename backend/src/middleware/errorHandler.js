import { AppError } from '../utils/errors.js';

export function notFound(req, res, next) {
  next(new AppError(`Not found: ${req.originalUrl}`, 404));
}

export function errorHandler(err, req, res, _next) {
  const status = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && !err.isOperational && { stack: err.stack }),
  });
}
