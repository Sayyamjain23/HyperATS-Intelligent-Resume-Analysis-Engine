# 🚀 Quick Start Guide - AI Resume Analyzer

## Prerequisites Checklist

Before running the application, ensure you have:

- ✅ Node.js (v16 or higher) installed
- ✅ MongoDB installed locally OR MongoDB Atlas account (free tier)
- ✅ npm (comes with Node.js)

---

## 🏃 Quick Start (3 Steps)

### Step 1: Configure MongoDB

Create a `.env` file in the `server/` folder with:

```env
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
PORT=5000
```

**Don't have MongoDB locally?** Use MongoDB Atlas (free):
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Replace `MONGODB_URI` with: `mongodb+srv://username:password@cluster.mongodb.net/resume-analyzer`

### Step 2: Start Backend

```powershell
cd server
npm run dev
```

Wait for: `✅ Connected to MongoDB` and `🚀 Server running on port 5000`

### Step 3: Start Frontend (New Terminal)

```powershell
cd client
npm run dev
```

Open browser to: **http://localhost:3000**

---

## ✅ You're Done!

The application should now be running. You can:
- Upload a PDF resume or paste text
- Enter a job description
- Click "Analyze Resume"
- View detailed analysis with ATS score
- Save reports and view history

---

## 🔧 Troubleshooting

**MongoDB Connection Failed?**
- Check if MongoDB is running locally: `mongod`
- Or use MongoDB Atlas (see Step 1)

**Port 3000 or 5000 already in use?**
- Change `PORT=5000` in `server/.env`
- Change port in `client/vite.config.js` for frontend

**Dependencies not installed?**
- Run `npm install` in both `server/` and `client/` folders

---

## 📖 Full Documentation

See [README.md](file:///c:/Users/sayya/Desktop/analyzer/README.md) for complete documentation.

See [walkthrough.md](file:///C:/Users/sayya/.gemini/antigravity/brain/ac2005a8-fce6-448b-bce6-4e84a507cbd9/walkthrough.md) for detailed walkthrough.
