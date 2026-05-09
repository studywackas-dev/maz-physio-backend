const Appointment = require('../models/Appointment');
const { sendAppointmentEmail, sendPatientConfirmation } = require('../config/mailer');

// @POST /api/appointments — Book new appointment (public)
const bookAppointment = async (req, res) => {
  try {
    const { patientName, phone, email, preferredDate, preferredTime, service, problemDescription, visitType } = req.body;

    const appointment = await Appointment.create({
      patientName, phone, email, preferredDate,
      preferredTime, service, problemDescription,
      visitType: visitType || 'clinic',
    });

    // Send email notifications (don't block response if email fails)
    try {
      await sendAppointmentEmail(appointment);
      await sendPatientConfirmation(appointment);
    } catch (emailErr) {
      console.error('Email error:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: `Thank you ${patientName}! Your appointment request has been received. Dr. Umer Farook's team will call you on ${phone} to confirm.`,
      appointmentId: appointment._id,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: 'Something went wrong. Please call 7448858968 directly.' });
  }
};

// @GET /api/appointments — Get all appointments (admin only)
const getAllAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.preferredDate = { $gte: start, $lt: end };
    }

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });

    // Count by status
    const counts = {
      total: await Appointment.countDocuments(),
      pending: await Appointment.countDocuments({ status: 'pending' }),
      confirmed: await Appointment.countDocuments({ status: 'confirmed' }),
      completed: await Appointment.countDocuments({ status: 'completed' }),
      cancelled: await Appointment.countDocuments({ status: 'cancelled' }),
    };

    res.json({ success: true, counts, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/appointments/today — Today's appointments (admin)
const getTodayAppointments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      preferredDate: { $gte: today, $lt: tomorrow },
    }).sort({ preferredTime: 1 });

    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PATCH /api/appointments/:id — Update appointment status (admin)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    res.json({ success: true, message: `Appointment marked as ${status}.`, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @DELETE /api/appointments/:id — Delete appointment (admin)
const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Appointment deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getAllAppointments,
  getTodayAppointments,
  updateAppointmentStatus,
  deleteAppointment,
};
