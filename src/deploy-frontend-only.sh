#!/usr/bin/env bash
set -euo pipefail

# ════════════════════════════════════════════════════════════
#  Iberix Command — Frontend-Only Deploy (no backend, no DB)
#  Run:  bash src/deploy-frontend-only.sh
#  Port: PORT=80 bash src/deploy-frontend-only.sh
#
#  This deploys ONLY the frontend. Form submissions are
#  emailed to you via Web3Forms — no backend needed.
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
echo "║  Iberix — Frontend-Only Deploy             ║"
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

# ─── 2. Create .env for frontend-only mode ─────────────────
if [ ! -f ".env" ]; then
  if [ -f "src/.env.frontend-only.example" ]; then
    cp src/.env.frontend-only.example .env
    echo "→ Created .env from src/.env.frontend-only.example"
  fi
fi

# Warn if the Web3Forms key is not set
if grep -q "YOUR_ACCESS_KEY_HERE" .env 2>/dev/null; then
  echo ""
  echo "⚠  VITE_WEB3FORMS_KEY is not set in .env!"
  echo "   Get your free key at https://web3forms.com"
  echo "   Then edit .env and run this script again."
  echo ""
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

# ─── 6. Start frontend server ───────────────────────────
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
echo "║  ✓ Deployed! (Frontend-only mode)          ║"
echo "║  Live at: http://localhost:$PORT              ║"
echo "║  Logs:   pm2 logs iberix                  ║"
echo "║  Stop:   pm2 stop iberix                  ║"
echo "║  Restart: pm2 restart iberix               ║"
echo "║  Boot:   pm2 startup (run once)           ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "⚠  Make sure VITE_WEB3FORMS_KEY is set in .env"
echo "   or form submissions won't be emailed to you."
echo "   Get a free key at https://web3forms.com"