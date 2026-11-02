# Question 3: Course Registration Application (MEAN Stack)

Create a course registration application for college students:
- Display available courses using Angular.
- Implement course registration and cancellation.
- Store course and student details in MongoDB.
- Validate user inputs using Angular forms (Reactive Forms).

---

## 📁 Directory Structure
```
Question_3_Course_Registration/
├── server/
│   ├── models/
│   │   ├── Course.js           # Mongoose Schema for Courses
│   │   └── Registration.js     # Mongoose Schema for Student Registrations
│   ├── routes/courseRoutes.js  # REST APIs (GET /courses, POST /register, POST /cancel, GET /registrations)
│   ├── server.js               # Express Server setup (Port 5002)
│   ├── package.json
│   └── .env                    # MongoDB Connection String & Port
└── client/
    ├── src/
    │   ├── app/
    │   │   ├── app.ts          # Angular Component with Reactive Forms & HttpClient
    │   │   ├── app.html        # Angular Template (ngFor, ngIf, formGroup, validators)
    │   │   ├── app.css         # Clean responsive layout & alerts
    │   │   └── app.config.ts   # Angular Application config with provideHttpClient
    │   ├── index.html
    │   └── styles.css
    ├── angular.json
    └── package.json
```

---

## 🚀 How to Run

### 1. Start the Express & MongoDB Backend
Open a terminal in `Question_3_Course_Registration/server`:
```bash
cd server
npm install
npm start
```
- Server starts at: `http://localhost:5002`
- REST API endpoint: `http://localhost:5002/api/courses`
- Includes pre-seeded college courses (e.g. `U21CSP12`, `U21CSP15`, etc.).

### 2. Start the Angular Frontend
Open a second terminal in `Question_3_Course_Registration/client`:
```bash
cd client
npm start
```
- Open `http://localhost:4200` in your web browser.

---

## 📡 REST API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/courses` | Retrieve all available courses with slot status |
| `POST` | `/api/register` | Register student for course & decrement slot |
| `POST` | `/api/cancel` | Cancel registration & increment available slot |
| `GET` | `/api/registrations/:rollNo` | Get registered courses for a specific student |
