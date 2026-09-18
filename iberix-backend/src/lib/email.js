import nodemailer from 'nodemailer';

const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER);

const transporter = hasSmtp
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

export async function sendEmail({ to, subject, body }) {
  if (!transporter) {
    console.log('\n═══════════════════════════════════════════════');
    console.log('  EMAIL (SMTP not configured — printing to console)');
    console.log('═══════════════════════════════════════════════');
    console.log(`  To:      ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Body:    ${body}`);
    console.log('═══════════════════════════════════════════════\n');
    return;
  }
  await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'noreply@iberix.global',
    to,
    subject,
    text: body,
  });
}