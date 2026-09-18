import { Router } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db.js';
import { sendEmail } from '../lib/email.js';

const router = Router();

// AdminConsole function — mirrors the Base44 backend function exactly.
// Returns { data: { ... } } on success so the frontend's res.data.xxx works.
// Returns { error: "..." } with HTTP error status on failure so the client throws.
router.post('/AdminConsole', async (req, res) => {
  const { action } = req.body;

  try {
    // --- LOGIN: verify credentials, generate OTP, email it ---
    if (action === 'login') {
      const { username, password } = req.body;
      const adminUser = process.env.ADMIN_USERNAME;
      const adminPass = process.env.ADMIN_PASSWORD;
      const otpEmail = process.env.ADMIN_OTP_EMAIL;

      if (!adminUser || !adminPass || !otpEmail) {
        return res.status(503).json({ error: 'Admin credentials not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_OTP_EMAIL.' });
      }
      if (username !== adminUser || password !== adminPass) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const otp = String(Math.floor(100000 + Math.random() * 900000));
      const sessionId = randomUUID();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      db.prepare('INSERT INTO admin_sessions (id, session_id, otp_code, purpose, expires_at, used) VALUES (?, ?, ?, ?, ?, 0)')
        .run(randomUUID(), sessionId, otp, 'otp', expiresAt);

      await sendEmail({
        to: otpEmail,
        subject: 'Iberix Ops Console — Access Code',
        body: `Your one-time access code is: ${otp}\n\nIt expires in 10 minutes.\n\nIf you did not request this code, ignore this email.`,
      });

      return res.json({ data: { otpSent: true, sessionId } });
    }

    // --- VERIFY: check OTP, issue session token ---
    if (action === 'verify') {
      const { sessionId, otp } = req.body;
      const sessions = db.prepare('SELECT * FROM admin_sessions WHERE session_id = ? AND purpose = ? AND used = 0').all(sessionId, 'otp');

      if (!sessions.length) return res.status(401).json({ error: 'Invalid or expired session' });
      const session = sessions[0];
      if (new Date() > new Date(session.expires_at)) return res.status(401).json({ error: 'OTP expired. Please try again.' });
      if (session.otp_code !== String(otp)) return res.status(401).json({ error: 'Invalid OTP code' });

      db.prepare('UPDATE admin_sessions SET used = 1 WHERE id = ?').run(session.id);

      const sessionToken = randomUUID();
      const sessionExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      db.prepare('INSERT INTO admin_sessions (id, session_id, purpose, expires_at, used) VALUES (?, ?, ?, ?, 0)')
        .run(randomUUID(), sessionToken, 'session', sessionExpires);

      return res.json({ data: { sessionToken } });
    }

    // --- LEADS: verify session token, return leads ---
    if (action === 'leads') {
      const { sessionToken } = req.body;
      const sessions = db.prepare('SELECT * FROM admin_sessions WHERE session_id = ? AND purpose = ? AND used = 0').all(sessionToken, 'session');

      if (!sessions.length) return res.status(401).json({ error: 'Unauthorized' });
      if (new Date() > new Date(sessions[0].expires_at)) return res.status(401).json({ error: 'Session expired' });

      const leads = db.prepare('SELECT * FROM leads ORDER BY created_date DESC LIMIT 500').all();
      return res.json({ data: { leads } });
    }

    // --- LOGOUT: invalidate session ---
    if (action === 'logout') {
      const { sessionToken } = req.body;
      const sessions = db.prepare('SELECT * FROM admin_sessions WHERE session_id = ? AND purpose = ? AND used = 0').all(sessionToken, 'session');
      if (sessions.length) {
        db.prepare('UPDATE admin_sessions SET used = 1 WHERE id = ?').run(sessions[0].id);
      }
      return res.json({ data: { success: true } });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;