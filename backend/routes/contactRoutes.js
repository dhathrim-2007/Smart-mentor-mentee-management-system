import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/db.js';

const router = express.Router();

/**
 * POST /api/contact
 * Public inquiry submission endpoint with validation
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, role, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields (Name, Email, Subject, and Message).'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.'
      });
    }

    const referenceId = `INQ-${Math.floor(100000 + Math.random() * 900000)}`;

    const newInquiry = {
      id: `inq-${uuidv4().slice(0, 8)}`,
      reference_code: referenceId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role || 'Prospective Student',
      subject: subject.trim(),
      message: message.trim(),
      status: 'NEW',
      created_at: new Date().toISOString()
    };

    await db.createContactInquiry(newInquiry);

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your inquiry has been logged successfully.',
      referenceCode: referenceId,
      inquiry: {
        referenceCode: referenceId,
        name: newInquiry.name,
        email: newInquiry.email,
        subject: newInquiry.subject,
        createdAt: newInquiry.created_at
      }
    });
  } catch (err) {
    console.error('Contact inquiry error:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to submit your inquiry at this moment. Please try again.'
    });
  }
});

export default router;
