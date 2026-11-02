const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    studentRollNo: {
      type: String,
      required: [true, 'Student roll number is required'],
      trim: true,
      uppercase: true,
    },
    studentEmail: {
      type: String,
      required: [true, 'Student email is required'],
      trim: true,
      lowercase: true,
    },
    studentDept: {
      type: String,
      required: [true, 'Student department is required'],
      trim: true,
    },
    studentSemester: {
      type: String,
      default: 'V',
    },
    courseCode: {
      type: String,
      required: [true, 'Course code is required'],
      trim: true,
      uppercase: true,
    },
    courseName: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Ensure a student cannot register for the same course twice
registrationSchema.index({ studentRollNo: 1, courseCode: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
