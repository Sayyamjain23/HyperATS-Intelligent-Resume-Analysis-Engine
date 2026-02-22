import React, { useState, useEffect } from 'react';
import { FiClock, FiChevronRight, FiTrendingUp, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getHistory } from '../services/api';

const History = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const data = await getHistory();
            setReports(data.reports || []);
            setError(null);
        } catch (err) {
            console.error('Failed to load history:', err);
            setError('Failed to load history. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-100';
        if (score >= 60) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    if (loading) {
        return (
            <div className="card text-center py-12">
                <div className="loading-shimmer w-full h-64 rounded-lg"></div>
                <p className="text-gray-600 mt-4">Loading history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card text-center py-12">
                <p className="text-red-600">{error}</p>
                <button onClick={loadHistory} className="btn-primary mt-4">
                    Try Again
                </button>
            </div>
        );
    }

    if (reports.length === 0) {
        return (
            <div className="card text-center py-12">
                <FiClock className="mx-auto text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Analysis History</h3>
                <p className="text-gray-600">
                    Your analyzed resumes will appear here. Start by analyzing a resume!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <FiClock className="text-blue-600" />
                    Analysis History
                </h2>
                <p className="text-gray-600">
                    {reports.length} {reports.length === 1 ? 'report' : 'reports'} found
                </p>
            </div>

            <div className="grid gap-4">
                {reports.map((report) => (
                    <div key={report._id} className="card hover:shadow-lg transition-all duration-200 group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-3 py-1 rounded-full font-bold ${getScoreColor(report.atsScore)}`}>
                                        <FiTrendingUp className="inline mr-1" />
                                        {report.atsScore}%
                                    </span>
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <FiClock className="inline" />
                                        {formatDate(report.createdAt)}
                                    </span>
                                </div>
                                <p className="text-gray-700 font-medium line-clamp-1 mb-1">{report.summary}</p>
                                <div className="text-sm text-gray-500 line-clamp-1">
                                    <span className="font-semibold">Role:</span> {report.careerPath?.bestFitRoles?.[0] || 'N/A'}
                                </div>
                            </div>

                            <Link
                                to={`/report/${report._id}`}
                                className="btn-secondary flex items-center justify-center gap-2 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200"
                            >
                                <FiEye /> View Report <FiChevronRight />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;
