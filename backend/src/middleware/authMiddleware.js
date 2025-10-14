const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// Authenticate and attach user to req.user
exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    next();
  });
};

// Role-based authorization
exports.authorize = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (roles.length && !roles.includes(req.user.role))
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    next();
  };
};
