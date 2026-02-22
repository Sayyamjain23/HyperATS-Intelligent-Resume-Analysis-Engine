import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AnalysisResult from './AnalysisResult';
import { FiArrowLeft } from 'react-icons/fi';

const ReportView = () => {
    const { id } = useParams();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/report/${id}`);
                setAnalysis(response.data);
            } catch (err) {
                console.error('Failed to load report:', err);
                setError('Report not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchReport();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="loading-shimmer w-16 h-16 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading report...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Link to="/" className="btn-primary">Go Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                        <FiArrowLeft className="mr-2" /> Back to Home
                    </Link>
                </div>

                <AnalysisResult analysis={analysis} readOnly={true} reportId={id} />
            </div>
        </div>
    );
};

export default ReportView;
