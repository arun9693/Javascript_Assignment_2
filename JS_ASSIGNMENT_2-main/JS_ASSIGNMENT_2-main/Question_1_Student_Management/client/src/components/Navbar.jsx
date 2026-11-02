import React from 'react';

export default function Navbar({ storageInfo }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand">
          <span className="brand-badge">MERN STACK</span>
          <h1>Student Management System</h1>
        </div>
        <div className="status-pill">
          <span className="dot"></span>
          <span>{storageInfo || 'Connecting...'}</span>
        </div>
      </div>
    </header>
  );
}
