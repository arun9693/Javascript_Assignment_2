import React from 'react';
import BookCard from './BookCard';

export default function BookGrid({ books, onEdit, onDelete, loading }) {
  if (loading && books.length === 0) {
    return <div className="state-box">Loading books from database...</div>;
  }

  if (books.length === 0) {
    return (
      <div className="state-box empty-state">
        <div className="empty-icon">📖</div>
        <h3>No books found</h3>
        <p>Try adjusting your search criteria or add a new book to the catalog.</p>
      </div>
    );
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard key={book._id} book={book} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
