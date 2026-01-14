const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

async function sendEmail(to, subject, html) {
  if(!transporter) return;
  try{
    const info = await transporter.sendMail({ from: process.env.SMTP_FROM || 'no-reply@henryspell.com', to, subject, html });
    console.log('Email sent', info.messageId);
    return info;
  }catch(e){ console.error('Email error', e); }
}

module.exports = { sendEmail };
