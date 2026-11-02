import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import BookGrid from './components/BookGrid';
import BookModal from './components/BookModal';

const API_BASE_URL = 'http://localhost:5001/api/books';

export default function App() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [storageInfo, setStorageInfo] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedAvailability !== 'All') params.append('availability', selectedAvailability);

      const url = `${API_BASE_URL}?${params.toString()}`;
      const response = await fetch(url);
      const resData = await response.json();

      if (resData.success) {
        setBooks(resData.data);
        setStorageInfo(resData.storage || 'MongoDB');

        // Extract unique categories
        const cats = Array.from(new Set(resData.data.map((b) => b.category).filter(Boolean)));
        if (cats.length > 0) setCategories(cats);
      } else {
        showToast(resData.message || 'Failed to fetch books', 'error');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showToast('Cannot reach server on port 5001. Ensure backend is running.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when search or filters change (debounced for search)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedAvailability]);

  const handleModalSubmit = async (formData) => {
    setLoading(true);
    try {
      if (editingBook) {
        // UPDATE
        const response = await fetch(`${API_BASE_URL}/${editingBook._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const resData = await response.json();
        if (resData.success) {
          showToast('Book updated successfully!');
          setIsModalOpen(false);
          setEditingBook(null);
          fetchBooks();
        } else {
          showToast(resData.message || 'Error updating book', 'error');
        }
      } else {
        // CREATE
        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const resData = await response.json();
        if (resData.success) {
          showToast('Book added successfully to catalog!');
          setIsModalOpen(false);
          fetchBooks();
        } else {
          showToast(resData.message || 'Error adding book', 'error');
        }
      }
    } catch (err) {
      console.error('Save error:', err);
      showToast('Network error while saving book', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(`Are you sure you want to remove "${title}" from the bookstore?`);
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      const resData = await response.json();
      if (resData.success) {
        showToast('Book removed from bookstore catalog');
        fetchBooks();
      } else {
        showToast(resData.message || 'Failed to delete book', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Network error while deleting book', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bookstore-app">
      <Navbar
        onOpenAddModal={() => {
          setEditingBook(null);
          setIsModalOpen(true);
        }}
        storageInfo={storageInfo}
      />

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)}>&times;</button>
        </div>
      )}

      <main className="bookstore-main">
        <div className="container">
          <div className="hero-banner">
            <h2>Discover & Manage College Textbooks</h2>
            <p>
              Search titles, explore authors, inspect real-time availability, and manage your inventory with MongoDB.
            </p>
          </div>

          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedAvailability={selectedAvailability}
            setSelectedAvailability={setSelectedAvailability}
            categories={categories}
          />

          <div className="results-info">
            <span>
              Showing <strong>{books.length}</strong> book{books.length === 1 ? '' : 's'}
              {searchTerm && ` for "${searchTerm}"`}
            </span>
          </div>

          <BookGrid
            books={books}
            onEdit={(book) => {
              setEditingBook(book);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </main>

      <BookModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBook(null);
        }}
        onSubmit={handleModalSubmit}
        editingBook={editingBook}
        loading={loading}
      />

      <footer className="footer">
        <p>JavaScript Frameworks (U21CSP12) — Assignment II • Online Bookstore Application (MERN Stack)</p>
      </footer>
    </div>
  );
}
