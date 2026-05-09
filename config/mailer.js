const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send appointment notification to doctor
const sendAppointmentEmail = async (appointment) => {
  const { patientName, phone, email, preferredDate, preferredTime, service, visitType, problemDescription } = appointment;

  const formattedDate = new Date(preferredDate).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const mailOptions = {
    from: `"MAZ Physio Website" <${process.env.EMAIL_USER}>`,
    to: process.env.CLINIC_EMAIL,
    subject: `🏥 New Appointment — ${patientName} | MAZ Physio`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #d0e8f8;border-radius:12px;overflow:hidden;">
        <div style="background:#2a6fad;padding:24px;text-align:center;">
          <h2 style="color:white;margin:0;">MAZ Physio Care & Surgicals</h2>
          <p style="color:#a8d4f5;margin:6px 0 0;">New Appointment Request</p>
        </div>
        <div style="padding:28px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px;background:#f0f6ff;font-weight:bold;border-radius:6px;width:40%;">Patient Name</td><td style="padding:10px;">${patientName}</td></tr>
            <tr><td style="padding:10px;font-weight:bold;">Phone</td><td style="padding:10px;"><a href="tel:${phone}">${phone}</a></td></tr>
            <tr><td style="padding:10px;background:#f0f6ff;font-weight:bold;">Email</td><td style="padding:10px;">${email || 'Not provided'}</td></tr>
            <tr><td style="padding:10px;font-weight:bold;">Date</td><td style="padding:10px;">${formattedDate}</td></tr>
            <tr><td style="padding:10px;background:#f0f6ff;font-weight:bold;">Time</td><td style="padding:10px;">${preferredTime || 'Not specified'}</td></tr>
            <tr><td style="padding:10px;font-weight:bold;">Service</td><td style="padding:10px;"><strong style="color:#2a6fad;">${service}</strong></td></tr>
            <tr><td style="padding:10px;background:#f0f6ff;font-weight:bold;">Visit Type</td><td style="padding:10px;">${visitType === 'home_visit' ? '🏠 Home Visit' : '🏥 Clinic Visit'}</td></tr>
            <tr><td style="padding:10px;font-weight:bold;">Problem</td><td style="padding:10px;">${problemDescription || 'Not described'}</td></tr>
          </table>
          <div style="margin-top:20px;padding:14px;background:#eef7e6;border-radius:8px;border-left:4px solid #6abf3e;">
            <p style="margin:0;font-size:14px;color:#374151;">Please call <strong>${patientName}</strong> on <strong>${phone}</strong> to confirm this appointment.</p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send confirmation to patient
const sendPatientConfirmation = async (appointment) => {
  if (!appointment.email) return;

  const formattedDate = new Date(appointment.preferredDate).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const mailOptions = {
    from: `"MAZ Physio Care & Surgicals" <${process.env.EMAIL_USER}>`,
    to: appointment.email,
    subject: `Appointment Received — MAZ Physio Care`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#2a6fad;padding:24px;text-align:center;border-radius:12px 12px 0 0;">
          <h2 style="color:white;margin:0;">MAZ Physio Care & Surgicals</h2>
        </div>
        <div style="padding:28px;border:1px solid #d0e8f8;border-top:none;border-radius:0 0 12px 12px;">
          <p>Dear <strong>${appointment.patientName}</strong>,</p>
          <p>Your appointment request has been received. Our team will call you on <strong>${appointment.phone}</strong> to confirm your slot.</p>
          <p><strong>Service:</strong> ${appointment.service}</p>
          <p><strong>Requested Date:</strong> ${formattedDate}</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
          <p><strong>MAZ Physio Care & Surgicals</strong><br>
          No. 6, Lodge Building, Ramanathapuram – 623504<br>
          📞 7448858968 / 9150758968<br>
          ✉ physioumer@gmail.com</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendAppointmentEmail, sendPatientConfirmation };
