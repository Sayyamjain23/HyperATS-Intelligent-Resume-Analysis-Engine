
import compromise from 'compromise';

/**
 * Extract entities (organizations, emails, phones) from text
 * @param {string} text - Resume text
 * @returns {Object} - Extracted entities
 */
export function extractEntities(text) {
    const doc = compromise(text);

    // Extract emails
    const emails = text.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g) || [];

    // Extract phones
    const phones = text.match(/(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/g) || [];

    // Extract organizations (companies)
    // Compromise isn't perfect, but it's a start. 
    // We filter out common false positives if needed.
    const organizations = doc.organizations().out('array');

    // Extract people names (often the first line or header)
    const people = doc.people().out('array');

    return {
        emails: [...new Set(emails)],
        phones: [...new Set(phones)],
        organizations: [...new Set(organizations)],
        people: [...new Set(people)].slice(0, 1) // Usually the candidate name is first
    };
}
