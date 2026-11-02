const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const courseRoutes = require('./routes/courseRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/course_registration_db';

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', courseRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Course Registration System REST API (MEAN Stack)',
    status: 'Running',
    database: mongoose.connection.readyState === 1 ? 'Connected to MongoDB' : 'Running on In-Memory Fallback',
    endpoints: {
      getCourses: 'GET /api/courses',
      registerCourse: 'POST /api/register',
      cancelRegistration: 'POST /api/cancel',
      getStudentRegistrations: 'GET /api/registrations/:rollNo',
    },
  });
});

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 2500,
  })
  .then(() => {
    console.log('✓ Successfully connected to MongoDB course registration database');
  })
  .catch((err) => {
    console.warn('! Notice: MongoDB connection failed (' + err.message + ').');
    console.warn('! Running on in-memory course registration fallback store.');
  });

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Q3: Course Registration System API (MEAN Stack)`);
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Base API endpoints at http://localhost:${PORT}/api/courses`);
  console.log(`====================================================`);
});
