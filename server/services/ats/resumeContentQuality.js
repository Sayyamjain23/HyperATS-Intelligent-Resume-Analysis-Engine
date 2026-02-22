

const STRONG_VERBS = [
    'developed', 'implemented', 'designed', 'orchestrated', 'engineered',
    'optimized', 'spearheaded', 'established', 'revamped', 'automated',
    'integrated', 'led', 'managed', 'created', 'built', 'deployed',
    'reduced', 'increased', 'saved', 'generated', 'improved', 'accelerated'
];

export function analyzeContentQuality(resumeText, experienceBlocks) {
    const suggestions = [];
    const issues = [];

    // 1. Check for Action Verbs
    const lowerText = resumeText.toLowerCase();
    const usedVerbs = STRONG_VERBS.filter(verb => lowerText.includes(verb));

    if (usedVerbs.length < 5) {
        issues.push("Limited use of strong action verbs.");
        suggestions.push(`Use more strong action verbs like: ${STRONG_VERBS.slice(0, 5).join(', ')}.`);
    }

    // 2. Check for Metrics (Quantifiable Impact)
    // Look for numbers followed by % or currency, or words like 'increased by', 'reduced by'
    const metricPattern = /(\d+%|\$\d+|\d+k|\d+m|increased by|reduced by|saved)/i;
    const hasMetrics = metricPattern.test(resumeText);

    if (!hasMetrics) {
        issues.push("Lack of quantifiable metrics (numbers, %, $).");
        suggestions.push("Add measurable impact to your experience (e.g., 'improved performance by 20%', 'managed $50k budget').");
    }

    // 3. Check Experience Descriptions (if parsed blocks exist)
    if (experienceBlocks && experienceBlocks.length > 0) {
        experienceBlocks.forEach(block => {
            if (block.description && block.description.length > 0) {
                // Check for short descriptions
                const shortDesc = block.description.filter(d => d.split(' ').length < 5);
                if (shortDesc.length > 0) {
                    suggestions.push(`Expand on the description for role at ${block.company || 'your past company'}. Some bullet points are too short.`);
                }
            }
        });
    }

    return {
        contentIssues: issues,
        contentSuggestions: suggestions
    };
}



