# Deploy Chkobba to Render.com

Complete guide to deploy your Chkobba game to Render.com for free.

## Prerequisites

- GitHub account
- Render.com account (free tier available)
- This repository

## Method 1: Blueprint (Recommended - Fastest)

### Step 1: Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/chkobba-game.git
git push -u origin main
```

### Step 2: Deploy with Blueprint

1. Go to [render.com](https://render.com)
2. Sign up / Log in
3. Click "Dashboard" in top-right
4. Click "New +" → "Blueprint"
5. Select "Public GitHub Repository"
6. Paste: `https://github.com/YOUR_USERNAME/chkobba-game`
7. Click "Connect"
8. Render automatically reads `render.yaml` and deploys both services

### Step 3: Verify Deployment

Wait 5-10 minutes for deployment to complete.

Check both services in Render Dashboard:
- `chkobba-api` - Backend (running on port 3001)
- `chkobba-web` - Frontend (running on port 3000)

Click the frontend URL to play!

---

## Method 2: Manual Setup (If Blueprint Doesn't Work)

### Step 1: Push Code to GitHub

```bash
git push origin main
```

### Step 2: Create Backend Service

1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click "New +" → "Web Service"
3. Select your GitHub repository
4. Fill in details:
   - **Name**: `chkobba-api`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (available)
5. Click "Advanced"
6. Add Environment Variables:
   ```
   NODE_ENV = production
   PORT = 3001
   JWT_SECRET = (Let Render generate)
   CORS_ORIGIN = (You'll update this later)
   ```
7. Click "Create Web Service"
8. Wait 10-15 minutes for deployment

### Step 3: Get Backend URL

1. Go to Render Dashboard
2. Click on `chkobba-api` service
3. Copy the URL (e.g., `https://chkobba-api.onrender.com`)

### Step 4: Create Frontend Service

1. Click "New +" → "Web Service"
2. Select your GitHub repository (again)
3. Fill in details:
   - **Name**: `chkobba-web`
   - **Environment**: `Node`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm start`
   - **Plan**: Free
4. Click "Advanced"
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL = https://chkobba-api.onrender.com
   NEXT_PUBLIC_WS_URL = https://chkobba-api.onrender.com
   NODE_ENV = production
   ```
6. Click "Create Web Service"
7. Wait 10-15 minutes for deployment

### Step 5: Get Frontend URL

1. Go to Render Dashboard
2. Click on `chkobba-web` service
3. Copy the URL (e.g., `https://chkobba-web.onrender.com`)

### Step 6: Update Backend CORS

1. Go to `chkobba-api` service settings
2. Click "Environment"
3. Update `CORS_ORIGIN` to: `https://chkobba-web.onrender.com`
4. Render automatically redeploys
5. Wait 2-3 minutes

### Step 7: Test

Visit your frontend URL and play!

---

## Deploy Updates

### After Making Changes Locally

```bash
git add .
git commit -m "Your changes"
git push origin main
```

**Render automatically redeploys** when you push to GitHub!

### Manual Redeploy

1. Go to Render Dashboard
2. Select the service
3. Click "Manual Deploy" → "Latest Commit"

---

## Free Tier Limits

Render's free tier includes:
- ✅ 750 hours/month (free tier services spin down after 15 mins of inactivity)
- ✅ 100GB outbound data/month
- ✅ Automatic HTTPS
- ✅ GitHub integration
- ✅ Custom domains (with paid plan)

For production:
- Upgrade to **Pro** ($7/month) to keep services always running
- Or use **Starter** ($12-20/month) for better performance

---

## Troubleshooting

### Build Failed

1. Check Logs in Render Dashboard
2. Common issues:
   - Missing `package.json` in subdirectories
   - Wrong build commands
   - TypeScript compilation errors

**Fix**: Review the build command matches your folder structure

### Services Won't Connect

1. Verify `NEXT_PUBLIC_API_URL` is set to backend URL
2. Verify `CORS_ORIGIN` is set to frontend URL
3. Check both services are running (green status)

**Fix**: Update environment variables and redeploy

### Slow Performance

On free tier:
- Services spin down after 15 minutes of inactivity
- First request takes longer to start

**Solution**: Upgrade to paid tier for always-on services

### WebSocket Connection Issues

1. Ensure backend WebSocket is enabled (included in server.ts)
2. Verify `NEXT_PUBLIC_WS_URL` is set correctly
3. Check CORS settings

**Fix**: Verify environment variables are correct

---

## Production Checklist

- [ ] Changed JWT_SECRET to strong random string
- [ ] Set CORS_ORIGIN to correct domain
- [ ] Verified NEXT_PUBLIC_API_URL is correct
- [ ] Tested login and gameplay
- [ ] Checked logs for errors
- [ ] Enabled custom domain (if desired)
- [ ] Considered upgrading to paid tier for production

---

## Custom Domain

To use your own domain:

1. Go to service Settings
2. Click "Custom Domain"
3. Follow instructions to add DNS records
4. Wait for SSL certificate generation (24-48 hours)

---

## Performance Tips

### Reduce Spin-Down Time (Free Tier)

Render services fall asleep on free tier. To keep them awake, you can:
- Use a monitoring service (like UptimeRobot) to ping your app
- Use Render's paid tier

### Optimize Build

In `package.json`, ensure scripts are correct:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### Database (Optional)

If you add a database later:
1. Create PostgreSQL database on Render
2. Get connection string
3. Add to environment variables
4. Update server.ts with connection code

---

## API Monitoring

Free tools to monitor your API:
- [UptimeRobot](https://uptimerobot.com) - Free uptime monitoring
- [Better Stack](https://betterstack.com) - Free status page

---

## Scaling Beyond Free Tier

When ready to upgrade:

1. **Starter Tier** ($12/month per service)
   - Always running
   - Better specs
   - Good for staging

2. **Standard Tier** ($20+/month)
   - Production-ready
   - Full specs
   - Recommended for live games

3. **Pro/Enterprise**
   - Custom resources
   - Priority support
   - Team collaboration

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy with render.yaml
3. ✅ Get your game URL
4. ✅ Play online!
5. ✅ Share with friends
6. ✅ Track player growth
7. ✅ Upgrade when needed

---

## Support

For Render.com issues:
- Visit [render.com/docs](https://render.com/docs)
- Check [render.com/status](https://render.com/status)
- Contact support@render.com

---

## Success! 🎉

Your Chkobba game is now live on the internet!

Share the URL with friends and enjoy playing together!

```
https://chkobba-web.onrender.com
```

---

**Estimated time: 20-30 minutes from start to live**
