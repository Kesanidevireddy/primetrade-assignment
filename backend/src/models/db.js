const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbFile = path.join(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) console.error('Failed to connect to SQLite DB', err);
  else console.log('Connected to SQLite DB:', dbFile);
});

// Initialize tables
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`
  );

  // Seed admin
  const adminEmail = 'admin@primetrade.test';
  db.get('SELECT * FROM users WHERE email = ?', [adminEmail], (err, row) => {
    if (!row) {
      const adminPass = 'Admin@123';
      bcrypt.hash(adminPass, 10).then((hash) => {
        db.run(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          ['Admin', adminEmail, hash, 'admin'],
          (err) => {
            if (!err) console.log('Seeded admin user:', adminEmail, 'password:', adminPass);
          }
        );
      });
    }
  });
});

module.exports = db;
