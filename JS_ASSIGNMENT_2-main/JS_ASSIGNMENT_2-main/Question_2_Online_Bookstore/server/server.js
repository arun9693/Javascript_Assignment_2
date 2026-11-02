const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/bookRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/online_bookstore_db';

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Online Bookstore REST API (MERN Stack)',
    status: 'Running',
    database: mongoose.connection.readyState === 1 ? 'Connected to MongoDB' : 'Running on In-Memory Fallback',
    endpoints: {
      getAllBooks: 'GET /api/books',
      searchBooks: 'GET /api/books?search=<title_or_author>',
      getBookById: 'GET /api/books/:id',
      createBook: 'POST /api/books',
      updateBook: 'PUT /api/books/:id',
      deleteBook: 'DELETE /api/books/:id',
    },
  });
});

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 2500,
  })
  .then(() => {
    console.log('✓ Successfully connected to MongoDB bookstore database');
  })
  .catch((err) => {
    console.warn('! Notice: MongoDB connection failed (' + err.message + ').');
    console.warn('! Running on in-memory bookstore fallback store.');
  });

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Q2: Online Bookstore Application API`);
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Base API endpoint: http://localhost:${PORT}/api/books`);
  console.log(`====================================================`);
});
