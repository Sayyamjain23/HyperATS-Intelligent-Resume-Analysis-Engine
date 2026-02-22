# 🚀 Deployment Guide - AI Resume Analyzer

This guide covers deploying your MERN stack application to production. We'll use **free hosting services** that are perfect for this project.

## 📋 Deployment Architecture

```mermaid
graph LR
    A[User Browser] --> B[Frontend - Vercel]
    B --> C[Backend API - Render]
    C --> D[Database - MongoDB Atlas]
```

## 🎯 Recommended Stack (All Free)

| Component | Platform | Reason |
|-----------|----------|--------|
| **Frontend** | Vercel | Automatic deployments, CDN, excellent for React/Vite apps |
| **Backend** | Render | Free tier, easy setup, auto-deploys from Git |
| **Database** | MongoDB Atlas | 512MB free storage, managed service |

---

## 🗄️ Step 1: Deploy Database (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Verify your email

### 1.2 Create a Cluster

1. Click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select your preferred **region** (choose closest to your users)
4. Click **"Create Cluster"** (takes 3-5 minutes)

### 1.3 Configure Database Access

**Create Database User:**
1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username: `admin` (or your choice)
5. Set a **strong password** (save it!)
6. Set **Database User Privileges** to: `Read and write to any database`
7. Click **"Add User"**

### 1.4 Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (shows `0.0.0.0/0`)
   > ⚠️ For production, restrict to your backend server's IP
4. Click **"Confirm"**

### 1.5 Get Connection String

1. Go to **Database** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Select **Driver**: `Node.js`, **Version**: `5.5 or later`
4. Copy the connection string:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name: `mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/resume-analyzer?retryWrites=true&w=majority`

**Save this connection string** - you'll need it for backend deployment!

---

## 🖥️ Step 2: Deploy Backend (Render)

### 2.1 Prepare Your Code

Before deploying, ensure your code is in a Git repository (GitHub, GitLab, or Bitbucket).

**Push to GitHub:**
```bash
cd c:\Users\sayya\Desktop\analyzer
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
git push -u origin main
```

### 2.2 Create Render Account

1. Go to [Render](https://render.com/)
2. Sign up (you can use GitHub to sign in)
3. Verify your email

### 2.3 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your **GitHub/GitLab** account
3. Select your **ai-resume-analyzer** repository
4. Configure the service:

   | Setting | Value |
   |---------|-------|
   | **Name** | `ai-resume-analyzer-api` |
   | **Region** | Choose closest region |
   | **Branch** | `main` |
   | **Root Directory** | `server` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | `Free` |

### 2.4 Configure Environment Variables

In the **Environment** section, add these variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/resume-analyzer?retryWrites=true&w=majority` |
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `GEMINI_API_KEY` | Your Gemini API key (if using AI) |

### 2.5 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once complete, you'll get a URL like: `https://ai-resume-analyzer-api.onrender.com`

### 2.6 Test Backend

Open: `https://ai-resume-analyzer-api.onrender.com/health`

You should see:
```json
{
  "status": "OK",
  "message": "AI Resume Analyzer API is running"
}
```

✅ **Backend is live!**

> [!NOTE]
> Render free tier may spin down after 15 minutes of inactivity. First request might take 30-60 seconds.

---

## 🎨 Step 3: Deploy Frontend (Vercel)

### 3.1 Update API URL in Frontend

Update `client/src/services/api.js` to use your Render backend URL:

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://ai-resume-analyzer-api.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

### 3.2 Create Environment Variable File

Create `client/.env.production`:

```env
VITE_API_URL=https://ai-resume-analyzer-api.onrender.com
```

### 3.3 Update CORS in Backend

Update `server/server.js` to allow your frontend domain:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-app-name.vercel.app', // Add after deployment
  'https://ai-resume-analyzer-api.onrender.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### 3.4 Create Vercel Account

1. Go to [Vercel](https://vercel.com/)
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### 3.5 Deploy to Vercel

**Option A: Using Vercel Dashboard**

1. Click **"Add New"** → **"Project"**
2. Import your **ai-resume-analyzer** repository
3. Configure project:

   | Setting | Value |
   |---------|-------|
   | **Framework Preset** | `Vite` |
   | **Root Directory** | `client` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |
   | **Install Command** | `npm install` |

4. Add **Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://ai-resume-analyzer-api.onrender.com`

5. Click **"Deploy"**

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to client directory
cd client

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: ai-resume-analyzer
# - Directory to deploy: ./
# - Build command: npm run build
# - Output directory: dist

# Deploy to production
vercel --prod
```

### 3.6 Get Your URL

After deployment, you'll get a URL like:
```
https://ai-resume-analyzer-xyz123.vercel.app
```

### 3.7 Update Backend CORS

Update `server/server.js` with your actual Vercel URL and redeploy:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://ai-resume-analyzer-xyz123.vercel.app', // Your actual URL
  'https://ai-resume-analyzer-api.onrender.com'
];
```

Commit and push changes - Render will auto-deploy.

---

## 🔒 Step 4: Environment Security

### 4.1 Never Commit Secrets

Ensure `.gitignore` includes:
```
.env
.env.local
.env.production
node_modules/
dist/
```

### 4.2 Use Environment Variables

Always use environment variables for:
- Database credentials
- API keys
- Service URLs
- Secrets

---

## ✅ Step 5: Verify Deployment

### 5.1 Test Checklist

- [ ] Backend health check works: `https://your-api.onrender.com/health`
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] Can upload PDF resume
- [ ] Can paste resume text
- [ ] Analysis works correctly
- [ ] Results display properly
- [ ] Save report functionality works
- [ ] History tab shows saved reports

### 5.2 Common Issues

**CORS Errors:**
- Ensure backend `allowedOrigins` includes your Vercel URL
- Check browser console for specific error

**API Not Responding:**
- Render free tier sleeps after inactivity
- First request may take 30-60 seconds

**Environment Variables Not Working:**
- Prefix with `VITE_` for Vite frontend
- Redeploy after adding new variables

**MongoDB Connection Failed:**
- Check connection string format
- Verify IP whitelist (0.0.0.0/0)
- Check username/password

---

## 🔄 Step 6: Continuous Deployment

Both Vercel and Render support automatic deployments:

### Enable Auto-Deploy

**Vercel:**
- Automatically deploys on `git push` to `main`
- Preview deployments for pull requests

**Render:**
- Auto-deploys on push to `main` branch
- Can configure specific branch

### Deployment Workflow

```bash
# Make changes
git add .
git commit -m "Update feature X"
git push origin main

# Automatic deployments trigger:
# 1. Render rebuilds backend
# 2. Vercel rebuilds frontend
```

---

## 🌐 Alternative Deployment Options

### Other Backend Hosts

| Platform | Free Tier | Notes |
|----------|-----------|-------|
| **Railway** | 500 hrs/month | Easy setup, good for Node.js |
| **Cyclic** | Unlimited | Serverless, good for APIs |
| **Fly.io** | 3 VMs free | Docker-based |
| **Heroku** | Limited | Credit card required |
| **AWS/GCP/Azure** | Free credits | More complex setup |

### Other Frontend Hosts

| Platform | Free Tier | Notes |
|----------|-----------|-------|
| **Netlify** | 100GB bandwidth | Similar to Vercel |
| **Cloudflare Pages** | Unlimited | Great CDN |
| **GitHub Pages** | Free | Static sites only |

---

## 📊 Monitoring & Maintenance

### Render Dashboard
- View logs in real-time
- Monitor CPU/Memory usage
- Check deployment history

### Vercel Dashboard
- Analytics (page views, performance)
- Error tracking
- Build logs

### MongoDB Atlas Dashboard
- Monitor database size
- Check connection stats
- Set up alerts

---

## 💰 Cost Estimates

For this application with moderate usage:

| Service | Free Tier Limits | Paid Upgrade |
|---------|------------------|--------------|
| **MongoDB Atlas** | 512MB storage | $9/month (2GB) |
| **Render** | 750 hrs/month | $7/month (always-on) |
| **Vercel** | 100GB bandwidth | $20/month (Pro) |

**Total Free**: $0/month (perfect for portfolio/demo)  
**Total Paid**: ~$36/month (for production)

---

## 🎯 Quick Deployment Checklist

- [ ] Push code to GitHub
- [ ] Create MongoDB Atlas cluster
- [ ] Get MongoDB connection string
- [ ] Deploy backend to Render
- [ ] Add environment variables to Render
- [ ] Test backend `/health` endpoint
- [ ] Update frontend API URL
- [ ] Deploy frontend to Vercel
- [ ] Add environment variables to Vercel
- [ ] Update backend CORS with Vercel URL
- [ ] Test full application flow

---

## 🆘 Need Help?

**Render Logs:**
```
Dashboard → Your Service → Logs
```

**Vercel Logs:**
```
Dashboard → Your Project → Deployments → View Function Logs
```

**MongoDB Logs:**
```
Atlas Dashboard → Clusters → Metrics
```

---

**🎉 Your app is now live and accessible worldwide!**

Share your deployed URL with recruiters, add it to your portfolio, and showcase your full-stack skills! 🚀
