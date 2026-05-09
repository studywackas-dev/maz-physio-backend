const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ---- Middleware ----
app.use(cors({ origin: '*' })); // Change '*' to your domain in production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting — prevent spam bookings
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many requests. Please try again after 15 minutes.' },
});
app.use('/api/', limiter);

// ---- Routes ----
app.use('/api', require('./routes/index'));
app.use(express.static(__dirname));

// ---- Health check ----
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏥 MAZ Physio Care & Surgicals — Backend is running!',
    clinic: 'Dr. Umer Farook | BPT, DOFSIM, MIAP',
    location: 'Ramanathapuram – 623504',
    endpoints: {
      bookAppointment: 'POST /api/appointments',
      contactUs: 'POST /api/contact',
      adminLogin: 'POST /api/admin/login',
      adminSetup: 'POST /api/admin/setup (first time only)',
    },
  });
});

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ---- Start server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 MAZ Physio Backend running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🔑 Admin setup: POST http://localhost:${PORT}/api/admin/setup\n`);
});
