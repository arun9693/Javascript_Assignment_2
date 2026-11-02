import React from 'react';

export default function Navbar({ onOpenAddModal, storageInfo }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand">
          <div className="logo-icon">📚</div>
          <div>
            <div className="badge-mern">MERN STACK</div>
            <h1>EduBooks Online Bookstore</h1>
          </div>
        </div>

        <div className="nav-right">
          <div className="db-badge">
            <span className="dot"></span>
            <span>{storageInfo || 'MongoDB'}</span>
          </div>
          <button className="btn btn-add" onClick={onOpenAddModal}>
            + Add New Book
          </button>
        </div>
      </div>
    </header>
  );
}
