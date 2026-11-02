const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    courseName: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    instructor: {
      type: String,
      required: [true, 'Instructor name is required'],
      trim: true,
    },
    credits: {
      type: Number,
      required: [true, 'Course credits are required'],
      default: 3,
      min: 1,
      max: 6,
    },
    department: {
      type: String,
      default: 'CSE',
      trim: true,
    },
    totalSlots: {
      type: Number,
      default: 60,
      min: 1,
    },
    availableSlots: {
      type: Number,
      default: 60,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    schedule: {
      type: String,
      default: 'Mon / Wed 10:00 AM - 11:30 AM',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
