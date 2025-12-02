# OOPBuy Spreadsheet - Deployment Guide

## Quick Deployment

```bash
./deploy.sh
```

That's it! The script handles everything automatically.

---

## What the Script Does

### 1. **Local Build** 📦
- Runs `npm run build` locally
- Creates optimized production build
- Faster than building on server

### 2. **Prepare Files** 📋
- Copies necessary files to temp directory
- Excludes unnecessary files:
  - `node_modules` (reinstalled on server)
  - `.git` (not needed in production)
  - Cache files
  - Development files
- Includes `.env` file securely

### 3. **Upload to Server** 📤
- Creates `/var/www/oopbuyproducts.net` directory
- Uploads all files via rsync
- Uses your existing `keyChina.pem` SSH key
- Connects to server: `212.227.74.41`

### 4. **Server Setup** 🔧
- Installs production dependencies
- Finds available port (starts from 3000)
- Creates PM2 configuration
- Starts application with PM2
- Sets up auto-restart on server reboot

---

## Server Requirements

### Installed on Server:
- ✅ Node.js (v18 or higher)
- ✅ npm
- ✅ PM2 (auto-installed if missing)

### If Not Installed:

```bash
# SSH into your server first
ssh -i keyChina.pem root@212.227.74.41

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2
```

---

## Configuration

### Server Details
Edit `deploy.sh` if you need to change:

```bash
SSH_KEY="keyChina.pem"           # Your SSH key
SERVER_IP="212.227.74.41"        # Your server IP
REMOTE_DIR="/var/www/oopbuyproducts.net"  # Deploy directory
APP_NAME="oopbuyproducts"        # PM2 process name
```

### Environment Variables
Make sure your `.env` file is configured with:
```env
MONGODB_URI=mongodb://admin:password@212.227.74.41:27017/myChinaFinds?authSource=admin
NODE_ENV=production
```

---

## PM2 Commands (On Server)

### View Logs
```bash
pm2 logs oopbuyproducts
pm2 logs oopbuyproducts --lines 100
```

### Check Status
```bash
pm2 status
pm2 info oopbuyproducts
```

### Restart Application
```bash
pm2 restart oopbuyproducts
```

### Stop Application
```bash
pm2 stop oopbuyproducts
```

### Monitor Resources
```bash
pm2 monit
```

### View Dashboard
```bash
pm2 plus  # Web dashboard (optional)
```

---

## Nginx Configuration

After deployment, configure Nginx to proxy to your app:

```nginx
server {
    listen 80;
    server_name oopbuyproducts.net www.oopbuyproducts.net;

    location / {
        proxy_pass http://localhost:3000;  # Use the port shown in deployment
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Save to: `/etc/nginx/sites-available/oopbuyproducts.net`

### Enable Site
```bash
ln -s /etc/nginx/sites-available/oopbuyproducts.net /etc/nginx/sites-enabled/
nginx -t  # Test configuration
systemctl reload nginx
```

### Add SSL (Recommended)
```bash
apt-get install certbot python3-certbot-nginx
certbot --nginx -d oopbuyproducts.net -d www.oopbuyproducts.net
```

---

## Troubleshooting

### Port Already in Use
The script automatically finds an available port. Check which port was assigned:
```bash
ssh -i keyChina.pem root@212.227.74.41
pm2 info oopbuyproducts
```

### Application Not Starting
```bash
# SSH into server
ssh -i keyChina.pem root@212.227.74.41

# Check logs
cd /var/www/oopbuyproducts.net
pm2 logs oopbuyproducts

# Check for errors
cat logs/pm2-error.log
```

### MongoDB Connection Issues
```bash
# Test MongoDB connection from server
ssh -i keyChina.pem root@212.227.74.41
mongosh "mongodb://admin:password@212.227.74.41:27017/myChinaFinds?authSource=admin"
```

### Permission Issues
```bash
# Fix ownership
ssh -i keyChina.pem root@212.227.74.41
chown -R root:root /var/www/oopbuyproducts.net
chmod -R 755 /var/www/oopbuyproducts.net
```

---

## Deployment Workflow

### Initial Deployment
```bash
./deploy.sh
```

### Updates/Redeployment
```bash
# Make your code changes locally
git add .
git commit -m "Update"

# Deploy again
./deploy.sh
```

The script will:
- Build fresh code
- Upload only changed files
- Restart the application
- Zero downtime with PM2

---

## File Structure on Server

```
/var/www/oopbuyproducts.net/
├── .next/              # Built Next.js files
├── node_modules/       # Production dependencies
├── app/                # Application code
├── components/         # React components
├── lib/                # Utilities
├── models/             # Database models
├── public/             # Static files
├── .env                # Environment variables
├── ecosystem.config.js # PM2 configuration
├── logs/               # Application logs
│   ├── pm2-error.log
│   ├── pm2-out.log
│   └── pm2-combined.log
├── next.config.mjs
└── package.json
```

---

## Performance Tips

### Monitor Performance
```bash
pm2 monit
```

### Increase Memory Limit (if needed)
Edit on server: `/var/www/oopbuyproducts.net/ecosystem.config.js`
```javascript
max_memory_restart: '2G',  // Change from 1G to 2G
```

Then restart:
```bash
pm2 restart oopbuyproducts
```

### Enable Clustering (Multiple Instances)
```javascript
instances: 'max',  // Uses all CPU cores
```

---

## Security Checklist

- ✅ `.env` file is not in git
- ✅ MongoDB password is URL-encoded
- ✅ SSH key (`keyChina.pem`) permissions are 600
- ✅ Server firewall allows only necessary ports
- ✅ Nginx SSL certificate installed
- ✅ PM2 runs as non-root user (optional)

---

## Support

### Logs Location
- **On Server**: `/var/www/oopbuyproducts.net/logs/`
- **PM2 Logs**: `pm2 logs oopbuyproducts`

### Common Commands
```bash
# View real-time logs
pm2 logs oopbuyproducts --lines 50 --raw

# Restart after config changes
pm2 restart oopbuyproducts

# Update PM2
pm2 update

# Save current PM2 list
pm2 save
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Deploy | `./deploy.sh` |
| View Logs | `ssh -i keyChina.pem root@212.227.74.41 "pm2 logs oopbuyproducts"` |
| Restart | `ssh -i keyChina.pem root@212.227.74.41 "pm2 restart oopbuyproducts"` |
| Status | `ssh -i keyChina.pem root@212.227.74.41 "pm2 status"` |

---

**🎉 Your OOPBuy Spreadsheet is now deployed and running!**
