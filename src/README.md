# Iberix Command

A high-precision operations platform for managing global technical infrastructure deployments, data center projects, and specialized engineering workforce resources.

---

## Deploy in 3 Steps

You don't need to know how to code. Just copy, paste, and run.

### Step 1 — Get the code on your server

```bash
git clone <your-repo-url>
cd iberix-global
```

### Step 2 — Run the deploy script

```bash
bash src/deploy.sh
```

That's it. The script installs Node.js, builds the app, and starts it on port 3000. When it finishes, your app is live at `http://your-server-ip:3000`.

### Step 3 (optional) — Use port 80 instead

If you want the app on the standard web port (no `:3000` in the URL), run as root:

```bash
PORT=80 bash src/deploy.sh
```

---

## Backend (Independent Mode)

The backend lives in `src/iberix-backend/`. The deploy script starts it automatically on port 3001 alongside the frontend. The frontend talks to it at `VITE_API_URL` (default `http://localhost:3001/api`).

The backend has its own `.env` at `src/iberix-backend/.env` (auto-created from `.env.example`). Edit it to set the admin credentials, JWT secret, and email settings. See `src/iberix-backend/README.md` for the full guide.

**Email without SMTP:** If you leave the SMTP settings blank in the backend `.env`, all verification codes and OTP codes print to the terminal. Run `pm2 logs iberix-backend` to see them.

---

## Frontend-Only Mode (No Backend)

If you don't want a backend, database, or admin panel — just a website where the contact form emails you directly — use the frontend-only deploy.

### Step 1 — Get a free email key

Go to [web3forms.com](https://web3forms.com), enter your email, and copy the access key they give you. Form submissions will be sent to that email.

### Step 2 — Deploy

```bash
bash src/deploy-frontend-only.sh
```

The script creates `.env` from `src/.env.frontend-only.example`. Edit `.env` and paste your Web3Forms key:

```
VITE_FRONTEND_ONLY=true
VITE_WEB3FORMS_KEY=your-key-here
```

Then redeploy:

```bash
bash src/deploy-frontend-only.sh
```

That's it. No backend, no database. When someone fills out the partnership form, you get an email instantly.

**Note:** The Ops Console (admin dashboard) is not available in this mode.

---

## Variables You Can Change

Everything is controlled by one file: `.env`. The deploy script creates it automatically from `.env.example`. Edit it and redeploy to change behavior.

| Variable | What it does | Options |
|---|---|---|
| `VITE_API_URL` | Your backend URL | Default: `http://localhost:3001/api` |
| `ADMIN_USERNAME` | Ops Console login username | Any string |
| `ADMIN_PASSWORD` | Ops Console login password | Any string |
| `ADMIN_OTP_EMAIL` | Where OTP codes are sent | Any email address |
| `VITE_FRONTEND_ONLY` | Enable frontend-only mode (no backend) | `true` to enable, leave blank for full mode |
| `VITE_WEB3FORMS_KEY` | Web3Forms key for frontend-only mode | Get free key at web3forms.com |

**To change a variable:** edit `.env`, then run `bash src/deploy.sh` again.

---

## Ops Console (Admin Dashboard)

A secret admin page to view partnership leads. No coding required.

1. Go to `http://your-domain/ops-console`
2. Enter the username and password you set in `.env`
3. A 6-digit code is emailed to the address you set in `.env`
4. Enter the code to see your leads

**Note on email:** OTP codes are sent via the backend's email settings. If SMTP is not configured in the backend `.env`, codes print to the terminal. Run `pm2 logs iberix-backend` to see them.

---

## After Deploy — Useful Commands

| Command | What it does |
|---|---|
| `pm2 logs iberix` | See live frontend logs |
| `pm2 logs iberix-backend` | See live backend logs (shows OTP codes if SMTP not configured) |
| `pm2 restart iberix` | Restart the frontend (after editing `.env` or updating code) |
| `pm2 restart iberix-backend` | Restart the backend (after editing backend `.env`) |
| `pm2 stop iberix` | Stop the frontend |
| `pm2 startup` | Make both apps auto-start when the server reboots (run once) |

---

## Using Your Own Domain

If you want `your-domain.com` instead of `your-server-ip:3000`, put nginx in front. Create a file at `/etc/nginx/sites-available/iberix`:

```
server {
    listen 80;
    server_name your-domain.com;
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

Then:

```bash
sudo ln -s /etc/nginx/sites-available/iberix /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## Requirements

- A Linux server (Ubuntu, Debian, or CentOS)
- `curl` installed (comes with most Linux distributions)
- `sudo` access (for installing Node.js and PM2)

That's all. The deploy script handles everything else.

---

## License

Proprietary. Iberix Global Ltd. (Companies House UK, No. SC902201)