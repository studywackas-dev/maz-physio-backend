const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// @POST /api/admin/login
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ success: false, message: 'Username and password required.' });

    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });

    res.json({
      success: true,
      message: `Welcome back, ${username}!`,
      token: generateToken(admin._id),
      username: admin.username,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/admin/setup — First time admin creation (run once)
const setupAdmin = async (req, res) => {
  try {
    const existing = await Admin.findOne({});
    if (existing)
      return res.status(400).json({ success: false, message: 'Admin already exists.' });

    const admin = await Admin.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'maz@2025',
    });

    res.status(201).json({ success: true, message: 'Admin created. Please login now.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/admin/profile — Get admin info
const getProfile = async (req, res) => {
  res.json({ success: true, username: req.admin.username });
};

module.exports = { loginAdmin, setupAdmin, getProfile };
