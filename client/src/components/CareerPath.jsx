import React from 'react';
import { FiTrendingUp, FiAward, FiMapPin, FiClock } from 'react-icons/fi';

const CareerPath = ({ careerPath }) => {
    if (!careerPath) return null;

    const { bestFitRoles, futureRoles, missingCertifications, skillsRoadmap, aiPowered } = careerPath;

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-300';
        }
    };

    return (
        <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-purple-200 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
                    <FiTrendingUp className="text-3xl text-white" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-2xl font-bold text-gray-800">AI Career Path Predictor</h3>
                        {aiPowered && (
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                ✨ AI-Powered
                            </span>
                        )}
                    </div>
                    <p className="text-gray-600">
                        {aiPowered ? 'Enhanced by Gemini AI' : 'Your personalized career roadmap'}
                    </p>
                </div>
            </div>

            {/* Best-Fit Roles */}
            {bestFitRoles && bestFitRoles.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-lg font-bold text-indigo-800 mb-3 flex items-center gap-2">
                        <FiMapPin className="text-indigo-600" />
                        Best-Fit Roles for Your Profile
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {bestFitRoles.map((role, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-lg border-2 border-indigo-200 hover:border-indigo-400 transition-all hover:shadow-md"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </span>
                                    <span className="font-semibold text-gray-800">{role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Future Career Progression */}
            {futureRoles && futureRoles.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-lg font-bold text-purple-800 mb-3">
                        🚀 Future Career Progression
                    </h4>
                    <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
                        <div className="flex flex-wrap gap-3">
                            {futureRoles.map((role, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full border border-purple-300 font-medium text-purple-800"
                                >
                                    {role}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Missing Certifications */}
            {missingCertifications && missingCertifications.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-lg font-bold text-orange-800 mb-3 flex items-center gap-2">
                        <FiAward className="text-orange-600" />
                        Recommended Certifications
                    </h4>
                    <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
                        <ul className="space-y-2">
                            {missingCertifications.map((cert, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700">
                                    <span className="text-orange-600 font-bold mt-1">📜</span>
                                    <span>{cert}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Skills Roadmap */}
            {skillsRoadmap && skillsRoadmap.length > 0 && (
                <div>
                    <h4 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                        <FiClock className="text-green-600" />
                        Your Skills Development Roadmap
                    </h4>
                    <div className="space-y-3">
                        {skillsRoadmap.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-lg border-l-4 border-green-500 hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between flex-wrap gap-2">
                                    <div className="flex-1">
                                        <h5 className="font-bold text-gray-800 mb-1">{item.skill}</h5>
                                        <p className="text-sm text-gray-600">⏱️ {item.timeline}</p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(
                                            item.priority
                                        )}`}
                                    >
                                        {item.priority} Priority
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareerPath;
