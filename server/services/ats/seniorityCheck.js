/**
 * Seniority Level Analysis
 * Matches candidate experience level with Job Description requirements.
 */

export function checkSeniority(totalExperienceYears, jobDescription) {
    const jdText = jobDescription.toLowerCase();
    let jdLevel = 'Mid-Level'; // Default

    // Determine JD Level
    if (jdText.includes('intern') || jdText.includes('trainee')) {
        jdLevel = 'Intern';
    } else if (jdText.includes('junior') || jdText.includes('entry level') || jdText.includes('0-1') || jdText.includes('0-2')) {
        jdLevel = 'Junior';
    } else if (jdText.includes('senior') || jdText.includes('sr.') || jdText.includes('5+') || jdText.includes('7+')) {
        jdLevel = 'Senior';
    } else if (jdText.includes('lead') || jdText.includes('principal') || jdText.includes('manager') || jdText.includes('architect')) {
        jdLevel = 'Lead';
    }

    // Determine Candidate Level
    let candidateLevel = 'Mid-Level';
    if (totalExperienceYears < 1) candidateLevel = 'Fresher/Intern';
    else if (totalExperienceYears <= 2) candidateLevel = 'Junior';
    else if (totalExperienceYears <= 5) candidateLevel = 'Mid-Level';
    else if (totalExperienceYears <= 8) candidateLevel = 'Senior';
    else candidateLevel = 'Lead';

    let alignment = 'Match';
    const suggestions = [];

    // Simple comparison logic
    const levels = ['Fresher/Intern', 'Junior', 'Mid-Level', 'Senior', 'Lead'];
    const jdLevelIndex = levels.findIndex(l => l.includes(jdLevel) || jdLevel.includes(l)); // Fuzzy match
    const candLevelIndex = levels.indexOf(candidateLevel);

    // Normalize indices for comparison if exact match failed
    const normJdIndex = jdLevel === 'Intern' ? 0 : jdLevel === 'Junior' ? 1 : jdLevel === 'Senior' ? 3 : jdLevel === 'Lead' ? 4 : 2;

    if (candLevelIndex < normJdIndex) {
        alignment = 'Mismatch';
        suggestions.push(`Your profile appears to be ${candidateLevel}-level, but the job requires ${jdLevel}-level responsibilities. Highlight any advanced projects or leadership experience.`);
    } else if (candLevelIndex > normJdIndex + 1) {
        alignment = 'Overqualified'; // Not necessarily a bad thing, but worth noting
        suggestions.push(`You appear to be overqualified for this ${jdLevel} role. Ensure you tailor your resume to explain why you are interested in this position.`);
    }

    return {
        seniorityAlignment: alignment,
        senioritySuggestions: suggestions,
        detectedLevel: candidateLevel,
        requiredLevel: jdLevel
    };
}
