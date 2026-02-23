import { analyzeSmartKeywords } from './smartKeywords.js';

/**
 * Keyword density analysis wrapper.
 * Uses smart keyword extraction to compare JD emphasis vs resume coverage.
 */
export function analyzeKeywordDensity(resumeText = '', jobDescription = '') {
    return analyzeSmartKeywords(resumeText, jobDescription);
}
