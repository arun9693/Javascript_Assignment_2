# Question 2: Online Bookstore Application (MERN Stack)

Design an online bookstore application:
- Display books using React components.
- Store book title, author, price, and availability in MongoDB.
- Create APIs to retrieve and manage books.
- Implement search by book title or author.

---

## 📁 Directory Structure
```
Question_2_Online_Bookstore/
├── server/
│   ├── models/Book.js           # Mongoose Schema (title, author, price, availability, category)
│   ├── routes/bookRoutes.js     # REST APIs & Search by title/author
│   ├── server.js                # Express Server setup (Port 5001)
│   ├── package.json
│   └── .env                     # MongoDB Connection String & Port
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx       # Header & Add Book trigger
    │   │   ├── SearchBar.jsx    # Real-time search by title/author & filters
    │   │   ├── BookCard.jsx     # Individual book display card
    │   │   ├── BookGrid.jsx     # Grid layout component
    │   │   └── BookModal.jsx    # Add / Edit book modal dialog
    │   ├── App.jsx              # Main state & search debounce
    │   ├── App.css              # Modern UI styling
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js           # Dev server configured on port 3001
    └── package.json
```

---

## 🚀 How to Run

### 1. Start the Express & MongoDB Backend
Open a terminal in `Question_2_Online_Bookstore/server`:
```bash
cd server
npm install
npm start
```
- Server starts at: `http://localhost:5001`
- REST API endpoint: `http://localhost:5001/api/books`
- Pre-populated with demo books; automatically switches to MongoDB when connected.

### 2. Start the React Frontend
Open a second terminal in `Question_2_Online_Bookstore/client`:
```bash
cd client
npm install
npm run dev
```
- Open `http://localhost:3001` in your web browser.

---

## 📡 REST API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/books` | Retrieve all books |
| `GET` | `/api/books?search=<keyword>` | Search books by title or author |
| `GET` | `/api/books/:id` | Retrieve single book |
| `POST` | `/api/books` | Add a new book to catalog |
| `PUT` | `/api/books/:id` | Update book details (price, availability, etc.) |
| `DELETE` | `/api/books/:id` | Remove book from catalog |
