import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const BASE_URL = 'http://localhost:5000/v1/tasks';
const token = localStorage.getItem('token');

const Dashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Ensure tasks is always an array
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching tasks:', err.message);
      alert('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create / Update task
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingTask ? 'PUT' : 'POST';
      const url = editingTask ? `${BASE_URL}/${editingTask.id}` : BASE_URL;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error saving task');

      setTitle('');
      setDescription('');
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Edit
  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <header>
        <h2>Primetrade.ai Dashboard</h2>
        <div>
          <span>{user.name} ({user.role})</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <section className="task-form-section">
        <h3>{editingTask ? 'Edit Task' : 'New Task'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">{editingTask ? 'Update' : 'Create'}</button>
        </form>
      </section>

      <section className="tasks-list">
        <h3>Your Tasks</h3>
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-card">
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <div className="task-actions">
                <button onClick={() => handleEdit(task)}>Edit</button>
                <button onClick={() => handleDelete(task.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Dashboard;
