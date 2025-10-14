require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const swaggerSetup = require('./docs/swagger');
const { errorHandler } = require('./middleware/errorMiddleware');
const db = require('./models/db');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow requests from frontend (React on 3001)
app.use(
  cors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(bodyParser.json());

// Routes
app.use('/v1/auth', authRoutes);
app.use('/v1/tasks', taskRoutes);

// Swagger
swaggerSetup(app);

// Health check
app.get('/v1/health', (req, res) => res.json({ status: 'ok' }));

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
