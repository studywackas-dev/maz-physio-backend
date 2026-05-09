const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const { bookAppointment, getAllAppointments, getTodayAppointments, updateAppointmentStatus, deleteAppointment } = require('../controllers/appointmentController');
const { submitContact, getAllMessages, markAsRead } = require('../controllers/contactController');
const { loginAdmin, setupAdmin, getProfile } = require('../controllers/adminController');

// ---- PUBLIC ROUTES ----
router.post('/appointments', bookAppointment);          // Book appointment
router.post('/contact', submitContact);                  // Send contact message

// ---- ADMIN AUTH ----
router.post('/admin/setup', setupAdmin);                 // First time only
router.post('/admin/login', loginAdmin);                 // Admin login
router.get('/admin/profile', protect, getProfile);       // Get profile

// ---- ADMIN PROTECTED ROUTES ----
router.get('/appointments', protect, getAllAppointments);              // All appointments
router.get('/appointments/today', protect, getTodayAppointments);     // Today's list
router.patch('/appointments/:id', protect, updateAppointmentStatus);  // Update status
router.delete('/appointments/:id', protect, deleteAppointment);       // Delete

router.get('/contact', protect, getAllMessages);                       // All messages
router.patch('/contact/:id/read', protect, markAsRead);               // Mark read

module.exports = router;
