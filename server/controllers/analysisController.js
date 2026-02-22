import AnalysisReport from '../models/AnalysisReport.js';
import { analyzeResume, predictCareerPath, predictCareerPathWithAI, calculateQualityScore, checkUniqueness } from '../services/aiService.js';
import pdf from 'pdf-parse';

/**
 * Analyze resume against job description
 * POST /api/analyze
 */
export async function analyze(req, res) {
    try {
        let resumeText = req.body.resumeText;
        const jobDescription = req.body.jobDescription;

        // Validate inputs
        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required' });
        }

        // If PDF file was uploaded, extract text from it
        if (req.file) {
            try {
                const dataBuffer = req.file.buffer;
                const pdfData = await pdf(dataBuffer);
                resumeText = pdfData.text;
            } catch (pdfError) {
                console.error('PDF parsing error:', pdfError);
                return res.status(400).json({ error: 'Failed to parse PDF file. Please try uploading a different file or paste text directly.' });
            }
        }

        // Validate resume text
        if (!resumeText || resumeText.trim().length === 0) {
            return res.status(400).json({ error: 'Resume text is required. Please upload a PDF or paste resume text.' });
        }

        // Call AI service to analyze - all features
        const analysis = await analyzeResume(resumeText, jobDescription);

        // Try AI-powered career prediction, fallback to rules
        let careerPath;
        let aiPowered = false;

        if (process.env.GEMINI_API_KEY) {
            try {
                console.log('🤖 Using Gemini AI for career path prediction...');
                careerPath = await predictCareerPathWithAI(resumeText, jobDescription);
                aiPowered = true;
                console.log('✅ AI prediction successful');

            } catch (aiError) {
                console.warn('⚠️ Gemini AI failed, falling back to rule-based:', aiError.message);
                careerPath = predictCareerPath(resumeText, jobDescription);
            }
        } else {
            console.log('📋 Using rule-based career path prediction (no API key)');
            careerPath = predictCareerPath(resumeText, jobDescription);
        }

        const qualityScore = calculateQualityScore(resumeText, jobDescription);
        const uniqueness = checkUniqueness(resumeText);

        // Return comprehensive analysis results
        res.json({
            ...analysis,
            careerPath: {
                ...careerPath,
                aiPowered // Indicate whether AI was used
            },
            qualityScore,
            uniqueness,
            resumeText // Include so frontend can save it if needed
        });

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze resume. Please try again.' });
    }
}

/**
 * Save analysis report to database
 * POST /api/saveReport
 */
export async function saveReport(req, res) {
    try {
        const {
            resumeText,
            jobDescription,
            summary,
            strengths,
            weaknesses,
            missingSkills,
            atsScore,
            suggestions,
            careerPath,
            qualityScore,
            uniqueness
        } = req.body;

        // Validate required fields
        if (!resumeText || !jobDescription || !summary) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const report = new AnalysisReport({
            resumeText,
            jobDescription,
            summary,
            strengths,
            weaknesses,
            missingSkills,
            atsScore,
            suggestions,
            careerPath,
            qualityScore,
            uniqueness
        });

        await report.save();

        res.status(201).json({
            message: 'Report saved successfully',
            reportId: report._id
        });

    } catch (error) {
        console.error('Save report error:', error);
        res.status(500).json({ error: 'Failed to save report. Please try again.' });
    }
}

/**
 * Get analysis history
 * GET /api/history
 */
export async function getHistory(req, res) {
    try {
        const reports = await AnalysisReport.find()
            .sort({ createdAt: -1 })
            .limit(20); // Limit to last 20 reports

        res.json({ reports });

    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ error: 'Failed to retrieve history. Please try again.' });
    }
}

/**
 * Get single report by ID
 * GET /api/report/:id
 */
export async function getReportById(req, res) {
    try {
        const report = await AnalysisReport.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        res.json(report);

    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({ error: 'Failed to retrieve report' });
    }
}
