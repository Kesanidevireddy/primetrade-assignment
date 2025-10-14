const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (row) return res.status(400).json({ message: 'Email already exists' });

    bcrypt.hash(password, 10)
      .then((hash) => {
        db.run(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [name || '', email, hash, 'user'],
          function (err) {
            if (err) return res.status(500).json({ message: 'Database insert error' });
            const user = { id: this.lastID, name, email, role: 'user' };
            const token = generateToken(user);
            res.status(201).json({ user, token });
          }
        );
      })
      .catch(() => res.status(500).json({ message: 'Error hashing password' }));
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    bcrypt.compare(password, user.password)
      .then((match) => {
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });
        const token = generateToken(user);
        res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
      })
      .catch(() => res.status(500).json({ message: 'Error comparing passwords' }));
  });
};
