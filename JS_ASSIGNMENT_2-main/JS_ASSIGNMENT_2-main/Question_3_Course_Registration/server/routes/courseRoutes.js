const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Registration = require('../models/Registration');

// Default initial courses
const initialCourses = [
  {
    _id: 'c_1',
    courseCode: 'U21CSP12',
    courseName: 'JavaScript Frameworks (React, Node, Express, Angular)',
    instructor: 'Dr. K. Sathish Kumar',
    credits: 4,
    department: 'CSE',
    totalSlots: 60,
    availableSlots: 24,
    schedule: 'Mon, Wed, Fri 09:00 AM - 10:00 AM',
    description: 'Comprehensive study of modern client-side and server-side JS frameworks including React, Angular, and Node.js.',
  },
  {
    _id: 'c_2',
    courseCode: 'U21CSP15',
    courseName: 'Cloud Computing and DevOps',
    instructor: 'Dr. M. Priyanka',
    credits: 3,
    department: 'CSE',
    totalSlots: 60,
    availableSlots: 18,
    schedule: 'Tue, Thu 10:15 AM - 11:45 AM',
    description: 'Architecting cloud-native microservices, containerization with Docker & Kubernetes, and CI/CD pipelines.',
  },
  {
    _id: 'c_3',
    courseCode: 'U21CSP18',
    courseName: 'Deep Learning & Neural Networks',
    instructor: 'Dr. R. Vignesh',
    credits: 4,
    department: 'AI & DS',
    totalSlots: 50,
    availableSlots: 7,
    schedule: 'Mon, Thu 01:30 PM - 03:00 PM',
    description: 'Theory and application of convolutional neural networks, transformer architectures, and computer vision.',
  },
  {
    _id: 'c_4',
    courseCode: 'U21CSP21',
    courseName: 'Cyber Security & Ethical Hacking',
    instructor: 'Prof. S. Arun',
    credits: 3,
    department: 'IT',
    totalSlots: 50,
    availableSlots: 32,
    schedule: 'Wed, Fri 02:00 PM - 03:30 PM',
    description: 'Network defense strategies, penetration testing, cryptography, and vulnerability assessment.',
  },
  {
    _id: 'c_5',
    courseCode: 'U21CSP25',
    courseName: 'Mobile Application Development',
    instructor: 'Dr. P. Deepa',
    credits: 3,
    department: 'CSE',
    totalSlots: 60,
    availableSlots: 40,
    schedule: 'Tue, Fri 11:30 AM - 01:00 PM',
    description: 'Cross-platform native mobile applications using Flutter and React Native with RESTful backends.',
  },
];

let memoryCourses = JSON.parse(JSON.stringify(initialCourses));
let memoryRegistrations = [
  {
    _id: 'reg_demo_1',
    studentName: 'Kavitha R',
    studentRollNo: '21CS045',
    studentEmail: 'kavitha.r@kpriet.ac.in',
    studentDept: 'Computer Science and Engineering',
    studentSemester: 'V',
    courseCode: 'U21CSP12',
    courseName: 'JavaScript Frameworks (React, Node, Express, Angular)',
    registeredAt: new Date(),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// Seed initial courses if MongoDB database is empty
async function seedCoursesIfEmpty() {
  if (isDbConnected()) {
    const count = await Course.countDocuments();
    if (count === 0) {
      await Course.insertMany(initialCourses.map(({ _id, ...rest }) => rest));
      console.log('✓ Seeded standard courses into MongoDB course collection');
    }
  }
}

// GET /api/courses - Display available courses
router.get('/courses', async (req, res) => {
  try {
    if (isDbConnected()) {
      await seedCoursesIfEmpty();
      const courses = await Course.find().sort({ courseCode: 1 });
      return res.json({ success: true, count: courses.length, data: courses, storage: 'MongoDB' });
    }
    return res.json({
      success: true,
      count: memoryCourses.length,
      data: memoryCourses,
      storage: 'In-Memory (Connect MongoDB in .env for persistence)',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/register - Course Registration
router.post('/register', async (req, res) => {
  try {
    const { studentName, studentRollNo, studentEmail, studentDept, studentSemester, courseCode } = req.body;

    if (!studentName || !studentRollNo || !studentEmail || !studentDept || !courseCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, roll no, email, department, and course code',
      });
    }

    const rollNoUpper = studentRollNo.toUpperCase();
    const courseCodeUpper = courseCode.toUpperCase();

    if (isDbConnected()) {
      // Find course
      const course = await Course.findOne({ courseCode: courseCodeUpper });
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      if (course.availableSlots <= 0) {
        return res.status(400).json({ success: false, message: 'No available slots remaining for this course' });
      }

      // Check if already registered
      const existing = await Registration.findOne({
        studentRollNo: rollNoUpper,
        courseCode: courseCodeUpper,
      });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Student is already registered for this course' });
      }

      // Create registration
      const newRegistration = await Registration.create({
        studentName,
        studentRollNo: rollNoUpper,
        studentEmail,
        studentDept,
        studentSemester: studentSemester || 'V',
        courseCode: course.courseCode,
        courseName: course.courseName,
      });

      // Decrement slot count
      course.availableSlots = Math.max(0, course.availableSlots - 1);
      await course.save();

      return res.status(201).json({
        success: true,
        data: newRegistration,
        message: `Successfully registered for ${course.courseName}!`,
      });
    }

    // In-memory fallback
    const course = memoryCourses.find((c) => c.courseCode.toUpperCase() === courseCodeUpper);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.availableSlots <= 0) {
      return res.status(400).json({ success: false, message: 'No available slots remaining for this course' });
    }

    const alreadyReg = memoryRegistrations.find(
      (r) => r.studentRollNo.toUpperCase() === rollNoUpper && r.courseCode.toUpperCase() === courseCodeUpper
    );
    if (alreadyReg) {
      return res.status(400).json({ success: false, message: 'Student is already registered for this course' });
    }

    course.availableSlots -= 1;
    const newRegistration = {
      _id: 'reg_' + Date.now(),
      studentName,
      studentRollNo: rollNoUpper,
      studentEmail,
      studentDept,
      studentSemester: studentSemester || 'V',
      courseCode: course.courseCode,
      courseName: course.courseName,
      registeredAt: new Date(),
    };
    memoryRegistrations.unshift(newRegistration);

    return res.status(201).json({
      success: true,
      data: newRegistration,
      message: `Successfully registered for ${course.courseName}! (Memory)`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/cancel - Course Registration Cancellation
router.post('/cancel', async (req, res) => {
  try {
    const { studentRollNo, courseCode } = req.body;

    if (!studentRollNo || !courseCode) {
      return res.status(400).json({
        success: false,
        message: 'Student roll number and course code are required for cancellation',
      });
    }

    const rollNoUpper = studentRollNo.toUpperCase();
    const courseCodeUpper = courseCode.toUpperCase();

    if (isDbConnected()) {
      const deleted = await Registration.findOneAndDelete({
        studentRollNo: rollNoUpper,
        courseCode: courseCodeUpper,
      });

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'No active registration record found for this roll number and course code',
        });
      }

      // Increment available slot back
      await Course.findOneAndUpdate(
        { courseCode: courseCodeUpper },
        { $inc: { availableSlots: 1 } }
      );

      return res.json({
        success: true,
        message: `Registration for ${deleted.courseName} cancelled successfully!`,
      });
    }

    // In-memory
    const index = memoryRegistrations.findIndex(
      (r) => r.studentRollNo.toUpperCase() === rollNoUpper && r.courseCode.toUpperCase() === courseCodeUpper
    );
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'No active registration record found for this roll number and course code',
      });
    }

    const deleted = memoryRegistrations.splice(index, 1)[0];
    const course = memoryCourses.find((c) => c.courseCode.toUpperCase() === courseCodeUpper);
    if (course) {
      course.availableSlots = Math.min(course.totalSlots, course.availableSlots + 1);
    }

    return res.json({
      success: true,
      message: `Registration for ${deleted.courseName} cancelled successfully!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/registrations/:rollNo - Get student's registrations
router.get('/registrations/:rollNo', async (req, res) => {
  try {
    const { rollNo } = req.params;
    const rollNoUpper = rollNo.toUpperCase();

    if (isDbConnected()) {
      const registrations = await Registration.find({ studentRollNo: rollNoUpper }).sort({ registeredAt: -1 });
      return res.json({ success: true, count: registrations.length, data: registrations });
    }

    const list = memoryRegistrations.filter((r) => r.studentRollNo.toUpperCase() === rollNoUpper);
    return res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
