import React, { useState, useEffect } from 'react';

const initialFormData = {
  name: '',
  rollNo: '',
  department: 'Computer Science and Engineering',
  year: 'III',
  email: '',
  phone: '',
  cgpa: '',
};

export default function StudentForm({ onSubmit, editingStudent, onCancelEdit, loading }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || '',
        rollNo: editingStudent.rollNo || '',
        department: editingStudent.department || 'Computer Science and Engineering',
        year: editingStudent.year || 'III',
        email: editingStudent.email || '',
        phone: editingStudent.phone || '',
        cgpa: editingStudent.cgpa !== undefined ? editingStudent.cgpa : '',
      });
      setErrors({});
    } else {
      setFormData(initialFormData);
    }
  }, [editingStudent]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.rollNo.trim()) newErrors.rollNo = 'Roll number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'Phone must be a valid 10-digit number';
    }
    if (formData.cgpa !== '' && (isNaN(formData.cgpa) || formData.cgpa < 0 || formData.cgpa > 10)) {
      newErrors.cgpa = 'CGPA must be between 0.0 and 10.0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    if (!editingStudent) {
      setFormData(initialFormData);
    }
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <h2>{editingStudent ? 'Edit Student Details' : 'Add New Student'}</h2>
        <p className="card-subtitle">
          {editingStudent
            ? 'Update the student information below and save changes.'
            : 'Enter the details of the student to register in MongoDB.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">
              Full Name <span className="req">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. Kavitha R"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="rollNo">
              Roll Number <span className="req">*</span>
            </label>
            <input
              type="text"
              id="rollNo"
              name="rollNo"
              placeholder="e.g. 21CS045"
              value={formData.rollNo}
              onChange={handleChange}
              className={errors.rollNo ? 'input-error' : ''}
              disabled={!!editingStudent}
            />
            {errors.rollNo && <span className="error-text">{errors.rollNo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="department">
              Department <span className="req">*</span>
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="Computer Science and Engineering">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
              <option value="Electronics and Communication">Electronics & Communication</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="year">
              Academic Year <span className="req">*</span>
            </label>
            <select id="year" name="year" value={formData.year} onChange={handleChange}>
              <option value="I">1st Year (I)</option>
              <option value="II">2nd Year (II)</option>
              <option value="III">3rd Year (III)</option>
              <option value="IV">4th Year (IV)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              College Email <span className="req">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="e.g. kavitha.r@kpriet.ac.in"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Mobile Number <span className="req">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'input-error' : ''}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-group full-width">
            <label htmlFor="cgpa">CGPA (0.0 - 10.0)</label>
            <input
              type="number"
              step="0.01"
              id="cgpa"
              name="cgpa"
              placeholder="e.g. 8.75"
              value={formData.cgpa}
              onChange={handleChange}
              className={errors.cgpa ? 'input-error' : ''}
            />
            {errors.cgpa && <span className="error-text">{errors.cgpa}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Processing...' : editingStudent ? 'Update Student Record' : 'Save Student'}
          </button>
          {editingStudent && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
              disabled={loading}
            >
              Cancel Edit
            </button>
          )}
          {!editingStudent && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setFormData(initialFormData);
                setErrors({});
              }}
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
