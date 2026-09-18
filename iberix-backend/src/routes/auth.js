import { Router } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db.js';
import { signToken, hashPassword, comparePassword, authMiddleware } from '../lib/auth.js';
import { sendEmail } from '../lib/email.js';

const router = Router();

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function publicUser(row) {
  if (!row) return null;
  return { id: row.id, email: row.email, full_name: row.full_name, role: row.role };
}

// Register — creates unverified user, sends OTP
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const hash = await hashPassword(password);
  const id = randomUUID();
  db.prepare('INSERT INTO users (id, email, password_hash, is_verified) VALUES (?, ?, ?, 0)').run(id, email, hash);

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  db.prepare('INSERT INTO otp_codes (id, email, code, expires_at) VALUES (?, ?, ?, ?)').run(randomUUID(), email, otp, expiresAt);

  await sendEmail({ to: email, subject: 'Iberix — Verify your email', body: `Your verification code is: ${otp}\n\nIt expires in 10 minutes.` });
  res.json({ message: 'Check your email for a verification code.' });
});

// Verify OTP — verifies user, returns access token
router.post('/verify-otp', async (req, res) => {
  const { email, otpCode } = req.body;
  const record = db.prepare('SELECT * FROM otp_codes WHERE email = ? AND used = 0 ORDER BY created_date DESC LIMIT 1').get(email);
  if (!record) return res.status(401).json({ error: 'No code found. Request a new one.' });
  if (new Date() > new Date(record.expires_at)) return res.status(401).json({ error: 'Code expired. Request a new one.' });
  if (record.code !== String(otpCode)) return res.status(401).json({ error: 'Invalid code' });

  db.prepare('UPDATE otp_codes SET used = 1 WHERE id = ?').run(record.id);
  db.prepare('UPDATE users SET is_verified = 1 WHERE email = ?').run(email);

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  const access_token = signToken({ user_id: user.id, email: user.email, role: user.role });
  res.json({ access_token, user: publicUser(user) });
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (user) {
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    db.prepare('INSERT INTO otp_codes (id, email, code, expires_at) VALUES (?, ?, ?, ?)').run(randomUUID(), email, otp, expiresAt);
    await sendEmail({ to: email, subject: 'Iberix — Your verification code', body: `Your new verification code is: ${otp}\n\nIt expires in 10 minutes.` });
  }
  res.json({ message: 'If the email exists, a new code has been sent.' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });
  if (!user.is_verified) return res.status(403).json({ error: 'Email not verified. Check your inbox for a verification code.' });

  const access_token = signToken({ user_id: user.id, email: user.email, role: user.role });
  res.json({ access_token, user: publicUser(user) });
});

// Get current user
router.get('/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.user_id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(publicUser(user));
});

// Update current user
router.patch('/me', authMiddleware, (req, res) => {
  const { full_name } = req.body;
  if (full_name !== undefined) {
    db.prepare('UPDATE users SET full_name = ?, updated_date = ? WHERE id = ?').run(full_name, new Date().toISOString(), req.user.user_id);
  }
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.user_id);
  res.json(publicUser(user));
});

// Password reset request
router.post('/reset-request', async (req, res) => {
  const { email } = req.body;
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (user) {
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    db.prepare('INSERT INTO reset_tokens (id, email, token, expires_at) VALUES (?, ?, ?, ?)').run(randomUUID(), email, token, expiresAt);
    await sendEmail({ to: email, subject: 'Iberix — Password reset', body: `Use this token to reset your password: ${token}\n\nIt expires in 1 hour.` });
  }
  res.json({ message: 'If the email exists, a reset link has been sent.' });
});

// Password reset
router.post('/reset', async (req, res) => {
  const { resetToken, newPassword } = req.body;
  const record = db.prepare('SELECT * FROM reset_tokens WHERE token = ? AND used = 0').get(resetToken);
  if (!record) return res.status(401).json({ error: 'Invalid or expired token' });
  if (new Date() > new Date(record.expires_at)) return res.status(401).json({ error: 'Token expired' });

  const hash = await hashPassword(newPassword);
  db.prepare('UPDATE users SET password_hash = ?, updated_date = ? WHERE email = ?').run(hash, new Date().toISOString(), record.email);
  db.prepare('UPDATE reset_tokens SET used = 1 WHERE id = ?').run(record.id);
  res.json({ message: 'Password reset. You can now log in.' });
});

export default router;