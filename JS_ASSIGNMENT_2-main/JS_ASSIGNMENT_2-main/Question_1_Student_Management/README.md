# Question 1: Student Management System (MERN Stack)

Develop a Student Management System using MERN Stack:
- Create a React form to enter student details.
- Use Express.js and Node.js to develop REST APIs.
- Store student records in MongoDB.
- Implement add, view, update, and delete (CRUD) operations.

---

## 📁 Directory Structure
```
Question_1_Student_Management/
├── server/
│   ├── models/Student.js        # Mongoose Schema
│   ├── routes/studentRoutes.js  # CRUD REST API endpoints
│   ├── server.js                # Express Server setup
│   ├── package.json
│   └── .env                     # MongoDB Connection String & Port
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx       # Header & DB Status Indicator
    │   │   ├── StudentForm.jsx  # Form for adding/editing students
    │   │   └── StudentList.jsx  # Table with search, edit & delete
    │   ├── App.jsx              # Main React state & API integration
    │   ├── App.css              # Modern UI styling
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 How to Run

### 1. Start the Express & MongoDB Backend
Open a terminal in `Question_1_Student_Management/server`:
```bash
cd server
npm install
npm start
```
- Server starts at: `http://localhost:5000`
- REST API endpoint: `http://localhost:5000/api/students`
- *Note:* If local MongoDB is running, it connects automatically. If not, it uses an in-memory fallback so you can test immediately without any database setup required.

### 2. Start the React Frontend
Open a second terminal in `Question_1_Student_Management/client`:
```bash
cd client
npm install
npm run dev
```
- Open `http://localhost:3000` in your web browser.

---

## 📡 REST API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/students` | View all student records |
| `GET` | `/api/students/:id` | View single student details |
| `POST` | `/api/students` | Add a new student |
| `PUT` | `/api/students/:id` | Update an existing student |
| `DELETE` | `/api/students/:id` | Delete a student |
