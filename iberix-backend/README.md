# Iberix Backend

Plug-and-play backend for the Iberix Global platform. Handles auth, leads, the Ops Console, and file uploads. Uses SQLite (no database server to install) and runs with one command.

---

## Quick Start

```bash
npm install
cp .env.example .env
npm start
```

The server runs on `http://localhost:3001`. The API is at `http://localhost:3001/api`.

That's it. No database setup, no Docker, no external services.

---

## Connecting the Frontend

In the frontend project (iberix-global), edit `.env`:

```
VITE_HOSTING_MODE=independent
VITE_API_URL=http://localhost:3001/api
```

Rebuild the frontend. Every API call now routes to this backend.

---

## Configuration

Edit `.env` (copied from `.env.example`). Restart after changing.

| Variable | What it does |
|---|---|
| `PORT` | Server port (default 3001) |
| `JWT_SECRET` | Secret for signing auth tokens. Change to a long random string. |
| `ADMIN_USERNAME` | Ops Console login username |
| `ADMIN_PASSWORD` | Ops Console login password |
| `ADMIN_OTP_EMAIL` | Email address where Ops Console access codes are sent |
| `SMTP_HOST` | Email server host. Leave blank to print emails to console instead. |
| `SMTP_PORT` | Email server port (default 587) |
| `SMTP_USER` | Email server username |
| `SMTP_PASS` | Email server password |
| `FROM_EMAIL` | Sender email address |
| `UPLOAD_DIR` | Where uploaded files are stored (default ./uploads) |
| `DB_PATH` | Where the SQLite database file is stored (default ./data/iberix.db) |

---

## Email

If `SMTP_HOST` is blank, all emails (verification codes, OTP codes, password resets) print to the console instead of being sent. This lets you test everything without an email provider.

For production, fill in the SMTP settings with your email provider (Gmail, SendGrid, Resend, etc.).

---

## Database

SQLite. The database file is created automatically at `data/iberix.db` on first run. No setup, no migrations, no database server. If you delete the file, it recreates fresh.

---

## What This Backend Provides

| Feature | Endpoints |
|---|---|
| User registration + email verification | `POST /api/auth/register`, `POST /api/auth/verify-otp`, `POST /api/auth/resend-otp` |
| Login | `POST /api/auth/login` |
| Current user | `GET /api/auth/me`, `PATCH /api/auth/me` |
| Password reset | `POST /api/auth/reset-request`, `POST /api/auth/reset` |
| Leads (partnership inquiries) | `POST /api/leads`, `GET /api/leads`, `GET /api/leads/:id`, `PATCH /api/leads/:id`, `DELETE /api/leads/:id` |
| Ops Console (admin) | `POST /api/functions/AdminConsole` (login, verify, leads, logout) |
| File uploads | `POST /api/upload`, `POST /api/upload-private` |
| User management | `GET /api/users`, `GET /api/users/:id`, `POST /api/users/invite` |
| App settings | `GET /api/app/settings` |
| Health check | `GET /api/health` |

---

## Deploy to a VPS

```bash
git clone <your-repo-url>
cd iberix-backend
npm install
cp .env.example .env
# Edit .env with your production values
npm start
```

To run it permanently with PM2:

```bash
npm install -g pm2
pm2 start src/index.js --name iberix-backend
pm2 startup
pm2 save
```

---

## License

Proprietary. Iberix Global Ltd. (Companies House UK, No. SC902201)