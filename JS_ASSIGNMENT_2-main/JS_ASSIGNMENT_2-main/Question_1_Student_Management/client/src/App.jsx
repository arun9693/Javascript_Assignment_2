import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';

const API_BASE_URL = 'http://localhost:5000/api/students';

export default function App() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [storageInfo, setStorageInfo] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL);
      const resData = await response.json();
      if (resData.success) {
        setStudents(resData.data);
        setStorageInfo(resData.storage || 'MongoDB Connected');
      } else {
        showToast(resData.message || 'Failed to fetch students', 'error');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showToast('Cannot reach server at http://localhost:5000. Is it running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      if (editingStudent) {
        // UPDATE student
        const response = await fetch(`${API_BASE_URL}/${editingStudent._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const resData = await response.json();
        if (resData.success) {
          showToast(resData.message || 'Student updated successfully!');
          setEditingStudent(null);
          fetchStudents();
        } else {
          showToast(resData.message || 'Error updating student', 'error');
        }
      } else {
        // ADD student
        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const resData = await response.json();
        if (resData.success) {
          showToast(resData.message || 'Student added successfully!');
          fetchStudents();
        } else {
          showToast(resData.message || 'Error adding student', 'error');
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
      showToast('Network error while saving student', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete student "${name}"?`);
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      const resData = await response.json();
      if (resData.success) {
        showToast(resData.message || 'Student deleted successfully!');
        if (editingStudent && editingStudent._id === id) {
          setEditingStudent(null);
        }
        fetchStudents();
      } else {
        showToast(resData.message || 'Failed to delete student', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Network error while deleting student', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar storageInfo={storageInfo} />

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)}>&times;</button>
        </div>
      )}

      <main className="main-content">
        <div className="layout-grid">
          <section className="form-section">
            <StudentForm
              onSubmit={handleFormSubmit}
              editingStudent={editingStudent}
              onCancelEdit={() => setEditingStudent(null)}
              loading={loading}
            />
          </section>

          <section className="list-section">
            <StudentList
              students={students}
              onEdit={(student) => {
                setEditingStudent(student);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDelete={handleDelete}
              loading={loading}
            />
          </section>
        </div>
      </main>

      <footer className="footer">
        <p>JavaScript Frameworks (U21CSP12) — Assignment II • Student Management System (MERN Stack)</p>
      </footer>
    </div>
  );
}
