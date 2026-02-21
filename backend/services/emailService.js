import nodemailer from 'nodemailer';

// Create reusable transporter
let transporter;

try {
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
} catch (error) {
    console.warn('⚠️  Email service not configured. Email notifications will be disabled.');
}

// Send email function
export const sendEmail = async (options) => {
    try {
        if (!transporter) {
            console.warn('Email service not available');
            return false;
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: options.to,
            subject: options.subject,
            html: options.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        return false;
    }
};

// Email templates
export const emailTemplates = {
    assignmentNotification: (userName, equipmentName, assignedBy) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Equipment Assigned</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${userName}</strong>,</p>
          <p>Great news! The following equipment has been assigned to you:</p>
          <div style="background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">📦 ${equipmentName}</h3>
            <p style="margin: 0; color: #666;">Assigned by: ${assignedBy}</p>
          </div>
          <p>Please ensure you take good care of this equipment. If you have any questions or issues, please contact your HR department.</p>
          <p>Best regards,<br><strong>Smart Inventory Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated message from Smart Inventory Management System</p>
        </div>
      </div>
    </body>
    </html>
  `,

    returnNotification: (userName, equipmentName) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Equipment Returned</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${userName}</strong>,</p>
          <p>This is to confirm that the following equipment has been successfully returned:</p>
          <div style="background: white; padding: 20px; border-left: 4px solid #f5576c; margin: 20px 0;">
            <h3 style="margin: 0;">📦 ${equipmentName}</h3>
          </div>
          <p>Thank you for returning the equipment in good condition.</p>
          <p>Best regards,<br><strong>Smart Inventory Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated message from Smart Inventory Management System</p>
        </div>
      </div>
    </body>
    </html>
  `,

    maintenanceReminder: (equipmentName, scheduledDate, type) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ffa751 0%, #ffe259 100%); color: #333; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔧 Maintenance Reminder</h1>
        </div>
        <div class="content">
          <p>This is a reminder that maintenance is scheduled for the following equipment:</p>
          <div style="background: white; padding: 20px; border-left: 4px solid #ffa751; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">📦 ${equipmentName}</h3>
            <p style="margin: 5px 0;"><strong>Type:</strong> ${type}</p>
            <p style="margin: 5px 0;"><strong>Scheduled Date:</strong> ${new Date(scheduledDate).toLocaleDateString()}</p>
          </div>
          <p>Please ensure the equipment is available for maintenance on the scheduled date.</p>
          <p>Best regards,<br><strong>Smart Inventory Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated message from Smart Inventory Management System</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
