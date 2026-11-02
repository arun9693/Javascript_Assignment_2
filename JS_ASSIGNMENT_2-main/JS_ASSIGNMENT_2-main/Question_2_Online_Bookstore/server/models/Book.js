const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Book price is required'],
      min: 0,
    },
    availability: {
      type: String,
      required: [true, 'Availability status is required'],
      enum: ['In Stock', 'Out of Stock', 'Pre-Order'],
      default: 'In Stock',
    },
    category: {
      type: String,
      default: 'Computer Science',
      trim: true,
    },
    stockCount: {
      type: Number,
      default: 15,
      min: 0,
    },
    isbn: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
