const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Protected routes
router.use(authenticate);

router.get('/', taskController.getTasks); // Users get own tasks, Admin gets all
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask); // Users delete own task, Admin can delete all

module.exports = router;
