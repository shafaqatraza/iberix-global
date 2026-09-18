import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { db } from './db.js';
import { authMiddleware, hashPassword } from './lib/auth.js';
import authRoutes from './routes/auth.js';
import leadsRoutes from './routes/leads.js';
import functionsRoutes from './routes/functions.js';
import uploadRoutes from './routes/upload.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));

// --- App settings ---
app.get('/api/app/settings', (_req, res) => {
  const row = db.prepare('SELECT * FROM app_settings LIMIT 1').get();
  res.json({ id: row?.id || 'singleton', public_settings: JSON.parse(row?.public_settings || '{}') });
});

// --- Auth ---
app.use('/api/auth', authRoutes);

// --- Leads ---
app.use('/api/leads', leadsRoutes);

// --- Functions (AdminConsole) ---
app.use('/api/functions', functionsRoutes);

// --- File uploads ---
app.use('/api', uploadRoutes);

// --- Users ---
app.get('/api/users', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  res.json(db.prepare('SELECT id, email, full_name, role, created_date FROM users').all());
});

app.get('/api/users/:id', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, email, full_name, role, created_date FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.post('/api/users/invite', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const { email, role } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'User already exists' });

  const id = randomUUID();
  const hash = await hashPassword(randomUUID());
  db.prepare('INSERT INTO users (id, email, password_hash, role, is_verified) VALUES (?, ?, ?, ?, 1)').run(id, email, hash, role || 'user');
  res.json({ message: 'User invited', id });
});

// --- Health check ---
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`\n  Iberix backend running on http://localhost:${PORT}`);
  console.log(`  API base: http://localhost:${PORT}/api\n`);
});