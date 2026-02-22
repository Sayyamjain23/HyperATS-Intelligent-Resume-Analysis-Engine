
/**
 * Regex patterns for section headers
 */
const SECTIONS = {
    experience: /^(work\s+experience|experience|employment\s+history|professional\s+experience|work\s+history)/i,
    education: /^(education|academic\s+background|qualifications|academic\s+history|degrees)/i,
    skills: /^(skills|technical\s+skills|technologies|core\s+competencies|expertise)/i,
    projects: /^(projects|personal\s+projects|academic\s+projects|portfolio)/i,
    contact: /^(contact|personal\s+details|contact\s+information)/i
};

/**
 * Parse resume text into sections
 * @param {string} text - Raw resume text
 * @returns {Object} - Object containing text blocks for each section
 */
export function parseSections(text) {
    const lines = text.split('\n');
    const sections = {
        experience: [],
        education: [],
        skills: [],
        projects: [],
        contact: [],
        other: []
    };

    let currentSection = 'other';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Check if line is a section header
        let isHeader = false;
        for (const [key, regex] of Object.entries(SECTIONS)) {
            // Simple heuristic: headers are usually short and match the regex
            if (line.length < 50 && regex.test(line.replace(/[:]/g, ''))) {
                currentSection = key;
                isHeader = true;
                break;
            }
        }

        if (!isHeader) {
            sections[currentSection].push(line);
        }
    }

    // Join lines back into text blocks
    return {
        experience: sections.experience.join('\n'),
        education: sections.education.join('\n'),
        skills: sections.skills.join('\n'),
        projects: sections.projects.join('\n'),
        contact: sections.contact.join('\n'),
        other: sections.other.join('\n')
    };
}
