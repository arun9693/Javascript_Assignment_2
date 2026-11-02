import React from 'react';

export default function BookCard({ book, onEdit, onDelete }) {
  const isAvailable = book.availability === 'In Stock';

  return (
    <div className={`book-card ${!isAvailable ? 'out-of-stock' : ''}`}>
      <div className="book-card-top">
        <span className="book-category">{book.category || 'General'}</span>
        <span
          className={`badge-availability ${
            book.availability === 'In Stock'
              ? 'badge-in-stock'
              : book.availability === 'Out of Stock'
              ? 'badge-out-stock'
              : 'badge-preorder'
          }`}
        >
          {book.availability}
        </span>
      </div>

      <div className="book-card-body">
        <h3 className="book-title" title={book.title}>
          {book.title}
        </h3>
        <p className="book-author">by {book.author}</p>

        {book.isbn && <p className="book-isbn">ISBN: {book.isbn}</p>}
      </div>

      <div className="book-card-footer">
        <div className="book-pricing">
          <span className="currency">₹</span>
          <span className="price-amount">{Number(book.price).toFixed(2)}</span>
          {book.stockCount !== undefined && (
            <span className="stock-count">({book.stockCount} copies)</span>
          )}
        </div>

        <div className="book-actions">
          <button
            className="btn-card-action btn-edit"
            onClick={() => onEdit(book)}
            title="Edit Book Details"
          >
            Edit
          </button>
          <button
            className="btn-card-action btn-delete"
            onClick={() => onDelete(book._id, book.title)}
            title="Delete Book"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
