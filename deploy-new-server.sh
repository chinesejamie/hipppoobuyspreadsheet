#!/bin/bash
# ========================================
# HipoBuy Spreadsheet - Complete Deployment Script
# New Server: 217.154.115.9
# Domain: hipobuyspreadsheet.com
# ========================================

set -e  # Exit on error

# --------------------------
# Configuration
# --------------------------
SSH_KEY="/Users/jamie/Desktop/All Websites/RootKey"
SERVER_IP="217.154.115.9"
DOMAIN="hipobuyspreadsheet.com"
REMOTE_DIR="/var/www/hipobuyspreadsheet.com"
APP_NAME="hipobuyspreadsheet"
PORT=3028

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🚀 HipoBuy Spreadsheet Deployment${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${CYAN}Server: ${SERVER_IP}${NC}"
echo -e "${CYAN}Domain: ${DOMAIN}${NC}"
echo -e "${CYAN}Port: ${PORT}${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# --------------------------
# Validate SSH Key
# --------------------------
echo -e "${YELLOW}🔑 Step 1: Validating SSH key...${NC}"
if [ ! -f "$SSH_KEY" ]; then
  echo -e "${RED}Error: SSH key not found at $SSH_KEY${NC}"
  exit 1
fi

# Test SSH connection
if ! ssh -i "$SSH_KEY" -o ConnectTimeout=5 -o BatchMode=yes root@"$SERVER_IP" echo "SSH OK" >/dev/null 2>&1; then
  echo -e "${RED}Error: Cannot connect to server via SSH${NC}"
  echo -e "${YELLOW}Make sure:${NC}"
  echo -e "  1. Server IP is correct: ${SERVER_IP}"
  echo -e "  2. SSH key has correct permissions: chmod 600 ${SSH_KEY}"
  echo -e "  3. Public key is added to server's authorized_keys"
  exit 1
fi

echo -e "${GREEN}✅ SSH connection verified${NC}"
echo ""

# --------------------------
# Step 2: Build locally
# --------------------------
echo -e "${YELLOW}📦 Step 2: Building project locally...${NC}"
npm run build
echo -e "${GREEN}✅ Build complete${NC}"
echo ""

# --------------------------
# Step 3: Prepare deployment files
# --------------------------
echo -e "${YELLOW}📋 Step 3: Preparing files for upload...${NC}"
TEMP_DIR=$(mktemp -d)
echo -e "${BLUE}Temp directory: $TEMP_DIR${NC}"

rsync -av --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.next/cache' \
  --exclude '.env.local' \
  --exclude '*.pem' \
  --exclude 'README.md' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  --exclude 'deploy*.sh' \
  --exclude 'kRoot*' \
  --exclude '*.key' \
  --exclude 'RootKey*' \
  --exclude 'SECURITY-*.md' \
  --exclude 'CLEANUP-*.md' \
  ./ "$TEMP_DIR"/

# Copy .env if exists
if [ -f ".env" ]; then
  cp .env "$TEMP_DIR"/.env
  echo -e "${GREEN}✅ Environment file copied${NC}"
else
  echo -e "${YELLOW}⚠️  No .env file found - you'll need to create one on the server${NC}"
fi

echo -e "${GREEN}✅ Files prepared${NC}"
echo ""

# --------------------------
# Step 4: Upload to server
# --------------------------
echo -e "${YELLOW}📤 Step 4: Uploading to server...${NC}"
ssh -i "$SSH_KEY" root@"$SERVER_IP" "mkdir -p $REMOTE_DIR"

rsync -avz --progress -e "ssh -i \"$SSH_KEY\"" \
  --delete \
  --exclude=.env \
  --exclude=logs \
  --exclude=node_modules \
  "$TEMP_DIR"/ root@"$SERVER_IP":"$REMOTE_DIR"/

rm -rf "$TEMP_DIR"
echo -e "${GREEN}✅ Upload complete${NC}"
echo ""

# --------------------------
# Step 5: Setup & run on server
# --------------------------
echo -e "${YELLOW}🔧 Step 5: Setting up server environment...${NC}"

ssh -t -i "$SSH_KEY" root@"$SERVER_IP" bash <<ENDSSH
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

REMOTE_DIR="$REMOTE_DIR"
APP_NAME="$APP_NAME"
PORT=$PORT
DOMAIN="$DOMAIN"

echo -e "\${GREEN}========================================\${NC}"
echo -e "\${GREEN}🖥️  Server Setup\${NC}"
echo -e "\${GREEN}========================================\${NC}"

# --------------------------
# Install System Dependencies
# --------------------------
echo -e "\${YELLOW}📦 Installing system dependencies...\${NC}"
apt update
apt install -y curl git nginx certbot python3-certbot-nginx

# --------------------------
# Install NVM & Node.js
# --------------------------
echo -e "\${YELLOW}📦 Setting up Node.js...\${NC}"
export NVM_DIR="\$HOME/.nvm"

if [ ! -d "\$NVM_DIR" ]; then
    echo -e "\${BLUE}Installing NVM...\${NC}"
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
fi

# Load NVM
[ -s "\$NVM_DIR/nvm.sh" ] && source "\$NVM_DIR/nvm.sh"

# Install Node.js LTS
if ! command -v node &> /dev/null; then
    echo -e "\${BLUE}Installing Node.js LTS...\${NC}"
    nvm install --lts
    nvm use --lts
else
    echo -e "\${GREEN}✅ Node.js already installed: \$(node --version)\${NC}"
fi

# Make NVM available for future sessions
echo 'export NVM_DIR="\$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "\$NVM_DIR/nvm.sh" ] && source "\$NVM_DIR/nvm.sh"' >> ~/.bashrc

# --------------------------
# Install PM2
# --------------------------
if ! command -v pm2 &> /dev/null; then
    echo -e "\${BLUE}Installing PM2...\${NC}"
    npm install -g pm2
    echo -e "\${GREEN}✅ PM2 installed\${NC}"
else
    echo -e "\${GREEN}✅ PM2 already installed\${NC}"
fi

# --------------------------
# Install Production Dependencies
# --------------------------
cd "\$REMOTE_DIR"
echo -e "\${BLUE}📦 Installing production dependencies...\${NC}"
npm install --production
echo -e "\${GREEN}✅ Dependencies installed\${NC}"

# --------------------------
# Create PM2 Ecosystem Config
# --------------------------
echo -e "\${BLUE}📝 Creating PM2 configuration...\${NC}"
mkdir -p logs

cat > ecosystem.config.js << 'EOF'
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

echo -e "\${GREEN}✅ PM2 config created\${NC}"

# --------------------------
# Configure Nginx
# --------------------------
echo -e "\${BLUE}🌐 Configuring Nginx...\${NC}"

cat > /etc/nginx/sites-available/\$DOMAIN << 'NGINXEOF'
# HTTP server - certbot will add HTTPS configuration
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    # Allow Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Next.js static files
    location /_next/static {
        proxy_pass http://localhost:$PORT;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }

    # Public static files
    location /static {
        proxy_pass http://localhost:$PORT;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=3600";
    }

    # Logs
    access_log /var/log/nginx/$DOMAIN.access.log;
    error_log /var/log/nginx/$DOMAIN.error.log;
}
NGINXEOF

# Enable site
ln -sf /etc/nginx/sites-available/\$DOMAIN /etc/nginx/sites-enabled/\$DOMAIN

# Remove default site if exists
rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
echo -e "\${BLUE}Testing Nginx configuration...\${NC}"
nginx -t

# Reload Nginx
systemctl reload nginx
echo -e "\${GREEN}✅ Nginx configured and reloaded\${NC}"

# --------------------------
# Start Application with PM2
# --------------------------
echo -e "\${BLUE}🚀 Starting application...\${NC}"

# Stop old instance if exists
pm2 stop "\$APP_NAME" 2>/dev/null || true
pm2 delete "\$APP_NAME" 2>/dev/null || true

# Start new instance
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 startup script
pm2 startup systemd -u root --hp /root

echo -e "\${GREEN}✅ Application started with PM2\${NC}"

# --------------------------
# SSL Certificate Setup
# --------------------------
echo -e "\${YELLOW}🔒 Setting up SSL certificate...\${NC}"
echo -e "\${CYAN}Attempting to obtain SSL certificate from Let's Encrypt...\${NC}"

# Check if certificate already exists
if [ -d "/etc/letsencrypt/live/\$DOMAIN" ]; then
    echo -e "\${GREEN}✅ SSL certificate already exists\${NC}"
else
    # Obtain certificate
    certbot --nginx -d \$DOMAIN -d www.\$DOMAIN --non-interactive --agree-tos --email admin@\$DOMAIN || {
        echo -e "\${YELLOW}⚠️  Could not obtain SSL certificate automatically\${NC}"
        echo -e "\${YELLOW}You can run this manually later:\${NC}"
        echo -e "\${CYAN}certbot --nginx -d \$DOMAIN -d www.\$DOMAIN\${NC}"
    }
fi

# Setup auto-renewal
systemctl enable certbot.timer 2>/dev/null || true

# --------------------------
# Final Status
# --------------------------
echo -e "\${GREEN}========================================\${NC}"
echo -e "\${GREEN}✅ Deployment Complete!\${NC}"
echo -e "\${GREEN}========================================\${NC}"
echo ""
echo -e "\${CYAN}Application Status:\${NC}"
pm2 status "\$APP_NAME"
echo ""
echo -e "\${CYAN}Server Information:\${NC}"
echo -e "  Domain: https://\$DOMAIN"
echo -e "  Port: \$PORT"
echo -e "  Directory: \$REMOTE_DIR"
echo -e "  Node.js: \$(node --version)"
echo -e "  PM2: \$(pm2 --version)"
echo ""
echo -e "\${CYAN}Useful Commands:\${NC}"
echo -e "  View logs: pm2 logs \$APP_NAME"
echo -e "  Restart app: pm2 restart \$APP_NAME"
echo -e "  Stop app: pm2 stop \$APP_NAME"
echo -e "  PM2 status: pm2 status"
echo -e "  Nginx status: systemctl status nginx"
echo -e "  Nginx logs: tail -f /var/log/nginx/\$DOMAIN.error.log"
echo ""
echo -e "\${YELLOW}⚠️  Don't forget to:\${NC}"
echo -e "  1. Point your domain DNS to this server IP: $SERVER_IP"
echo -e "  2. Create/update .env file with production values"
echo -e "  3. Test the application: https://\$DOMAIN"
echo -e "  4. Setup MongoDB with proper security (localhost only, authentication)"
echo -e "  5. Configure firewall: ufw allow 80/tcp && ufw allow 443/tcp && ufw allow 22/tcp"
echo ""
echo -e "\${GREEN}========================================\${NC}"

ENDSSH

# --------------------------
# Local completion message
# --------------------------
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Deployment Script Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${CYAN}Your application has been deployed to:${NC}"
echo -e "  ${YELLOW}http://${SERVER_IP}:${PORT}${NC} (direct access)"
echo -e "  ${YELLOW}https://${DOMAIN}${NC} (after DNS propagation)"
echo ""
echo -e "${CYAN}Next Steps:${NC}"
echo -e "  ${BLUE}1.${NC} Point your domain DNS A record to: ${YELLOW}${SERVER_IP}${NC}"
echo -e "  ${BLUE}2.${NC} Wait for DNS propagation (5-30 minutes)"
echo -e "  ${BLUE}3.${NC} Test your site: ${YELLOW}https://${DOMAIN}${NC}"
echo -e "  ${BLUE}4.${NC} Check PM2 logs: ${YELLOW}ssh -i ${SSH_KEY} root@${SERVER_IP} 'pm2 logs ${APP_NAME}'${NC}"
echo ""
echo -e "${YELLOW}⚠️  Important Security Tasks:${NC}"
echo -e "  ${BLUE}•${NC} Setup firewall: ${CYAN}ssh -i ${SSH_KEY} root@${SERVER_IP} 'ufw enable && ufw allow 22,80,443/tcp'${NC}"
echo -e "  ${BLUE}•${NC} Configure MongoDB security (bind to localhost, enable auth)"
echo -e "  ${BLUE}•${NC} Review .env file on server"
echo -e "  ${BLUE}•${NC} Setup automated backups"
echo ""
echo -e "${GREEN}Press [Enter] to finish...${NC}"
read
