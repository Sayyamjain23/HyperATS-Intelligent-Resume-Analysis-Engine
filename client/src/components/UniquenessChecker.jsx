import React from 'react';
import { FiAlertTriangle, FiZap } from 'react-icons/fi';

const UniquenessChecker = ({ uniqueness }) => {
    if (!uniqueness) return null;

    const { score, genericPhrases, cliches, suggestions } = uniqueness;

    const getScoreColor = (score) => {
        if (score >= 70) return 'text-green-600';
        if (score >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBg = (score) => {
        if (score >= 70) return 'bg-green-500';
        if (score >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getScoreLabel = (score) => {
        if (score >= 70) return 'Unique & Original';
        if (score >= 40) return 'Somewhat Generic';
        return 'Very Generic';
    };

    return (
        <div className="card bg-gradient-to-br from-pink-50 to-red-50 border-2 border-pink-300 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-pink-500 to-red-500 p-3 rounded-xl">
                    <FiZap className="text-3xl text-white" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">Uniqueness Checker</h3>
                    <p className="text-gray-600">Stand out from the crowd</p>
                </div>
            </div>

            {/* Uniqueness Score */}
            <div className="bg-white p-6 rounded-xl border-2 border-pink-300 mb-6">
                <div className="text-center mb-4">
                    <p className="text-gray-600 mb-2 font-medium">Uniqueness Score</p>
                    <div className="flex items-center justify-center gap-3">
                        <span className={`text-6xl font-bold ${getScoreColor(score)}`}>
                            {score}%
                        </span>
                    </div>
                    <p className={`text-lg font-semibold mt-2 ${getScoreColor(score)}`}>
                        {getScoreLabel(score)}
                    </p>
                </div>

                {/* Visual Gauge */}
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                        className={`h-full ${getScoreBg(score)} transition-all duration-1000 rounded-full flex items-center justify-end pr-2`}
                        style={{ width: `${score}%` }}
                    >
                        {score >= 20 && (
                            <span className="text-white font-bold text-sm">{score}%</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Generic Phrases Detected */}
            {cliches && cliches.length > 0 && (
                <div className="bg-white p-5 rounded-xl border-2 border-red-200 mb-6">
                    <h4 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
                        <FiAlertTriangle className="text-red-600" />
                        Detected Clichés ({cliches.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {cliches.map((cliche, index) => (
                            <span
                                key={index}
                                className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium border border-red-300"
                            >
                                {cliche}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Generic Phrase Examples */}
            {genericPhrases && genericPhrases.length > 0 && (
                <div className="bg-white p-5 rounded-xl border-2 border-orange-200 mb-6">
                    <h4 className="text-lg font-bold text-orange-800 mb-3">
                        Generic Phrases Found
                    </h4>
                    <div className="space-y-2">
                        {genericPhrases.slice(0, 5).map((phrase, index) => (
                            <div
                                key={index}
                                className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-sm text-gray-700 italic"
                            >
                                "{phrase}"
                            </div>
                        ))}
                    </div>
                    {genericPhrases.length > 5 && (
                        <p className="text-sm text-gray-600 mt-2">
                            And {genericPhrases.length - 5} more...
                        </p>
                    )}
                </div>
            )}

            {/* Suggestions */}
            {suggestions && suggestions.length > 0 && (
                <div className="bg-white p-5 rounded-xl border-2 border-green-200">
                    <h4 className="text-lg font-bold text-green-800 mb-3">
                        💡 How to Make Your Resume More Unique
                    </h4>
                    <ul className="space-y-3">
                        {suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-3 text-gray-700">
                                <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                                    {index + 1}
                                </span>
                                <span>{suggestion}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UniquenessChecker;
