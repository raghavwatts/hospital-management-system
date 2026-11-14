const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    // Reference to User model (MongoDB reference / populate)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: [0, 'Experience cannot be negative'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: [
        'Cardiology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'Dermatology',
        'General Medicine',
        'Gynecology',
        'Ophthalmology',
        'ENT',
        'Psychiatry',
        'Radiology',
        'Emergency',
      ],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    fee: {
      type: Number,
      default: 500,
      min: [0, 'Fee cannot be negative'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
