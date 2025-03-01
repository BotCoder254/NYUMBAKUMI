const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Ensure environment variables are loaded
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_SERVICE'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // This should be an app-specific password
  },
  tls: {
    rejectUnauthorized: false // Only for development
  }
});

// Base email template with consistent styling
const baseEmailTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { 
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
      color: #1f2937;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #dc2626;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: white;
      padding: 30px;
      border: 1px solid #e5e7eb;
      border-radius: 0 0 8px 8px;
    }
    .button {
      display: inline-block;
      background-color: #dc2626;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Crime Report Kenya</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Crime Report Kenya. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Email templates
const emailTemplates = {
  blogNotification: (blog) => ({
    subject: `New Blog Post: ${blog.title}`,
    html: baseEmailTemplate(`
      <h2 style="color: #dc2626;">New Blog Post Published</h2>
      <h3>${blog.title}</h3>
      <p>${blog.seoDescription || blog.content.substring(0, 150)}...</p>
      <a href="${process.env.FRONTEND_URL}/blog/${blog.id}" class="button">Read More</a>
    `)
  }),

  caseUpdate: (caseDetails) => ({
    subject: `Case Update: ${caseDetails.trackingId}`,
    html: baseEmailTemplate(`
      <h2 style="color: #dc2626;">Case Status Update</h2>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <p><strong>Case ID:</strong> ${caseDetails.trackingId}</p>
        <p><strong>New Status:</strong> ${caseDetails.status}</p>
        <p><strong>Updated on:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Notes:</strong> ${caseDetails.statusNotes || 'No additional notes'}</p>
      </div>
      <a href="${process.env.FRONTEND_URL}/track-report" class="button">Track Your Case</a>
    `)
  }),

  officerAssignment: (caseDetails, officerDetails) => ({
    subject: `New Case Assignment: ${caseDetails.trackingId}`,
    html: baseEmailTemplate(`
      <h2 style="color: #dc2626;">New Case Assignment</h2>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <p><strong>Case ID:</strong> ${caseDetails.trackingId}</p>
        <p><strong>Location:</strong> ${caseDetails.location}</p>
        <p><strong>Type:</strong> ${caseDetails.incidentType}</p>
        <p><strong>Priority:</strong> ${caseDetails.priority}</p>
        <p><strong>Description:</strong> ${caseDetails.description}</p>
      </div>
      <a href="${process.env.FRONTEND_URL}/admin" class="button">View Case Details</a>
    `)
  }),

  ocsNotification: (caseDetails, officerDetails) => ({
    subject: `Case Assignment Notification: ${caseDetails.trackingId}`,
    html: baseEmailTemplate(`
      <h2 style="color: #dc2626;">Case Assignment Notification</h2>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <p><strong>Officer Assigned:</strong> ${officerDetails.name}</p>
        <p><strong>Officer Badge:</strong> ${officerDetails.badgeNumber}</p>
        <p><strong>Case ID:</strong> ${caseDetails.trackingId}</p>
        <p><strong>Location:</strong> ${caseDetails.location}</p>
        <p><strong>Type:</strong> ${caseDetails.incidentType}</p>
        <p><strong>Priority:</strong> ${caseDetails.priority}</p>
      </div>
      <a href="${process.env.FRONTEND_URL}/admin" class="button">Review Assignment</a>
    `)
  }),

  subscriptionConfirmation: (email) => ({
    subject: 'Welcome to Crime Report Kenya Newsletter',
    html: baseEmailTemplate(`
      <h2 style="color: #dc2626;">Thank you for subscribing!</h2>
      <p>You will now receive updates about:</p>
      <ul style="list-style-type: none; padding: 0;">
        <li>✓ New blog posts</li>
        <li>✓ Safety tips and alerts</li>
        <li>✓ Community updates</li>
        <li>✓ Important announcements</li>
      </ul>
      <p>Stay informed and help make Kenya safer.</p>
      <a href="${process.env.FRONTEND_URL}/unsubscribe?email=${email}" style="color: #6b7280; text-decoration: underline; font-size: 14px;">Unsubscribe</a>
    `)
  }),

  contactFormSubmission: (formData) => ({
    subject: 'New Contact Form Submission',
    html: baseEmailTemplate(`
      <h2 style="color: #dc2626;">Contact Form Submission</h2>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <p><strong>From:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${formData.message}</p>
      </div>
      <a href="mailto:${formData.email}" class="button">Reply to Sender</a>
    `)
  })
};

// Email service status check with detailed error reporting
const checkEmailService = async () => {
  try {
    await transporter.verify();
    console.log('SMTP Configuration:', {
      service: process.env.EMAIL_SERVICE,
      user: process.env.EMAIL_USER,
      host: 'smtp.gmail.com',
      port: 587
    });
    return { status: 'ready', message: 'Email service is configured and ready' };
  } catch (error) {
    console.error('Email service configuration error details:', error);
    return { 
      status: 'error', 
      message: 'Email service configuration error', 
      details: error.message 
    };
  }
};

module.exports = {
  transporter,
  emailTemplates,
  checkEmailService,
  baseEmailTemplate
}; 