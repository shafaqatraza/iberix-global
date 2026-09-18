import { Router } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db.js';

const router = Router();

const VALID_REGIONS = ['APAC', 'Europe', 'North America', 'MENA', 'Africa', 'LATAM', 'Global'];
const VALID_SERVICES = ['Data Centre Deployment', 'Network Deployment', 'Field Support', 'Dedicated Engineering Teams', 'Multiple'];
const VALID_STATUSES = ['new', 'contacted', 'qualified', 'partnered'];
const SORT_FIELDS = ['created_date', 'updated_date', 'company', 'status', 'region', 'email'];

// Create
router.post('/', (req, res) => {
  const { company, contact_name, email, region, service, scope, status } = req.body;
  if (!company || !contact_name || !email) return res.status(400).json({ error: 'company, contact_name, and email are required' });

  const id = randomUUID();
  const now = new Date().toISOString();
  const createdBy = req.user?.user_id || null;

  db.prepare(`INSERT INTO leads (id, company, contact_name, email, region, service, scope, status, created_by_id, created_date, updated_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    id, company, contact_name, email,
    VALID_REGIONS.includes(region) ? region : 'Global',
    VALID_SERVICES.includes(service) ? service : 'Multiple',
    scope || null,
    VALID_STATUSES.includes(status) ? status : 'new',
    createdBy, now, now
  );

  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
  res.json(lead);
});

// List / filter
router.get('/', (req, res) => {
  const { sort, limit, q } = req.query;
  let sql = 'SELECT * FROM leads';
  const params = [];

  if (q) {
    try {
      const filter = JSON.parse(q);
      const conditions = [];
      for (const [key, value] of Object.entries(filter)) {
        conditions.push(`${key} = ?`);
        params.push(value);
      }
      if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    } catch (_) { /* ignore malformed filter */ }
  }

  if (sort) {
    const desc = sort.startsWith('-');
    const field = desc ? sort.slice(1) : sort;
    sql += ` ORDER BY ${SORT_FIELDS.includes(field) ? field : 'created_date'} ${desc ? 'DESC' : 'ASC'}`;
  } else {
    sql += ' ORDER BY created_date DESC';
  }

  if (limit) {
    sql += ' LIMIT ?';
    params.push(parseInt(limit));
  }

  res.json(db.prepare(sql).all(...params));
});

// Get by id
router.get('/:id', (req, res) => {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json(lead);
});

// Update
router.patch('/:id', (req, res) => {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });

  const { company, contact_name, email, region, service, scope, status } = req.body;
  const updates = { updated_date: new Date().toISOString() };
  if (company !== undefined) updates.company = company;
  if (contact_name !== undefined) updates.contact_name = contact_name;
  if (email !== undefined) updates.email = email;
  if (region !== undefined && VALID_REGIONS.includes(region)) updates.region = region;
  if (service !== undefined && VALID_SERVICES.includes(service)) updates.service = service;
  if (scope !== undefined) updates.scope = scope;
  if (status !== undefined && VALID_STATUSES.includes(status)) updates.status = status;

  const setClause = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  db.prepare(`UPDATE leads SET ${setClause} WHERE id = ?`).run(...Object.values(updates), req.params.id);
  res.json(db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id));
});

// Delete
router.delete('/:id', (req, res) => {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Bulk create
router.post('/bulk', (req, res) => {
  const items = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ error: 'Expected an array' });
  const insert = db.prepare(`INSERT INTO leads (id, company, contact_name, email, region, service, scope, status, created_by_id, created_date, updated_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const tx = db.transaction((rows) => {
    for (const item of rows) {
      const id = randomUUID();
      const now = new Date().toISOString();
      insert.run(id, item.company, item.contact_name, item.email,
        VALID_REGIONS.includes(item.region) ? item.region : 'Global',
        VALID_SERVICES.includes(item.service) ? item.service : 'Multiple',
        item.scope || null, VALID_STATUSES.includes(item.status) ? item.status : 'new',
        null, now, now);
    }
  });
  tx(items);
  res.json({ success: true, count: items.length });
});

// Schema
router.get('/schema', (req, res) => {
  res.json({
    name: 'Lead',
    type: 'object',
    properties: {
      company: { type: 'string', title: 'Company' },
      contact_name: { type: 'string', title: 'Contact Name' },
      email: { type: 'string', format: 'email', title: 'Work Email' },
      region: { type: 'string', enum: VALID_REGIONS, default: 'Global', title: 'Target Region' },
      service: { type: 'string', enum: VALID_SERVICES, default: 'Multiple', title: 'Service of Interest' },
      scope: { type: 'string', title: 'Project Scope' },
      status: { type: 'string', enum: VALID_STATUSES, default: 'new', title: 'Status' },
    },
    required: ['company', 'contact_name', 'email'],
  });
});

export default router;