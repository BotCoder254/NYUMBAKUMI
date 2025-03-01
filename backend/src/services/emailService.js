const { transporter, emailTemplates, checkEmailService } = require('../config/emailConfig');
const admin = require('firebase-admin');

class EmailService {
  constructor() {
    this.initializeService();
  }

  async initializeService() {
    const status = await checkEmailService();
    this.isReady = status.status === 'ready';
    console.log('Email Service Status:', status.message);
  }

  async sendBlogNotification(blog) {
    if (!this.isReady) {
      throw new Error('Email service is not ready');
    }

    try {
      // Get all subscribed users
      const subscribersSnapshot = await admin.firestore()
        .collection('subscribers')
        .where('isActive', '==', true)
        .get();

      const subscribers = subscribersSnapshot.docs.map(doc => doc.data().email);
      const template = emailTemplates.blogNotification(blog);

      // Send email to all subscribers
      await Promise.all(subscribers.map(email =>
        transporter.sendMail({
          to: email,
          ...template
        })
      ));

      return { success: true, message: 'Blog notification sent successfully' };
    } catch (error) {
      console.error('Error sending blog notification:', error);
      throw error;
    }
  }

  async sendCaseUpdateNotification(caseDetails, userEmail) {
    if (!this.isReady) {
      throw new Error('Email service is not ready');
    }

    try {
      const template = emailTemplates.caseUpdate(caseDetails);
      await transporter.sendMail({
        to: userEmail,
        ...template
      });

      return { success: true, message: 'Case update notification sent successfully' };
    } catch (error) {
      console.error('Error sending case update notification:', error);
      throw error;
    }
  }

  async sendOfficerAssignmentNotification(caseDetails, officerEmail, officerDetails) {
    if (!this.isReady) {
      throw new Error('Email service is not ready');
    }

    try {
      // Send notification to assigned officer
      const officerTemplate = emailTemplates.officerAssignment(caseDetails, officerDetails);
      await transporter.sendMail({
        to: officerEmail,
        ...officerTemplate
      });

      try {
        // Get OCS email from the station
        const stationDoc = await admin.firestore()
          .collection('stations')
          .doc(officerDetails.station)
          .get();

        if (stationDoc.exists && stationDoc.data().ocsEmail) {
          // Send notification to OCS
          const ocsTemplate = emailTemplates.ocsNotification(caseDetails, officerDetails);
          await transporter.sendMail({
            to: stationDoc.data().ocsEmail,
            ...ocsTemplate
          });
        } else {
          // If no OCS email found, send to admin email as fallback
          const ocsTemplate = emailTemplates.ocsNotification(caseDetails, officerDetails);
          await transporter.sendMail({
            to: process.env.ADMIN_EMAIL,
            ...ocsTemplate
          });
        }
      } catch (ocsError) {
        // If there's an error with OCS notification, log it but don't fail the whole operation
        console.error('Error sending OCS notification:', ocsError);
      }

      return { success: true, message: 'Officer notification sent successfully' };
    } catch (error) {
      console.error('Error sending officer assignment notification:', error);
      throw error;
    }
  }

  async sendSubscriptionConfirmation(email) {
    if (!this.isReady) {
      throw new Error('Email service is not ready');
    }

    try {
      const template = emailTemplates.subscriptionConfirmation(email);
      await transporter.sendMail({
        to: email,
        ...template
      });

      return { success: true, message: 'Subscription confirmation sent successfully' };
    } catch (error) {
      console.error('Error sending subscription confirmation:', error);
      throw error;
    }
  }

  async sendContactFormSubmission(formData) {
    if (!this.isReady) {
      throw new Error('Email service is not ready');
    }

    try {
      const template = emailTemplates.contactFormSubmission(formData);
      await transporter.sendMail({
        to: process.env.ADMIN_EMAIL,
        replyTo: formData.email,
        ...template
      });

      return { success: true, message: 'Contact form submission sent successfully' };
    } catch (error) {
      console.error('Error sending contact form submission:', error);
      throw error;
    }
  }

  async sendAdminAlert(alertData) {
    if (!this.isReady) {
      throw new Error('Email service is not ready');
    }

    try {
      const adminEmails = process.env.ADMIN_EMAILS.split(',');
      await Promise.all(adminEmails.map(email =>
        transporter.sendMail({
          to: email,
          subject: `ALERT: ${alertData.type}`,
          html: baseEmailTemplate(`
            <h2 style="color: #dc2626;">Important Alert</h2>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <p><strong>Type:</strong> ${alertData.type}</p>
              <p><strong>Message:</strong> ${alertData.message}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            ${alertData.link ? `<a href="${alertData.link}" class="button">View Details</a>` : ''}
          `)
        })
      ));

      return { success: true, message: 'Admin alert sent successfully' };
    } catch (error) {
      console.error('Error sending admin alert:', error);
      throw error;
    }
  }

  async getServiceStatus() {
    return await checkEmailService();
  }
}

module.exports = new EmailService(); 