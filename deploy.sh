#!/bin/bash

# CNFans Spreadsheet - Next.js Deployment Script
# Uploads to /var/www/cnfansportal.com and launches with PM2

set -e  # Exit on error

# Configuration
SSH_KEY="keyChina.pem"
SERVER_IP="212.227.74.41"
REMOTE_DIR="/var/www/cnfansportal.com"
APP_NAME="cnfansportal"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🚀 CNFans Spreadsheet Deployment${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
  echo -e "${RED}Error: SSH key not found at $SSH_KEY${NC}"
  exit 1
fi

# Step 1: Git commit and push
echo -e "${YELLOW}🔄 Step 1: Committing and pushing to Git...${NC}"

# Check if there are changes to commit
if [[ -n $(git status -s) ]]; then
  echo -e "${BLUE}📝 Changes detected, committing...${NC}"
  git add .
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  git commit -m "Deploy: $TIMESTAMP

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
  echo -e "${BLUE}📤 Pushing to remote...${NC}"
  git push
  echo -e "${GREEN}✅ Git push complete${NC}"
else
  echo -e "${BLUE}ℹ️  No changes to commit${NC}"
fi

# Step 2: Build project locally
echo -e "${YELLOW}📦 Step 2: Building project locally...${NC}"
npm run build
echo -e "${GREEN}✅ Build complete${NC}"

# Step 3: Prepare deployment files
echo -e "${YELLOW}📋 Step 3: Preparing deployment files...${NC}"

# Create temporary directory for deployment
TEMP_DIR=$(mktemp -d)
echo "Created temp directory: $TEMP_DIR"

# Copy necessary files
rsync -av --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.next/cache' \
  --exclude '.env.local' \
  --exclude 'keyChina.pem' \
  --exclude 'README.md' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  --exclude 'deploy.sh' \
  ./ $TEMP_DIR/

# Copy .env file
if [ -f ".env" ]; then
  echo -e "${BLUE}📄 Copying .env file...${NC}"
  cp .env $TEMP_DIR/.env
fi

echo -e "${GREEN}✅ Files prepared${NC}"

# Step 4: Upload to server
echo -e "${YELLOW}📤 Step 4: Uploading to server...${NC}"

# Create remote directory if it doesn't exist
ssh -i "$SSH_KEY" root@"$SERVER_IP" "mkdir -p $REMOTE_DIR"

# Upload files
rsync -avz --progress -e "ssh -i $SSH_KEY" \
  --delete \
  $TEMP_DIR/ root@"$SERVER_IP":"$REMOTE_DIR"/

# Clean up temp directory
rm -rf $TEMP_DIR

echo -e "${GREEN}✅ Upload complete${NC}"

# Step 5: Setup and run on server
echo -e "${YELLOW}🔧 Step 5: Setting up on server...${NC}"

ssh -t -i "$SSH_KEY" root@"$SERVER_IP" <<'ENDSSH'
set -e

# Colors for SSH session
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

cd /var/www/cnfansportal.com

echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install --production

# Set fixed port
echo -e "${BLUE}🔧 Using fixed port: 3001${NC}"
PORT=3017
echo -e "${GREEN}✅ Port configured: $PORT${NC}"

# Create PM2 ecosystem file
echo -e "${BLUE}📝 Creating PM2 configuration...${NC}"
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'cnfansportal',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p $PORT',
    cwd: '/var/www/cnfansportal.com',
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

# Create logs directory
mkdir -p logs

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
  echo -e "${YELLOW}📥 Installing PM2...${NC}"
  npm install -g pm2
fi

# Stop and delete existing process
echo -e "${BLUE}🛑 Stopping existing process...${NC}"
pm2 stop cnfansportal 2>/dev/null || echo "No existing process to stop"
pm2 delete cnfansportal 2>/dev/null || echo "No existing process to delete"

# Start with PM2
echo -e "${BLUE}🚀 Starting application with PM2...${NC}"
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup (if not already done)
echo -e "${BLUE}⚙️  Configuring PM2 startup...${NC}"
pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ DEPLOYMENT SUCCESSFUL!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Show application info
pm2 info cnfansportal

echo ""
echo -e "${BLUE}📊 Application Status:${NC}"
pm2 status

echo ""
echo -e "${GREEN}🌐 Your application is running on port: $PORT${NC}"
echo -e "${YELLOW}📝 Configure your Nginx/Apache to proxy to this port${NC}"
echo ""
echo -e "${BLUE}Useful PM2 Commands:${NC}"
echo "  pm2 logs cnfansportal      - View live logs"
echo "  pm2 restart cnfansportal   - Restart application"
echo "  pm2 stop cnfansportal      - Stop application"
echo "  pm2 status                    - Check status"
echo "  pm2 monit                     - Monitor resources"
echo ""

ENDSSH

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"

# Pause before closing
read -p "Press [Enter] to close..."
