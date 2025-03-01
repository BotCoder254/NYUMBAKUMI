const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
  });
};

const sendOfficerAssignmentEmail = async (officerEmail, reportDetails) => {
  try {
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .section { margin-bottom: 20px; }
          .label { font-weight: bold; color: #666; }
          .value { margin-top: 5px; }
          .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
          .urgent { color: #dc2626; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Case Assignment</h2>
          </div>
          <div class="content">
            <div class="section">
              <p>You have been assigned to a new case. Please review the details below:</p>
            </div>

            <div class="section">
              <div class="label">Case Status:</div>
              <div class="value ${reportDetails.status === 'urgent' ? 'urgent' : ''}">
                ${reportDetails.status?.toUpperCase()}
              </div>
            </div>

            <div class="section">
              <div class="label">Incident Type:</div>
              <div class="value">${reportDetails.incidentType?.charAt(0).toUpperCase() + reportDetails.incidentType?.slice(1)}</div>
            </div>

            <div class="section">
              <div class="label">Location:</div>
              <div class="value">${reportDetails.location}</div>
            </div>

            <div class="section">
              <div class="label">County:</div>
              <div class="value">${reportDetails.county}</div>
            </div>

            <div class="section">
              <div class="label">Date & Time:</div>
              <div class="value">${reportDetails.date} at ${reportDetails.time}</div>
            </div>

            <div class="section">
              <div class="label">Description:</div>
              <div class="value">${reportDetails.description}</div>
            </div>

            ${reportDetails.evidenceUrl ? `
            <div class="section">
              <div class="label">Evidence:</div>
              <div class="value">
                <a href="${reportDetails.evidenceUrl}" target="_blank">View Evidence</a>
              </div>
            </div>
            ` : ''}

            ${reportDetails.additionalNotes ? `
            <div class="section">
              <div class="label">Additional Notes:</div>
              <div class="value">${reportDetails.additionalNotes}</div>
            </div>
            ` : ''}

            <div class="section">
              <div class="label">Assignment Details:</div>
              <div class="value">
                <p>Assigned on: ${formatDate(reportDetails.assignedAt)}</p>
                ${reportDetails.lastUpdated ? `<p>Last updated: ${formatDate(reportDetails.lastUpdated)}</p>` : ''}
              </div>
            </div>

            <div class="footer">
              <p>Please take immediate action on this case.</p>
              <p>This is an automated message. Do not reply to this email.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: officerEmail,
      subject: `${reportDetails.status === 'urgent' ? '[URGENT] ' : ''}New Case Assignment - Crime Report`,
      html: emailContent,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOfficerAssignmentEmail,
}; 