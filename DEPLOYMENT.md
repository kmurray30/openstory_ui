# Deployment Guide for OpenStory UI

This guide covers deploying OpenStory to Heroku (backend) and other platforms.

## 📦 Deployment Options

### Backend Deployment

The backend needs:
- Node.js runtime
- Persistent file system (for user_data storage)
- Environment variables support

**Recommended platforms:**
- **Heroku** (with persistent filesystem add-on)
- **Railway** (automatic persistent volumes)
- **Render** (persistent disks available)
- **Fly.io** (volumes support)

### Frontend Deployment

The frontend can be deployed to:
- **Vercel** (easiest for Vite apps)
- **Netlify**
- **CloudFlare Pages**
- **GitHub Pages**

---

## 🚀 Deploying to Heroku

### Prerequisites

1. Install the Heroku CLI:
   ```bash
   brew tap heroku/brew && brew install heroku
   # or
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. Login to Heroku:
   ```bash
   heroku login
   ```

### Step 1: Create Heroku App

```bash
# Create a new Heroku app
heroku create your-openstory-backend

# Or if you want to specify a region
heroku create your-openstory-backend --region us
```

### Step 2: Configure Environment Variables

```bash
# Set your OpenAI API key (REQUIRED)
heroku config:set OPENAI_API_KEY=sk-your-actual-api-key-here

# Set session secret (REQUIRED - use a strong random string)
heroku config:set SESSION_SECRET=$(openssl rand -base64 32)

# Set Node environment
heroku config:set NODE_ENV=production

# If deploying frontend separately, set the frontend URL for CORS
heroku config:set CLIENT_URL=https://your-frontend-url.vercel.app
```

### Step 3: Configure Buildpacks

Heroku needs to know this is a Node.js app in a monorepo:

```bash
# Add Node.js buildpack
heroku buildpacks:add heroku/nodejs

# Tell Heroku where the server code is
heroku config:set PROJECT_PATH=server
```

### Step 4: Update Procfile (Already Created)

The `Procfile` in the root tells Heroku how to start the app:
```
web: cd server && npm install && npm run build && npm start
```

### Step 5: Deploy

```bash
# Add Heroku remote (if not already added)
heroku git:remote -a your-openstory-backend

# Deploy to Heroku
git push heroku main

# Or if you're on a different branch
git push heroku your-branch:main
```

### Step 6: Verify Deployment

```bash
# Check if the app is running
heroku ps

# View logs
heroku logs --tail

# Open the app in browser
heroku open
```

Test the health endpoint:
```bash
curl https://your-openstory-backend.herokuapp.com/health
```

### Step 7: (IMPORTANT) Enable Persistent Storage

By default, Heroku's filesystem is ephemeral (resets on restart). To persist user data:

**Option A: Use a Database (Recommended for production)**

Instead of file storage, migrate to a database:
- PostgreSQL (Heroku Postgres)
- MongoDB (MongoDB Atlas)

**Option B: Use Heroku's Ephemeral Storage + Regular Backups**

For prototyping, you can:
1. Accept that data resets on dyno restart
2. Implement periodic backups to S3 or another storage service

**Option C: Migrate to Railway/Render**

These platforms offer persistent volumes by default, which is better suited for file-based storage.

---

## 🌐 Deploying Frontend

### Option 1: Vercel (Recommended)

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Deploy**
   ```bash
   cd client
   vercel
   ```

4. **Update API endpoint**
   
   In `client/src/services/api.ts`, update the API_BASE_URL for production:
   
   ```typescript
   const API_BASE_URL = import.meta.env.PROD 
     ? 'https://your-openstory-backend.herokuapp.com/api'
     : '/api';
   ```

5. **Configure CORS on Backend**
   
   Update `server/src/index.ts` CORS configuration to allow your Vercel domain:
   
   ```typescript
   cors({
     origin: process.env.CLIENT_URL || 'http://localhost:5173',
     credentials: true,
   })
   ```

### Option 2: Netlify

1. **Create `netlify.toml` in the `client/` directory**:
   ```toml
   [build]
     base = "client"
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy**:
   ```bash
   cd client
   netlify deploy --prod
   ```

---

## 🔧 Environment Variables Reference

### Backend (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | ✅ Yes | Your OpenAI API key |
| `SESSION_SECRET` | ✅ Yes | Random string for session encryption |
| `PORT` | No | Server port (default: 3001, Heroku sets automatically) |
| `CLIENT_URL` | No | Frontend URL for CORS (default: localhost:5173) |
| `NODE_ENV` | No | Environment (development/production) |

### Frontend

No environment variables needed by default. Update `client/src/services/api.ts` directly for the API URL.

---

## 🧪 Testing Deployment

### Backend Health Check

```bash
curl https://your-app.herokuapp.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Backend Games API

```bash
curl https://your-app.herokuapp.com/api/games
```

Should return the list of games.

### Frontend

1. Visit your frontend URL
2. Check browser console for errors
3. Try selecting a game
4. Try sending a message
5. Refresh the page - your chat history should persist

---

## 🐛 Common Deployment Issues

### "Application Error" on Heroku

**Check logs:**
```bash
heroku logs --tail
```

**Common causes:**
- Missing environment variables (especially OPENAI_API_KEY)
- Build errors (check package.json scripts)
- Port binding issues (ensure app uses `process.env.PORT`)

### CORS Errors

**Symptoms:** Browser console shows CORS policy errors

**Fix:**
1. Ensure `CLIENT_URL` env var is set on backend
2. Check CORS configuration in `server/src/index.ts`
3. Ensure `credentials: true` in both CORS config and frontend fetch calls

### Sessions Not Persisting

**Symptoms:** Chat history resets on page refresh

**Causes:**
- Cookie `secure` flag set to true without HTTPS
- CORS credentials not configured
- Different domains for frontend/backend without proper CORS setup

**Fix:**
1. In production, ensure HTTPS is used
2. Set `secure: true` in session cookie config for production
3. Ensure `credentials: 'include'` in all frontend API calls

### User Data Not Persisting

**Symptoms:** Chat history lost after Heroku dyno restart

**Cause:** Heroku uses ephemeral filesystem

**Solutions:**
1. Migrate to database storage (recommended)
2. Use a platform with persistent volumes (Railway, Render)
3. Implement periodic backups to S3

---

## 📊 Monitoring

### Heroku Metrics

View app metrics:
```bash
heroku metrics
```

### Logs

View real-time logs:
```bash
heroku logs --tail
```

Search logs:
```bash
heroku logs --tail | grep "ERROR"
```

### Uptime Monitoring

Consider using:
- **UptimeRobot** (free tier available)
- **Pingdom**
- Heroku's built-in metrics

---

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Heroku

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
```

---

## 💰 Cost Estimates

### Heroku
- **Free Tier**: Available but limited
- **Hobby**: $7/month per dyno
- **Professional**: $25-50/month

### Railway
- **Free Tier**: $5 credit/month
- **Pay as you go**: ~$5-10/month for small apps

### Vercel (Frontend)
- **Free**: Generous limits for personal projects
- **Pro**: $20/month if needed

---

## 🎯 Next Steps After Deployment

1. **Set up monitoring** to track uptime and errors
2. **Implement database storage** instead of file system
3. **Add rate limiting** to prevent API abuse
4. **Enable HTTPS** (automatic on Heroku)
5. **Set up backups** for user data
6. **Add error tracking** (Sentry, Rollbar)
7. **Implement caching** for better performance

---

Need help? Check the main README.md or open an issue!

