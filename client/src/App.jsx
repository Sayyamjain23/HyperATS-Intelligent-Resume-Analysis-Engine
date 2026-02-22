import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FiActivity, FiClock } from 'react-icons/fi';
import ResumeUpload from './components/ResumeUpload';
import JobDescription from './components/JobDescription';
import AnalysisResult from './components/AnalysisResult';
import History from './components/History';
import ReportView from './components/ReportView';
import { analyzeResume, saveReport } from './services/api';
import './index.css';

// Navigation Component
const Navigation = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const isHistory = location.pathname === '/history';

    return (
        <div className="flex gap-4 mb-6">
            <Link
                to="/"
                className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all shadow-lg text-center flex items-center justify-center ${isHome
                    ? 'bg-white text-purple-600 shadow-xl transform scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
            >
                <FiActivity className="inline mr-2 text-2xl" />
                Analyze Resume
            </Link>
            <Link
                to="/history"
                className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all shadow-lg text-center flex items-center justify-center ${isHistory
                    ? 'bg-white text-purple-600 shadow-xl transform scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
            >
                <FiClock className="inline mr-2 text-2xl" />
                History
            </Link>
        </div>
    );
};

// Main Analyzer Page
const AnalyzerPage = () => {
    // Form state
    const [resumeText, setResumeText] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');

    // Analysis state
    const [analysis, setAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleAnalyze = async () => {
        // Validation
        if (!resumeText && !resumeFile) {
            setError('Please provide a resume (upload PDF or paste text)');
            return;
        }
        if (!jobDescription.trim()) {
            setError('Please provide a job description');
            return;
        }

        try {
            setAnalyzing(true);
            setError(null);
            setSuccessMessage('');

            const result = await analyzeResume(resumeFile, resumeText, jobDescription);
            setAnalysis(result);

            // Scroll to results
            setTimeout(() => {
                document.getElementById('results-section')?.scrollIntoView({
                    behavior: 'smooth'
                });
            }, 100);

        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.response?.data?.error || 'Failed to analyze resume. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleSaveReport = async () => {
        if (!analysis) return;

        try {
            setSaving(true);
            setError(null);

            const savedReport = await saveReport(analysis);
            setSuccessMessage('Report saved successfully! View it in the History tab.');

            // Update analysis with ID if returned, useful for immediate sharing
            if (savedReport && savedReport.reportId) {
                setAnalysis({ ...analysis, _id: savedReport.reportId });
            }

            // Auto-hide success message after 5 seconds
            setTimeout(() => setSuccessMessage(''), 5000);

        } catch (err) {
            console.error('Save error:', err);
            setError(err.response?.data?.error || 'Failed to save report. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setResumeText('');
        setResumeFile(null);
        setJobDescription('');
        setAnalysis(null);
        setError(null);
        setSuccessMessage('');
    };

    return (
        <div className="space-y-6">
            <Navigation />

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg animate-slide-up">
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg animate-slide-up">
                    <p className="text-green-700 font-medium">{successMessage}</p>
                </div>
            )}

            {/* Resume Upload */}
            <ResumeUpload
                resumeText={resumeText}
                setResumeText={setResumeText}
                resumeFile={resumeFile}
                setResumeFile={setResumeFile}
            />

            {/* Job Description */}
            <JobDescription
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
            />

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="btn-primary flex-1 text-lg"
                >
                    {analyzing ? (
                        <>
                            <span className="inline-block animate-spin mr-2">⏳</span>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <FiActivity className="inline mr-2" />
                            Analyze Resume
                        </>
                    )}
                </button>
                <button
                    onClick={resetForm}
                    className="btn-secondary"
                >
                    Reset
                </button>
            </div>

            {/* Analysis Results */}
            {analysis && (
                <div id="results-section">
                    <AnalysisResult
                        analysis={analysis}
                        onSave={handleSaveReport}
                        saving={saving}
                    />
                </div>
            )}
        </div>
    );
};

function App() {
    return (
        <Router>
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 animate-fade-in">
                        <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
                            AI Resume Analyzer
                        </h1>
                        <p className="text-xl text-blue-100 drop-shadow">
                            Get instant feedback on your resume with AI-powered analysis
                        </p>
                    </div>

                    <Routes>
                        <Route path="/" element={<AnalyzerPage />} />
                        <Route path="/history" element={
                            <>
                                <Navigation />
                                <History />
                            </>
                        } />
                        <Route path="/report/:id" element={<ReportView />} />
                    </Routes>

                    {/* Footer */}
                    <div className="text-center mt-12 text-white/80 text-sm">
                        <p>Built with React, Express, MongoDB, and TailwindCSS</p>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
