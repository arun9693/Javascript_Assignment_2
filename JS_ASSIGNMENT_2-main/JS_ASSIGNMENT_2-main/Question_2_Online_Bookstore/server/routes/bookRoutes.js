const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Book = require('../models/Book');

// Preloaded books for demo/in-memory fallback
let memoryBooks = [
  {
    _id: 'book_1',
    title: 'Eloquent JavaScript (3rd Edition)',
    author: 'Marijn Haverbeke',
    price: 650,
    availability: 'In Stock',
    category: 'JavaScript & Web',
    stockCount: 18,
    isbn: '978-1593279509',
    createdAt: new Date(),
  },
  {
    _id: 'book_2',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    price: 899,
    availability: 'In Stock',
    category: 'Software Engineering',
    stockCount: 12,
    isbn: '978-0132350884',
    createdAt: new Date(),
  },
  {
    _id: 'book_3',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    price: 1250,
    availability: 'In Stock',
    category: 'System Design',
    stockCount: 8,
    isbn: '978-1449373320',
    createdAt: new Date(),
  },
  {
    _id: 'book_4',
    title: 'Learning React: Modern Patterns for Developing React Apps',
    author: 'Alex Banks & Eve Porcello',
    price: 780,
    availability: 'In Stock',
    category: 'Frontend Development',
    stockCount: 14,
    isbn: '978-1492051725',
    createdAt: new Date(),
  },
  {
    _id: 'book_5',
    title: 'Node.js Design Patterns',
    author: 'Mario Casciaro & Luciano Mammino',
    price: 950,
    availability: 'Out of Stock',
    category: 'Backend & Node.js',
    stockCount: 0,
    isbn: '978-1839214110',
    createdAt: new Date(),
  },
  {
    _id: 'book_6',
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Thomas H. Cormen',
    price: 1600,
    availability: 'In Stock',
    category: 'Data Structures & Algorithms',
    stockCount: 5,
    isbn: '978-0262033848',
    createdAt: new Date(),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/books - Retrieve books with search by title or author
router.get('/', async (req, res) => {
  try {
    const { search, category, availability } = req.query;

    if (isDbConnected()) {
      let filter = {};
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
        ];
      }
      if (category && category !== 'All') {
        filter.category = category;
      }
      if (availability && availability !== 'All') {
        filter.availability = availability;
      }

      const books = await Book.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, count: books.length, data: books, storage: 'MongoDB' });
    }

    // In-Memory Search
    let filtered = [...memoryBooks];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }
    if (category && category !== 'All') {
      filtered = filtered.filter((b) => b.category === category);
    }
    if (availability && availability !== 'All') {
      filtered = filtered.filter((b) => b.availability === availability);
    }

    return res.json({
      success: true,
      count: filtered.length,
      data: filtered,
      storage: 'In-Memory (Connect MongoDB in .env for persistence)',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/books/:id - Retrieve single book
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const book = await Book.findById(id);
      if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
      return res.json({ success: true, data: book });
    }
    const book = memoryBooks.find((b) => b._id === id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    return res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/books - Add a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, price, availability, category, stockCount, isbn } = req.body;

    if (!title || !author || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide book title, author, and price',
      });
    }

    if (isDbConnected()) {
      const newBook = await Book.create({
        title,
        author,
        price: Number(price),
        availability: availability || (Number(stockCount) > 0 ? 'In Stock' : 'Out of Stock'),
        category: category || 'General',
        stockCount: stockCount !== undefined ? Number(stockCount) : 10,
        isbn: isbn || '',
      });
      return res.status(201).json({ success: true, data: newBook, message: 'Book added to MongoDB database' });
    }

    const newBook = {
      _id: 'book_' + Date.now(),
      title,
      author,
      price: Number(price),
      availability: availability || (Number(stockCount) > 0 ? 'In Stock' : 'Out of Stock'),
      category: category || 'General',
      stockCount: stockCount !== undefined ? Number(stockCount) : 10,
      isbn: isbn || '',
      createdAt: new Date(),
    };
    memoryBooks.unshift(newBook);
    return res.status(201).json({ success: true, data: newBook, message: 'Book added (Memory)' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/books/:id - Update book details
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, price, availability, category, stockCount, isbn } = req.body;

    if (isDbConnected()) {
      const updated = await Book.findByIdAndUpdate(
        id,
        {
          title,
          author,
          price: price !== undefined ? Number(price) : undefined,
          availability,
          category,
          stockCount: stockCount !== undefined ? Number(stockCount) : undefined,
          isbn,
        },
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ success: false, message: 'Book not found' });
      return res.json({ success: true, data: updated, message: 'Book updated successfully' });
    }

    const index = memoryBooks.findIndex((b) => b._id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Book not found' });

    memoryBooks[index] = {
      ...memoryBooks[index],
      title: title || memoryBooks[index].title,
      author: author || memoryBooks[index].author,
      price: price !== undefined ? Number(price) : memoryBooks[index].price,
      availability: availability || memoryBooks[index].availability,
      category: category || memoryBooks[index].category,
      stockCount: stockCount !== undefined ? Number(stockCount) : memoryBooks[index].stockCount,
      isbn: isbn !== undefined ? isbn : memoryBooks[index].isbn,
      updatedAt: new Date(),
    };

    return res.json({ success: true, data: memoryBooks[index], message: 'Book updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/books/:id - Delete a book
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await Book.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Book not found' });
      return res.json({ success: true, data: deleted, message: 'Book deleted from MongoDB' });
    }

    const index = memoryBooks.findIndex((b) => b._id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Book not found' });

    const deleted = memoryBooks.splice(index, 1);
    return res.json({ success: true, data: deleted[0], message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
