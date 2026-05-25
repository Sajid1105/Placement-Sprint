/** Normalize origin for comparison (no trailing slash). */
function normalizeOrigin(url) {
  if (!url || typeof url !== 'string') return '';
  return url.trim().replace(/\/$/, '');
}

/** Build allowlist from env — CLIENT_URL and ALLOWED_ORIGINS (comma-separated). */
export function getAllowedOrigins() {
  const fromEnv = [
    process.env.CLIENT_URL,
    process.env.ALLOWED_ORIGINS,
    'http://localhost:5173',
    'https://placementsprint.vercel.app',
  ]
    .filter(Boolean)
    .flatMap((s) => s.split(','))
    .map(normalizeOrigin)
    .filter(Boolean);

  return [...new Set(fromEnv)];
}

export function corsOptions() {
  const allowed = getAllowedOrigins();

  return {
    origin(origin, callback) {
      // Same-origin or non-browser clients (no Origin header)
      if (!origin) {
        return callback(null, true);
      }
      const normalized = normalizeOrigin(origin);
      if (allowed.includes(normalized)) {
        return callback(null, true);
      }
      console.warn(`[CORS] Blocked origin: ${origin}. Allowed: ${allowed.join(', ')}`);
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 204,
  };
}
