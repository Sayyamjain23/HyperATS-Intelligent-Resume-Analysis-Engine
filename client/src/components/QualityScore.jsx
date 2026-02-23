import React from 'react';
import { FiStar, FiCheckCircle } from 'react-icons/fi';

const QualityScore = ({ qualityScore }) => {
    if (!qualityScore) return null;

    const { overall, clarity, structure, grammar, atsCompatibility, relevancy, feedback } = qualityScore;

    const getScoreColor = (score, maxScore = 2) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 75) return 'bg-green-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getOverallColor = (score) => {
        if (score >= 8) return 'text-green-600';
        if (score >= 6) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getOverallLabel = (score) => {
        if (score >= 8) return 'Excellent';
        if (score >= 6) return 'Good';
        if (score >= 4) return 'Fair';
        return 'Needs Work';
    };

    const categories = [
        { name: 'Clarity', score: clarity, max: 2, icon: '📝' },
        { name: 'Structure', score: structure, max: 2, icon: '📋' },
        { name: 'Grammar', score: grammar, max: 2, icon: '✍️' },
        { name: 'ATS Compatibility', score: atsCompatibility, max: 2, icon: '🤖' },
        { name: 'Relevancy', score: relevancy, max: 2, icon: '🎯' }
    ];

    return (
        <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl">
                    <FiStar className="text-3xl text-white" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">Resume Quality Score</h3>
                    <p className="text-gray-600">Comprehensive quality analysis</p>
                </div>
            </div>

            {/* Overall Score */}
            <div className="bg-white p-6 rounded-xl border-2 border-yellow-300 mb-6 text-center">
                <p className="text-gray-600 mb-2 font-medium">Overall Quality</p>
                <div className="flex items-center justify-center gap-4">
                    <span className={`text-6xl font-bold ${getOverallColor(overall)}`}>
                        {overall}
                    </span>
                    <div className="text-left">
                        <p className="text-2xl font-bold text-gray-800">/ 10</p>
                        <p className={`text-lg font-semibold ${getOverallColor(overall)}`}>
                            {getOverallLabel(overall)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white p-5 rounded-xl border-2 border-yellow-200 mb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Score Breakdown</h4>
                <div className="space-y-4">
                    {categories.map((category, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-gray-700 flex items-center gap-2">
                                    <span>{category.icon}</span>
                                    {category.name}
                                </span>
                                <span className="font-bold text-gray-800">
                                    {category.score.toFixed(1)} / {category.max}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className={`h-full ${getScoreColor(category.score, category.max)} transition-all duration-500 rounded-full`}
                                    style={{ width: `${(category.score / category.max) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feedback */}
            {feedback && feedback.length > 0 && (
                <div className="bg-white p-5 rounded-xl border-2 border-yellow-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <FiCheckCircle className="text-yellow-600" />
                        Detailed Feedback
                    </h4>
                    <ul className="space-y-2">
                        {feedback.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                                <span className="text-yellow-600 font-bold mt-1"></span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default QualityScore;
