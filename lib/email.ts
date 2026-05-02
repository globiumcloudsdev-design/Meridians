import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Send email
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || '"Meridian\'s Education" <globiumcloudsdev@gmail.com>',
    to,
    subject,
    text,
    html: html || text.replace(/\n/g, '<br>'),
  });

  console.log('Email sent:', info.messageId);
  return info;
}
