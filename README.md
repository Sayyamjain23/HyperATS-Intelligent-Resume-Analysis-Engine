# AI Resume Analyzer

A complete MERN stack application for analyzing resumes against job descriptions using AI. Get instant feedback on your resume with ATS scoring, strengths, weaknesses, and improvement suggestions.

![AI Resume Analyzer](https://img.shields.io/badge/Stack-MERN-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

## ✨ Features

- 📄 **PDF Resume Upload** - Upload your resume as a PDF or paste text directly
- 🎯 **Job Description Matching** - Compare your resume against specific job requirements
- 🤖 **AI-Powered Analysis** - Get intelligent feedback on your resume
- 📊 **ATS Score** - See how well your resume performs with Applicant Tracking Systems (0-100)
- 💪 **Strengths & Weaknesses** - Detailed breakdown of your resume's strong points and areas for improvement
- 🎓 **Missing Skills** - Identify skills mentioned in the job description that you're missing
- 💡 **Suggestions** - Get actionable recommendations to improve your resume
- 📚 **History** - View and access all your previous analyses
- 🎨 **Modern UI** - Beautiful, responsive interface built with TailwindCSS

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - Server and API
- **MongoDB** + **Mongoose** - Database and ORM
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icon library

## 📁 Project Structure

```
analyzer/
├── server/
│   ├── controllers/
│   │   └── analysisController.js    # Request handlers
│   ├── models/
│   │   └── AnalysisReport.js        # MongoDB schema
│   ├── routes/
│   │   └── analysis.js              # API routes
│   ├── services/
│   │   └── aiService.js             # AI analysis logic
│   ├── .env.example                 # Environment variables template
│   ├── package.json
│   └── server.js                    # Express app entry point
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalysisResult.jsx   # Analysis display
│   │   │   ├── History.jsx          # Past analyses
│   │   │   ├── JobDescription.jsx   # Job input
│   │   │   └── ResumeUpload.jsx     # Resume input
│   │   ├── services/
│   │   │   └── api.js               # API client
│   │   ├── App.jsx                  # Main component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd analyzer
   ```

2. **Set up the Backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure Environment Variables**
   
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your settings:
   ```env
   MONGODB_URI=mongodb://localhost:27017/resume-analyzer
   PORT=5000
   # AI_API_KEY=your-api-key-here (optional, for future AI integration)
   ```

   **MongoDB Options:**
   - **Local MongoDB**: `mongodb://localhost:27017/resume-analyzer`
   - **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/resume-analyzer`

4. **Set up the Frontend**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

You need to run both the backend and frontend servers.

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
The backend will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
The frontend will start on `http://localhost:3000`

**Access the application** at `http://localhost:3000`

## 📖 Usage

1. **Choose Input Method**
   - Click "Upload PDF" to upload your resume as a PDF file
   - Or click "Paste Text" to directly paste your resume content

2. **Enter Job Description**
   - Paste the job description you're applying for

3. **Analyze**
   - Click "Analyze Resume" button
   - Wait for the AI to process your resume (takes a few seconds)

4. **View Results**
   - See your ATS score (0-100)
   - Review strengths and weaknesses
   - Check missing skills
   - Read improvement suggestions

5. **Save Report** (Optional)
   - Click "Save Report" to store the analysis in the database
   - Access saved reports from the "History" tab

## 🔌 API Endpoints

### POST `/api/analyze`
Analyze a resume against a job description.

**Request:**
- `resumeFile` (optional): PDF file
- `resumeText` (optional): Resume text
- `jobDescription` (required): Job description text

**Response:**
```json
{
  "summary": "...",
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "missingSkills": ["...", "..."],
  "atsScore": 75,
  "suggestions": ["...", "..."],
  "resumeText": "..."
}
```

### POST `/api/saveReport`
Save an analysis report to the database.

**Request:**
```json
{
  "resumeText": "...",
  "jobDescription": "...",
  "summary": "...",
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "atsScore": 75,
  "suggestions": []
}
```

**Response:**
```json
{
  "message": "Report saved successfully",
  "reportId": "..."
}
```

### GET `/api/history`
Retrieve analysis history.

**Response:**
```json
{
  "count": 5,
  "reports": [...]
}
```

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "AI Resume Analyzer API is running"
}
```

## 🤖 AI Service

The application currently uses a **mock AI service** that provides realistic analysis based on keyword matching and heuristics. This allows the application to work without external API dependencies.

### Future AI Integration

To integrate with real AI services (OpenAI, Google Gemini, etc.):

1. Add your API key to `.env`:
   ```env
   AI_API_KEY=your-actual-api-key
   ```

2. Modify `server/services/aiService.js` to call the AI API
3. The mock implementation serves as a template for the response structure

## 🎨 UI Features

- **Gradient Backgrounds** - Modern purple gradient design
- **Smooth Animations** - Fade-in and slide-up effects
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Color-Coded Results** - Green (excellent), yellow (good), red (needs improvement)
- **Interactive Components** - Hover effects and transitions
- **Custom Scrollbar** - Styled scrollbar matching the theme

## 🔒 Error Handling

The application includes comprehensive error handling:
- PDF parsing errors
- File size limits (5MB)
- Missing required fields
- Database connection errors
- API request failures

## 📝 MongoDB Schema

```javascript
{
  resumeText: String,
  jobDescription: String,
  summary: String,
  strengths: [String],
  weaknesses: [String],
  missingSkills: [String],
  atsScore: Number (0-100),
  suggestions: [String],
  createdAt: Date
}
```

## 🚧 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or check your Atlas connection string
- Verify the `MONGODB_URI` in your `.env` file

### Port Already in Use
- Change `PORT` in `server/.env`
- Change port in `client/vite.config.js` if 3000 is taken

### PDF Upload Not Working
- Ensure file is actually a PDF
- Check file size (max 5MB)
- Verify multer middleware is configured correctly

### CORS Errors
- Ensure backend is running
- Check proxy configuration in `vite.config.js`

## 📦 Production Build

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
cd client
npm run build
npm run preview
```

The production build will be in `client/dist/`

## 🤝 Contributing

This is a complete application template. Feel free to:
- Add authentication
- Integrate real AI APIs
- Add more analysis features
- Improve the UI/UX
- Add unit tests

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- React and Vite teams
- TailwindCSS
- MongoDB and Mongoose
- Express.js community

---

**Built with ❤️ using the MERN stack**
