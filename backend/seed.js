const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    console.log('Existing data cleared');

    // ── Create Admin ────────────────────────────────────────
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@hospital.com',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log('Admin created:', admin.email);

    // ── Create Doctors ──────────────────────────────────────
    const doctorUser1 = await User.create({
      name: 'Dr. Arjun Sharma',
      email: 'doctor@hospital.com',
      password: 'Doctor@123',
      role: 'doctor',
    });

    const doctor1 = await Doctor.create({
      userId: doctorUser1._id,
      name: 'Dr. Arjun Sharma',
      email: 'doctor@hospital.com',
      phone: '9876543210',
      specialization: 'Cardiologist',
      qualification: 'MBBS, MD (Cardiology)',
      experience: 10,
      department: 'Cardiology',
      availability: true,
      fee: 800,
    });

    const doctorUser2 = await User.create({
      name: 'Dr. Priya Mehta',
      email: 'priya.mehta@hospital.com',
      password: 'Doctor@123',
      role: 'doctor',
    });

    const doctor2 = await Doctor.create({
      userId: doctorUser2._id,
      name: 'Dr. Priya Mehta',
      email: 'priya.mehta@hospital.com',
      phone: '9876543211',
      specialization: 'Neurologist',
      qualification: 'MBBS, MD (Neurology)',
      experience: 8,
      department: 'Neurology',
      availability: true,
      fee: 900,
    });

    const doctorUser3 = await User.create({
      name: 'Dr. Rohit Verma',
      email: 'rohit.verma@hospital.com',
      password: 'Doctor@123',
      role: 'doctor',
    });

    await Doctor.create({
      userId: doctorUser3._id,
      name: 'Dr. Rohit Verma',
      email: 'rohit.verma@hospital.com',
      phone: '9876543212',
      specialization: 'Orthopedic Surgeon',
      qualification: 'MBBS, MS (Orthopedics)',
      experience: 12,
      department: 'Orthopedics',
      availability: true,
      fee: 700,
    });

    const doctorUser4 = await User.create({
      name: 'Dr. Sneha Patel',
      email: 'sneha.patel@hospital.com',
      password: 'Doctor@123',
      role: 'doctor',
    });

    await Doctor.create({
      userId: doctorUser4._id,
      name: 'Dr. Sneha Patel',
      email: 'sneha.patel@hospital.com',
      phone: '9876543213',
      specialization: 'Pediatrician',
      qualification: 'MBBS, MD (Pediatrics)',
      experience: 6,
      department: 'Pediatrics',
      availability: true,
      fee: 600,
    });

    // ── Create Patient ──────────────────────────────────────
    const patientUser = await User.create({
      name: 'Rahul Kumar',
      email: 'patient@hospital.com',
      password: 'Patient@123',
      role: 'patient',
    });

    await Patient.create({
      userId: patientUser._id,
      name: 'Rahul Kumar',
      email: 'patient@hospital.com',
      phone: '9123456789',
      age: 28,
      gender: 'Male',
      address: '123 MG Road, Bangalore, Karnataka',
      bloodGroup: 'O+',
    });

    console.log('\n✅ Seed data inserted successfully!');
    console.log('\n── Demo Credentials ───────────────────────────');
    console.log('Admin   → admin@hospital.com    / Admin@123');
    console.log('Doctor  → doctor@hospital.com   / Doctor@123');
    console.log('Patient → patient@hospital.com  / Patient@123');
    console.log('────────────────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
