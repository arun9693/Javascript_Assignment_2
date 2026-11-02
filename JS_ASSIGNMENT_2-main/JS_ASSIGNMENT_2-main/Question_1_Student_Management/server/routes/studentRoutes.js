const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = require('../models/Student');

// In-memory fallback dataset in case MongoDB is not running locally
let memoryStudents = [
  {
    _id: 'mem_1',
    name: 'Kavitha R',
    rollNo: '21CS045',
    department: 'Computer Science and Engineering',
    year: 'III',
    email: 'kavitha.r@kpriet.ac.in',
    phone: '9876543210',
    cgpa: 8.75,
    createdAt: new Date(),
  },
  {
    _id: 'mem_2',
    name: 'Sanjay Kumar S',
    rollNo: '21CS089',
    department: 'Computer Science and Engineering',
    year: 'III',
    email: 'sanjay.k@kpriet.ac.in',
    phone: '9845123456',
    cgpa: 8.4,
    createdAt: new Date(),
  },
  {
    _id: 'mem_3',
    name: 'Pooja M',
    rollNo: '21CS112',
    department: 'Computer Science and Engineering',
    year: 'III',
    email: 'pooja.m@kpriet.ac.in',
    phone: '9123456780',
    cgpa: 9.1,
    createdAt: new Date(),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/students - View all students
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const students = await Student.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: students.length, data: students, storage: 'MongoDB' });
    }
    return res.json({ success: true, count: memoryStudents.length, data: memoryStudents, storage: 'In-Memory (Connect MongoDB in .env for persistence)' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/students/:id - View single student
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const student = await Student.findById(id);
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
      return res.json({ success: true, data: student });
    }
    const student = memoryStudents.find((s) => s._id === id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    return res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/students - Add a new student
router.post('/', async (req, res) => {
  try {
    const { name, rollNo, department, year, email, phone, cgpa } = req.body;

    if (!name || !rollNo || !department || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, rollNo, department, email, phone',
      });
    }

    if (isDbConnected()) {
      const existing = await Student.findOne({ rollNo: rollNo.toUpperCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Student with this roll number already exists' });
      }
      const newStudent = await Student.create({
        name,
        rollNo: rollNo.toUpperCase(),
        department,
        year: year || 'III',
        email,
        phone,
        cgpa: cgpa ? Number(cgpa) : 8.0,
      });
      return res.status(201).json({ success: true, data: newStudent, message: 'Student added successfully in MongoDB' });
    }

    // In-memory fallback
    if (memoryStudents.some((s) => s.rollNo.toUpperCase() === rollNo.toUpperCase())) {
      return res.status(400).json({ success: false, message: 'Student with this roll number already exists' });
    }

    const newStudent = {
      _id: 'mem_' + Date.now(),
      name,
      rollNo: rollNo.toUpperCase(),
      department,
      year: year || 'III',
      email,
      phone,
      cgpa: cgpa ? Number(cgpa) : 8.0,
      createdAt: new Date(),
    };
    memoryStudents.unshift(newStudent);
    return res.status(201).json({ success: true, data: newStudent, message: 'Student added successfully (Memory)' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/students/:id - Update student details
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rollNo, department, year, email, phone, cgpa } = req.body;

    if (isDbConnected()) {
      const updated = await Student.findByIdAndUpdate(
        id,
        {
          name,
          rollNo: rollNo ? rollNo.toUpperCase() : undefined,
          department,
          year,
          email,
          phone,
          cgpa: cgpa !== undefined ? Number(cgpa) : undefined,
        },
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ success: false, message: 'Student not found' });
      return res.json({ success: true, data: updated, message: 'Student updated successfully in MongoDB' });
    }

    const index = memoryStudents.findIndex((s) => s._id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Student not found' });

    memoryStudents[index] = {
      ...memoryStudents[index],
      name: name || memoryStudents[index].name,
      rollNo: rollNo ? rollNo.toUpperCase() : memoryStudents[index].rollNo,
      department: department || memoryStudents[index].department,
      year: year || memoryStudents[index].year,
      email: email || memoryStudents[index].email,
      phone: phone || memoryStudents[index].phone,
      cgpa: cgpa !== undefined ? Number(cgpa) : memoryStudents[index].cgpa,
      updatedAt: new Date(),
    };

    return res.json({ success: true, data: memoryStudents[index], message: 'Student updated successfully (Memory)' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/students/:id - Delete a student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await Student.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Student not found' });
      return res.json({ success: true, data: deleted, message: 'Student deleted successfully from MongoDB' });
    }

    const index = memoryStudents.findIndex((s) => s._id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Student not found' });

    const deleted = memoryStudents.splice(index, 1);
    return res.json({ success: true, data: deleted[0], message: 'Student deleted successfully (Memory)' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
