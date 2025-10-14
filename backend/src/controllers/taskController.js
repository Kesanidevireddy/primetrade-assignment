const db = require('../models/db');

// Helper to validate task input
const validateTask = (title) => title && title.trim().length > 0;

exports.createTask = (req, res) => {
  const { title, description } = req.body;
  if (!validateTask(title)) return res.status(400).json({ message: 'Title is required' });

  db.run(
    `INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)`,
    [title, description || '', req.user.id],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB insert error' });
      res.status(201).json({ id: this.lastID, title, description, user_id: req.user.id });
    }
  );
};

exports.getTasks = (req, res) => {
  const query = req.user.role === 'admin'
    ? `SELECT * FROM tasks`
    : `SELECT * FROM tasks WHERE user_id = ?`;

  const params = req.user.role === 'admin' ? [] : [req.user.id];

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB fetch error' });
    res.json(rows);
  });
};

exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  if (!validateTask(title)) return res.status(400).json({ message: 'Title is required' });

  // Ensure user owns the task or is admin
  const ownerCheckQuery = `SELECT * FROM tasks WHERE id = ?`;
  db.get(ownerCheckQuery, [id], (err, task) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role !== 'admin' && task.user_id !== req.user.id)
      return res.status(403).json({ message: 'Forbidden: cannot edit this task' });

    db.run(
      `UPDATE tasks SET title = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [title, description || '', status || task.status, id],
      (err) => {
        if (err) return res.status(500).json({ message: 'DB update error' });
        res.json({ id, title, description, status: status || task.status });
      }
    );
  });
};

exports.deleteTask = (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, task) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role !== 'admin' && task.user_id !== req.user.id)
      return res.status(403).json({ message: 'Forbidden: cannot delete this task' });

    db.run(`DELETE FROM tasks WHERE id = ?`, [id], (err) => {
      if (err) return res.status(500).json({ message: 'DB delete error' });
      res.json({ message: 'Task deleted successfully' });
    });
  });
};
