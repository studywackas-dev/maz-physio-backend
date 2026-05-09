const Contact = require('../models/Contact');

// @POST /api/contact — Submit contact message (public)
const submitContact = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    if (!name || !phone || !message)
      return res.status(400).json({ success: false, message: 'Name, phone and message are required.' });

    const contact = await Contact.create({ name, phone, email, message });

    res.status(201).json({
      success: true,
      message: `Thank you ${name}! We will contact you on ${phone} shortly.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/contact — Get all messages (admin)
const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    const unreadCount = await Contact.countDocuments({ isRead: false });
    res.json({ success: true, unreadCount, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PATCH /api/contact/:id/read — Mark as read (admin)
const markAsRead = async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true, message: 'Marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitContact, getAllMessages, markAsRead };
