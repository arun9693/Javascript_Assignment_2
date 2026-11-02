const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const studentRoutes = require('./routes/studentRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_management_db';

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/students', studentRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Student Management System REST API (MERN Stack)',
    status: 'Running',
    database: mongoose.connection.readyState === 1 ? 'Connected to MongoDB' : 'Running on In-Memory Fallback',
    endpoints: {
      getAllStudents: 'GET /api/students',
      getStudentById: 'GET /api/students/:id',
      createStudent: 'POST /api/students',
      updateStudent: 'PUT /api/students/:id',
      deleteStudent: 'DELETE /api/students/:id',
    },
  });
});

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 2500, // Quick timeout so server starts even without local Mongo
  })
  .then(() => {
    console.log('✓ Successfully connected to MongoDB database');
  })
  .catch((err) => {
    console.warn('! Notice: MongoDB connection failed (' + err.message + ').');
    console.warn('! Using in-memory fallback store so APIs will work immediately without crashing.');
    console.warn('! To persist permanently in MongoDB, ensure MongoDB is running or set MONGO_URI in .env');
  });

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Q1: Student Management System API`);
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Base API endpoint: http://localhost:${PORT}/api/students`);
  console.log(`====================================================`);
});
