import React, { useState, useEffect } from 'react';

const initialForm = {
  title: '',
  author: '',
  price: '',
  availability: 'In Stock',
  category: 'Computer Science',
  stockCount: '10',
  isbn: '',
};

export default function BookModal({ isOpen, onClose, onSubmit, editingBook, loading }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title || '',
        author: editingBook.author || '',
        price: editingBook.price !== undefined ? editingBook.price : '',
        availability: editingBook.availability || 'In Stock',
        category: editingBook.category || 'Computer Science',
        stockCount: editingBook.stockCount !== undefined ? editingBook.stockCount : '10',
        isbn: editingBook.isbn || '',
      });
      setErrors({});
    } else {
      setFormData(initialForm);
      setErrors({});
    }
  }, [editingBook, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Book title is required';
    if (!formData.author.trim()) errs.author = 'Author name is required';
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      errs.price = 'Please enter a valid price';
    }
    if (formData.stockCount !== '' && (isNaN(formData.stockCount) || Number(formData.stockCount) < 0)) {
      errs.stockCount = 'Stock count must be a non-negative number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingBook ? 'Edit Book Details' : 'Add New Book to Store'}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title">
              Book Title <span className="req">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Clean Architecture"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="author">
              Author(s) <span className="req">*</span>
            </label>
            <input
              type="text"
              id="author"
              name="author"
              placeholder="e.g. Robert C. Martin"
              value={formData.author}
              onChange={handleChange}
              className={errors.author ? 'input-error' : ''}
            />
            {errors.author && <span className="error-text">{errors.author}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">
                Price (INR ₹) <span className="req">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                id="price"
                name="price"
                placeholder="e.g. 750"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? 'input-error' : ''}
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="availability">
                Availability <span className="req">*</span>
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Pre-Order">Pre-Order</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="JavaScript & Web">JavaScript & Web</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="System Design">System Design</option>
                <option value="Frontend Development">Frontend Development</option>
                <option value="Backend & Node.js">Backend & Node.js</option>
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="stockCount">Stock Quantity</label>
              <input
                type="number"
                id="stockCount"
                name="stockCount"
                placeholder="e.g. 15"
                value={formData.stockCount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="isbn">ISBN Number</label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              placeholder="e.g. 978-0132350884"
              value={formData.isbn}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-save" disabled={loading}>
              {loading ? 'Saving...' : editingBook ? 'Save Changes' : 'Add to Catalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
