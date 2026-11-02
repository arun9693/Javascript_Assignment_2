import React, { useState } from 'react';

export default function StudentList({ students, onEdit, onDelete, loading }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card list-card">
      <div className="card-header list-header">
        <div>
          <h2>Registered Students ({students.length})</h2>
          <p className="card-subtitle">View, edit, or delete existing records</p>
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, roll no, or dept..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading && students.length === 0 ? (
        <div className="state-message">Loading students...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="state-message">
          {searchTerm ? 'No students matched your search criteria.' : 'No students found. Add one above!'}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="student-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Details</th>
                <th>Department & Year</th>
                <th>Contact</th>
                <th>CGPA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>
                    <span className="badge roll-badge">{student.rollNo}</span>
                  </td>
                  <td>
                    <div className="student-name">{student.name}</div>
                    <div className="student-sub">{student.email}</div>
                  </td>
                  <td>
                    <div>{student.department}</div>
                    <span className="year-tag">Year {student.year}</span>
                  </td>
                  <td>
                    <div>{student.phone}</div>
                  </td>
                  <td>
                    <span className="cgpa-badge">{student.cgpa ? Number(student.cgpa).toFixed(2) : 'N/A'}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-action btn-edit"
                        title="Edit student"
                        onClick={() => onEdit(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-action btn-delete"
                        title="Delete student"
                        onClick={() => onDelete(student._id, student.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
