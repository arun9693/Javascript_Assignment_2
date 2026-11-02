# JavaScript Frameworks (U21CSP12) — Assignment II
**KPR Institute of Engineering and Technology (Autonomous)**  
Department of Computer Science and Engineering  
Year / Semester: III / V  

---

## 📚 Overview of Projects

All 3 questions from the assignment paper have been completely built and tested in this directory:

| Question | Technology Stack | Project Name | Port (API / Client) | Key Features |
| :--- | :--- | :--- | :--- | :--- |
| **Q1 (8 Marks)** | **MERN Stack** | `Question_1_Student_Management` | `5000` / `3000` | React form, Node/Express REST API, MongoDB CRUD operations (Add, View, Update, Delete) |
| **Q2 (16 Marks)** | **MERN Stack** | `Question_2_Online_Bookstore` | `5001` / `3001` | React components, MongoDB book storage (title, author, price, availability), search by title/author, inventory management |
| **Q3 (16 Marks)** | **MEAN Stack** | `Question_3_Course_Registration` | `5002` / `4200` | Angular standalone application, Reactive form validation, Course registration & cancellation, seat tracking, MongoDB persistence |

---

## ⚡ Quick Start Guide

All dependencies have already been installed for all projects.

### Question 1: Student Management System (MERN)
```bash
# Terminal 1 - Backend Server
cd Question_1_Student_Management/server
npm start
# Runs at http://localhost:5000

# Terminal 2 - Frontend Client
cd Question_1_Student_Management/client
npm run dev
# Runs at http://localhost:3000
```

---

### Question 2: Online Bookstore Application (MERN)
```bash
# Terminal 1 - Backend Server
cd Question_2_Online_Bookstore/server
npm start
# Runs at http://localhost:5001

# Terminal 2 - Frontend Client
cd Question_2_Online_Bookstore/client
npm run dev
# Runs at http://localhost:3001
```

---

### Question 3: Course Registration Application (MEAN)
```bash
# Terminal 1 - Backend Server
cd Question_3_Course_Registration/server
npm start
# Runs at http://localhost:5002

# Terminal 2 - Angular Client
cd Question_3_Course_Registration/client
npm start
# Runs at http://localhost:4200
```

---

## 🍃 MongoDB Notes
- Each server includes a `.env` file with `MONGO_URI`.
- If local MongoDB or MongoDB Atlas is connected, records persist directly in MongoDB.
- If MongoDB is not yet running on your machine, each backend includes a built-in fallback store so you can run, test, and demo all frontend and REST API features immediately without errors.
