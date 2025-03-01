const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { sendOfficerAssignmentEmail } = require('../utils/emailService');

// Email service status
router.get('/status', emailController.getEmailServiceStatus);

// Blog notifications
router.post('/blog-notification', emailController.sendBlogNotification);

// Case updates
router.post('/case-update', emailController.sendCaseUpdateNotification);

// Officer assignments
router.post('/officer-assignment', emailController.sendOfficerAssignmentNotification);

// Subscription confirmation
router.post('/subscribe', emailController.sendSubscriptionConfirmation);

// Contact form
router.post('/contact', emailController.sendContactFormSubmission);

// Admin alerts
router.post('/admin-alert', emailController.sendAdminAlert);

router.post('/send-assignment', async (req, res) => {
  try {
    const { officerEmail, reportDetails } = req.body;
    
    if (!officerEmail || !reportDetails) {
      return res.status(400).json({ 
        success: false, 
        message: 'Officer email and report details are required' 
      });
    }

    const result = await sendOfficerAssignmentEmail(officerEmail, reportDetails);
    
    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: 'Assignment email sent successfully' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send assignment email',
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Error in send-assignment route:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Health check endpoint
router.get('/status', (req, res) => {
  res.status(200).json({ status: 'Email service is running' });
});

module.exports = router; 