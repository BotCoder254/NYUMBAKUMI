const emailService = require('../services/emailService');

class EmailController {
  async getEmailServiceStatus(req, res) {
    try {
      const status = await emailService.getServiceStatus();
      res.json(status);
    } catch (error) {
      console.error('Error checking email service status:', error);
      res.status(500).json({ error: 'Failed to check email service status' });
    }
  }

  async sendBlogNotification(req, res) {
    try {
      const { blog } = req.body;
      const result = await emailService.sendBlogNotification(blog);
      res.json(result);
    } catch (error) {
      console.error('Blog notification error:', error);
      res.status(500).json({ error: 'Failed to send blog notification' });
    }
  }

  async sendCaseUpdateNotification(req, res) {
    try {
      const { caseDetails, userEmail } = req.body;
      const result = await emailService.sendCaseUpdateNotification(caseDetails, userEmail);
      res.json(result);
    } catch (error) {
      console.error('Case update notification error:', error);
      res.status(500).json({ error: 'Failed to send case update notification' });
    }
  }

  async sendOfficerAssignmentNotification(req, res) {
    try {
      const { caseDetails, officerEmail, officerDetails } = req.body;
      const result = await emailService.sendOfficerAssignmentNotification(
        caseDetails,
        officerEmail,
        officerDetails
      );
      res.json(result);
    } catch (error) {
      console.error('Officer assignment notification error:', error);
      res.status(500).json({ error: 'Failed to send officer assignment notification' });
    }
  }

  async sendSubscriptionConfirmation(req, res) {
    try {
      const { email } = req.body;
      const result = await emailService.sendSubscriptionConfirmation(email);
      res.json(result);
    } catch (error) {
      console.error('Subscription confirmation error:', error);
      res.status(500).json({ error: 'Failed to send subscription confirmation' });
    }
  }

  async sendContactFormSubmission(req, res) {
    try {
      const formData = req.body;
      const result = await emailService.sendContactFormSubmission(formData);
      res.json(result);
    } catch (error) {
      console.error('Contact form submission error:', error);
      res.status(500).json({ error: 'Failed to send contact form submission' });
    }
  }

  async sendAdminAlert(req, res) {
    try {
      const alertData = req.body;
      const result = await emailService.sendAdminAlert(alertData);
      res.json(result);
    } catch (error) {
      console.error('Admin alert error:', error);
      res.status(500).json({ error: 'Failed to send admin alert' });
    }
  }
}

module.exports = new EmailController(); 