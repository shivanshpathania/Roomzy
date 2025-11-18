const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-me';
if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is not set; using an insecure dev default. Set JWT_SECRET in .env for production.');
}

// Attach req.user (if any) from JWT; do NOT block requests here
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const bearerToken = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    const token = req.cookies?.token || bearerToken;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { _id: decoded._id, username: decoded.username };
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    req.user = null;
    next();
  }
};

// Require that req.user is set; otherwise block access
const requireAuth = (req, res, next) => {
  if (!req.user) {
    // API routes: return JSON 401
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    // View routes: redirect to login
    return res.redirect('/login');
  }
  next();
};

module.exports = { authMiddleware, requireAuth };
