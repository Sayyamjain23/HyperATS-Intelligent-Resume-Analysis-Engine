import * as chrono from "chrono-node";

/**
 * Clean, robust experience parser.
 * - Does NOT count education dates
 * - Only counts dates AFTER detecting a job title
 * - Handles “Present/Current/Now”
 * - Computes total experience duration accurately
 */
export function extractExperience(experienceText) {
    if (!experienceText) return { blocks: [], totalExperienceYears: 0 };

    const lines = experienceText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

    const dateRangeRegex =
        /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{4}|\d{4})\s*(?:-|–|to)\s*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{4}|\d{4}|present|current|now)/i;

    // ---------------------------------------
    // 1. Remove education lines
    // ---------------------------------------
    const educationKeywords =
        /(b\.?tech|bachelor|school|college|university|cbse|hsc|ssc|poddar|dwarkadas|brio|higher secondary)/i;

    let safeLines = lines.filter(
        (line) => !educationKeywords.test(line.toLowerCase())
    );

    // ---------------------------------------
    // 2. We only start counting dates AFTER we see a real job title
    // ---------------------------------------
    let insideJobBlock = false;

    const jobTitleKeywords =
        /(intern|developer|engineer|manager|specialist|analyst|designer|forums|technologies|solutions|labs|consultant)/i;

    const blocks = [];
    let currentBlock = {
        role: "",
        company: "",
        startDate: null,
        endDate: null,
        description: [],
    };

    // ---------------------------------------
    // 3. Process lines
    // ---------------------------------------
    for (let line of safeLines) {
        // Detect when experience section truly “starts”
        if (jobTitleKeywords.test(line)) {
            insideJobBlock = true;
        }

        // Ignore everything until we see job-related keywords
        if (!insideJobBlock) continue;

        const dateMatch = line.match(dateRangeRegex);

        if (dateMatch) {
            // Found new date range, so push old block if valid
            if (currentBlock.startDate) blocks.push(currentBlock);

            // Start fresh block
            currentBlock = {
                role: "",
                company: "",
                startDate: null,
                endDate: null,
                description: [],
            };

            // Extract dates
            const startStr = dateMatch[1];
            const endStr = dateMatch[2];

            const startDate = chrono.parseDate(startStr);
            const endDate = /present|current|now/i.test(endStr)
                ? new Date()
                : chrono.parseDate(endStr);

            currentBlock.startDate = startDate;
            currentBlock.endDate = endDate;

            // Remove dates, treat remaining text as role/company
            const cleanedText = line.replace(dateRangeRegex, "").trim();
            if (cleanedText.length > 2) {
                currentBlock.role = cleanedText;
            }
        } else {
            // Additional job details AFTER date found
            if (currentBlock.startDate) {
                currentBlock.description.push(line);
            }
        }
    }

    // Push last block if valid
    if (currentBlock.startDate) blocks.push(currentBlock);

    // ---------------------------------------
    // 4. Compute total experience
    // ---------------------------------------
    let totalMonths = 0;

    for (const block of blocks) {
        if (block.startDate && block.endDate) {
            const months =
                (block.endDate.getFullYear() - block.startDate.getFullYear()) *
                12 +
                (block.endDate.getMonth() - block.startDate.getMonth());
            totalMonths += Math.max(0, months);
        }
    }

    return {
        blocks,
        totalExperienceYears: Math.round((totalMonths / 12) * 10) / 10,
    };
}
