#!/bin/bash
# CNFans Spreadsheet - Robust Next.js Deployment Script
# Uploads project to server and starts with PM2

set -e  # Exit on error

# --------------------------
# Configuration
# --------------------------
SSH_KEY="kRoot"
SERVER_IP="212.227.74.41"
REMOTE_DIR="/var/www/cnfansportal.com"
APP_NAME="cnfansportal"
PORT=3017

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🚀 CNFans Spreadsheet Deployment${NC}"
echo -e "${GREEN}========================================${NC}"

# --------------------------
# Check SSH key
# --------------------------
if [ ! -f "$SSH_KEY" ]; then
  echo -e "${RED}Error: SSH key not found at $SSH_KEY${NC}"
  exit 1
fi

# --------------------------
# Step 1: Git commit & push
# --------------------------
echo -e "${YELLOW}🔄 Step 1: Git commit & push${NC}"
if [[ -n $(git status -s) ]]; then
  echo -e "${BLUE}📝 Changes detected, committing...${NC}"
  git add .
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  git commit -m "Deploy: $TIMESTAMP"
  git push
  echo -e "${GREEN}✅ Git push complete${NC}"
else
  echo -e "${BLUE}ℹ️  No changes to commit${NC}"
fi

# --------------------------
# Step 2: Build locally
# --------------------------
echo -e "${YELLOW}📦 Step 2: Building project locally...${NC}"
npm run build
echo -e "${GREEN}✅ Build complete${NC}"

# --------------------------
# Step 3: Prepare deployment files
# --------------------------
echo -e "${YELLOW}📋 Step 3: Preparing files for upload...${NC}"
TEMP_DIR=$(mktemp -d)
echo "Temp directory: $TEMP_DIR"

rsync -av --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.next/cache' \
  --exclude '.env.local' \
  --exclude '*.pem' \
  --exclude 'README.md' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  --exclude 'deploy.sh' \
  ./ "$TEMP_DIR"/

# Copy .env
if [ -f ".env" ]; then
  cp .env "$TEMP_DIR"/.env
fi

echo -e "${GREEN}✅ Files prepared${NC}"

# --------------------------
# Step 4: Upload to server
# --------------------------
echo -e "${YELLOW}📤 Step 4: Uploading to server...${NC}"
ssh -i "$SSH_KEY" root@"$SERVER_IP" "mkdir -p $REMOTE_DIR"

rsync -avz --progress -e "ssh -i $SSH_KEY" \
  --delete \
  "$TEMP_DIR"/ root@"$SERVER_IP":"$REMOTE_DIR"/

rm -rf "$TEMP_DIR"
echo -e "${GREEN}✅ Upload complete${NC}"

# --------------------------
# Step 5: Setup & run on server
# --------------------------
echo -e "${YELLOW}🔧 Step 5: Setting up server...${NC}"

ssh -t -i "$SSH_KEY" root@"$SERVER_IP" bash <<'ENDSSH'
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

REMOTE_DIR="/var/www/cnfansportal.com"
APP_NAME="cnfansportal"
PORT=3017

echo -e "${BLUE}📦 Loading NVM & Node.js...${NC}"
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    source "$NVM_DIR/nvm.sh"
else
    echo -e "${RED}NVM not found! Installing...${NC}"
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash
    source "$NVM_DIR/nvm.sh"
fi

# Ensure Node LTS installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}📥 Installing latest Node LTS via NVM...${NC}"
    nvm install --lts
fi

cd "$REMOTE_DIR"

# --------------------------
# Install PM2
# --------------------------
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📥 Installing PM2 globally...${NC}"
    npm install -g pm2
fi

# --------------------------
# Install production deps
# --------------------------
echo -e "${BLUE}📦 Installing production dependencies...${NC}"
npm install --production

# --------------------------
# PM2 Setup
# --------------------------
mkdir -p logs
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p $PORT',
    cwd: '$REMOTE_DIR',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: $PORT
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true
  }]
};
EOF

# Stop old app
pm2 stop "$APP_NAME" 2>/dev/null || true
pm2 delete "$APP_NAME" 2>/dev/null || true

# Start new app
echo -e "${BLUE}🚀 Starting application with PM2...${NC}"
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo -e "${GREEN}✅ Deployment complete!${NC}"
pm2 status "$APP_NAME"

ENDSSH

echo -e "${GREEN}🎉 Deployment script finished${NC}"
read -p "Press [Enter] to close..."
