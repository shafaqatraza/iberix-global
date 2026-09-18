#!/usr/bin/env bash
set -euo pipefail

# ════════════════════════════════════════════════════════════
#  Iberix Command — One-command Linux Deploy
#  Run:  bash src/deploy.sh
#  Port: PORT=80 bash src/deploy.sh
# ════════════════════════════════════════════════════════════

# Find project root (nearest package.json)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"
while [ "$PROJECT_DIR" != "/" ] && [ ! -f "$PROJECT_DIR/package.json" ]; do
  PROJECT_DIR="$(dirname "$PROJECT_DIR")"
done
[ ! -f "$PROJECT_DIR/package.json" ] && PROJECT_DIR="$SCRIPT_DIR"
cd "$PROJECT_DIR"

PORT="${PORT:-3000}"

echo "╔════════════════════════════════════════════╗"
echo "║  Iberix Command — Auto Deploy               ║"
echo "╚════════════════════════════════════════════╝"

# ─── 1. Install Node.js 18+ if missing ─────────────────────
if ! command -v node &>/dev/null; then
  echo "→ Installing Node.js 18..."
  if command -v apt-get &>/dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
  elif command -v yum &>/dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs
  else
    echo "✗ No apt/yum. Install Node.js 18+ manually: https://nodejs.org"
    exit 1
  fi
fi

NODE_VER=$(node -v | grep -oP '\d+' | head -1)
if [ "$NODE_VER" -lt 18 ]; then
  echo "✗ Node.js $(node -v) found, need 18+. Upgrade and re-run."
  exit 1
fi
echo "✓ Node.js $(node -v)"

# ─── 2. Create .env from example if missing ───────────────
if [ ! -f ".env" ]; then
  for f in "src/.env.example" ".env.example"; do
    if [ -f "$f" ]; then
      cp "$f" ".env"
      echo "→ Created .env from $f (edit to configure)"
      break
    fi
  done
fi

# ─── 3. Install dependencies ──────────────────────────────
echo "→ Installing dependencies..."
npm install

# ─── 4. Build ─────────────────────────────────────────────
echo "→ Building..."
npm run build

# ─── 5. Install PM2 if missing ───────────────────────────
if ! command -v pm2 &>/dev/null; then
  echo "→ Installing PM2..."
  sudo npm install -g pm2 2>/dev/null || npm install -g pm2
fi

# ─── 6. Start backend (if bundled) ───────────────────────
BACKEND_DIR="src/iberix-backend"
if [ -f "$BACKEND_DIR/package.json" ]; then
  echo "→ Setting up backend..."
  cd "$BACKEND_DIR"
  npm install
  if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "→ Created backend .env from .env.example (edit to configure)"
  fi
  pm2 delete iberix-backend 2>/dev/null || true
  pm2 start src/index.js --name iberix-backend
  pm2 save 2>/dev/null || true
  cd "$PROJECT_DIR"
fi

# ─── 7. Start frontend server ───────────────────────────
echo "→ Starting frontend on port $PORT..."
pm2 delete iberix 2>/dev/null || true
pm2 start src/server.mjs --name iberix -- --port "$PORT"
pm2 save 2>/dev/null || true

# ─── 7. Open firewall if root ─────────────────────────────
if [ "$(id -u)" -eq 0 ]; then
  if command -v ufw &>/dev/null; then
    ufw allow "$PORT/tcp" 2>/dev/null || true
  elif command -v firewall-cmd &>/dev/null; then
    firewall-cmd --permanent --add-port="$PORT/tcp" 2>/dev/null || true
    firewall-cmd --reload 2>/dev/null || true
  fi
fi

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  ✓ Deployed!                                 ║"
echo "║  Frontend: http://localhost:$PORT              ║"
if [ -f "src/iberix-backend/package.json" ]; then
echo "║  Backend:  http://localhost:3001/api           ║"
echo "║  Backend logs: pm2 logs iberix-backend       ║"
fi
echo "║  Logs:    pm2 logs iberix                   ║"
echo "║  Stop:    pm2 stop iberix                   ║"
echo "║  Restart: pm2 restart iberix                ║"
echo "║  Boot:    pm2 startup (run once)            ║"
echo "╚════════════════════════════════════════════╝"