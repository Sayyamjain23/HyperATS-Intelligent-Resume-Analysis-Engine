import React from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiTrendingUp, FiSave, FiCpu, FiUser, FiBriefcase, FiList, FiPieChart } from 'react-icons/fi';
import CareerPath from './CareerPath';
import QualityScore from './QualityScore';
import UniquenessChecker from './UniquenessChecker';
import SkillChart from './charts/SkillChart';
import RadarChart from './charts/RadarChart';
import ExperienceTimeline from './charts/ExperienceTimeline';
import ExportMenu from './ExportMenu';

const AnalysisResult = ({ analysis, onSave, saving, readOnly = false, reportId }) => {
    if (!analysis) return null;

    const {
        summary,
        strengths,
        weaknesses,
        missingSkills,
        areasForImprovement,
        suggestions,
        atsScore,
        careerPath,
        qualityScore,
        uniqueness,
        details
    } = analysis;

    const asList = (value) => Array.isArray(value)
        ? value.filter((item) => typeof item === 'string' && item.trim().length > 0)
        : [];

    const NON_CORE_SKILL_TERMS = new Set([
        'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'swift', 'kotlin',
        'react', 'react.js', 'vue.js', 'angular', 'next.js', 'node.js', 'django', 'flask', 'spring boot'
    ]);
    const isCoreSkill = (value) => !NON_CORE_SKILL_TERMS.has(String(value || '').trim().toLowerCase());

    const strengthList = asList(strengths);
    const weaknessList = asList(weaknesses);
    const missingSkillsList = asList(missingSkills).filter(isCoreSkill);
    const detectedSkillsList = asList(details?.normalizedSkills).filter(isCoreSkill);
    const improvementList = asList(areasForImprovement);
    const suggestionList = asList(suggestions);
    const visibleImprovements = improvementList.length > 0 ? improvementList : weaknessList;
    const visibleSuggestions = suggestionList.length > 0 ? suggestionList : visibleImprovements.slice(0, 5);

    // Determine ATS score color and status
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        return 'Needs Improvement';
    };

    return (
        <div className="space-y-6 animate-slide-up" id="analysis-report-content">
            {/* Header with Save/Export Buttons */}
            <div className="card bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold mb-2">Analysis Complete!</h2>
                        <p className="text-blue-100">
                            Your resume has been analyzed with advanced AI features
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {!readOnly && (
                            <button
                                onClick={onSave}
                                disabled={saving}
                                className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <FiSave />
                                {saving ? 'Saving...' : 'Save Report'}
                            </button>
                        )}

                        <ExportMenu analysis={analysis} reportId={reportId || analysis._id} />
                    </div>
                </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column: Score & Radar */}
                <div className="space-y-6">
                    {/* ATS Score Card */}
                    <div className="card text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                            <FiTrendingUp className="text-blue-600" />
                            ATS Score
                        </h3>
                        <div className="relative w-40 h-40 mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    fill="transparent"
                                    className="text-gray-200"
                                />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    fill="transparent"
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * atsScore) / 100}
                                    className={getScoreColor(atsScore)}
                                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                                />
                            </svg>
                            <span className={`absolute text-4xl font-bold ${getScoreColor(atsScore)}`}>
                                {atsScore}%
                            </span>
                        </div>
                        <p className="font-medium text-gray-600">{getScoreLabel(atsScore)}</p>
                    </div>

                    {/* Radar Chart */}
                    <div className="card">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FiPieChart className="text-purple-600" />
                            Quality Metrics
                        </h3>
                        <RadarChart data={qualityScore} />
                    </div>
                </div>

                {/* Middle & Right Column: Details */}
                <div className="md:col-span-2 space-y-6">
                    {/* Summary */}
                    <div className="card">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Executive Summary</h3>
                        <p className="text-gray-700 leading-relaxed">{summary}</p>
                    </div>

                    {/* Skill Chart */}
                    <div className="card">
                        <SkillChart
                            matchedSkills={details?.matchedTechSkills || []}
                            missingSkills={missingSkillsList}
                            allDetectedSkills={detectedSkillsList}
                        />
                    </div>

                    {/* ATS Insights Section */}
                    {details && (
                        <div className="card bg-indigo-50 border border-indigo-200">
                            <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                                <FiCpu className="text-indigo-600" />
                                ATS Insights
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Contact & Experience */}
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                            <FiUser className="text-blue-500" /> Contact Info
                                        </h4>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            {details.entities?.emails?.length > 0 ? (
                                                details.entities.emails.map((email, i) => <div key={i}>Email: {email}</div>)
                                            ) : <div className="text-gray-400">No email found</div>}
                                            {details.entities?.phones?.length > 0 ? (
                                                details.entities.phones.map((phone, i) => <div key={i}>Phone: {phone}</div>)
                                            ) : <div className="text-gray-400">No phone found</div>}
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                            <FiBriefcase className="text-blue-500" /> Experience Timeline
                                        </h4>
                                        <div className="text-sm text-gray-600 mb-3">
                                            <div className="font-medium text-lg text-blue-600">
                                                {details.totalExperience} Years Total
                                            </div>
                                        </div>
                                        <ExperienceTimeline experienceBlocks={details.experienceBlocks} />
                                    </div>
                                </div>

                                {/* Normalized Skills */}
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                        <FiList className="text-blue-500" /> Detected Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {detectedSkillsList.length > 0 ? (
                                            detectedSkillsList.slice(0, 20).map((skill, i) => (
                                                <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-sm">No standard skills detected</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Advanced Features */}
            <CareerPath careerPath={careerPath} />
            <UniquenessChecker uniqueness={uniqueness} />

            {/* Strengths and Weaknesses Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="card bg-green-50 border border-green-200">
                    <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                        <FiCheckCircle />
                        Strengths
                    </h3>
                    <ul className="space-y-2">
                        {strengthList.length > 0 ? strengthList.map((strength, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                                <span className="text-green-600 mt-1">-</span>
                                <span>{strength}</span>
                            </li>
                        )) : (
                            <li className="text-gray-600">No strengths were extracted from this analysis.</li>
                        )}
                    </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="card bg-red-50 border border-red-200">
                    <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                        <FiXCircle />
                        Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                        {visibleImprovements.length > 0 ? visibleImprovements.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                                <span className="text-red-600 mt-1">-</span>
                                <span>{item}</span>
                            </li>
                        )) : (
                            <li className="text-gray-600">
                                No major gaps were detected. Add more job-specific keywords to improve ATS alignment.
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Missing Skills */}
            <div className="card bg-yellow-50 border border-yellow-200">
                <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                    <FiAlertCircle />
                    Missing Skills
                </h3>
                {missingSkillsList.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {missingSkillsList.map((skill, index) => (
                            <span key={index} className="badge-warning capitalize">
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">
                        No critical missing skills detected for this job description.
                    </p>
                )}
            </div>

            {/* Suggestions */}
            <div className="card bg-blue-50 border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4">
                    Recommendations
                </h3>
                <ul className="space-y-3">
                    {visibleSuggestions.length > 0 ? visibleSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-700">
                            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                                {index + 1}
                            </span>
                            <span>{suggestion}</span>
                        </li>
                    )) : (
                        <li className="text-gray-600">No additional recommendations available.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default AnalysisResult;
