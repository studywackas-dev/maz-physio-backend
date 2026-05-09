const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6-9][0-9]{9}$/, 'Enter a valid 10-digit Indian mobile number'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  preferredDate: {
    type: Date,
    required: [true, 'Preferred date is required'],
  },
  preferredTime: {
    type: String,
    trim: true,
  },
  service: {
    type: String,
    required: [true, 'Service is required'],
    enum: [
      'Back Pain',
      'Knee Pain',
      'Shoulder Pain',
      'Neck Pain',
      'Ankle & Foot Pain',
      'Elbow & Wrist Pain',
      'Sports Injury',
      'Neurological Rehab',
      'Paediatric Physio',
      'Cardiac Physio',
      'Stroke Rehabilitation',
      'Home Visit',
      'Surgical Supplies',
      'Other',
    ],
  },
  problemDescription: {
    type: String,
    trim: true,
  },
  visitType: {
    type: String,
    enum: ['clinic', 'home_visit'],
    default: 'clinic',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  notes: {
    type: String, // Doctor's internal notes
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
