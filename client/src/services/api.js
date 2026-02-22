import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Analyze resume against job description
 * @param {File|null} resumeFile - PDF file (optional)
 * @param {string} resumeText - Resume text (optional)
 * @param {string} jobDescription - Job description
 * @returns {Promise} Analysis results
 */
export const analyzeResume = async (resumeFile, resumeText, jobDescription) => {
    const formData = new FormData();

    if (resumeFile) {
        formData.append('resume', resumeFile);
    }

    formData.append('resumeText', resumeText || '');
    formData.append('jobDescription', jobDescription);

    const response = await api.post('/analyze', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

/**
 * Save analysis report to database
 * @param {Object} reportData - Report data to save
 * @returns {Promise} Save confirmation
 */
export const saveReport = async (reportData) => {
    const response = await api.post('/saveReport', reportData);
    return response.data;
};

/**
 * Get analysis history
 * @returns {Promise} Array of previous reports
 */
export const getHistory = async () => {
    const response = await api.get('/history');
    return response.data;
};

export default api;
