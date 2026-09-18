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

## Variables You Can Change

Everything is controlled by one file: `.env`. The deploy script creates it automatically from `.env.example`. Edit it and redeploy to change behavior.

| Variable | What it does | Options |
|---|---|---|
| `VITE_HOSTING_MODE` | Where the backend lives | `base44` (default, uses managed platform) or `independent` (your own API) |
| `VITE_API_URL` | Your backend URL | Only needed if `VITE_HOSTING_MODE=independent` |
| `ADMIN_USERNAME` | Ops Console login username | Any string |
| `ADMIN_PASSWORD` | Ops Console login password | Any string |
| `ADMIN_OTP_EMAIL` | Where OTP codes are sent | Any email address |

**To change a variable:** edit `.env`, then run `bash src/deploy.sh` again.

---

## Ops Console (Admin Dashboard)

A secret admin page to view partnership leads. No coding required.

1. Go to `http://your-domain/ops-console`
2. Enter the username and password you set in `.env`
3. A 6-digit code is emailed to the address you set in `.env`
4. Enter the code to see your leads

**Note on email:** If your OTP email is not a registered app user, either invite it as one (App Users → Invite in the dashboard) or use `info@iberix.global` as the OTP email.

---

## After Deploy — Useful Commands

| Command | What it does |
|---|---|
| `pm2 logs iberix` | See live logs |
| `pm2 restart iberix` | Restart the app (after editing `.env` or updating code) |
| `pm2 stop iberix` | Stop the app |
| `pm2 startup` | Make the app auto-start when the server reboots (run once) |

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