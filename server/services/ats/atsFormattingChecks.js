/**
 * ATS Formatting & Structure Checks
 * Analyzes resume layout, length, and structure for ATS compatibility.
 

export function checkFormatting(resumeText, sections) {
    const issues = [];
    const suggestions = [];

    // 1. Check for Section Headers
    const requiredSections = ['experience', 'education', 'skills'];
    const missingSections = requiredSections.filter(sec => !sections[sec] || sections[sec].length < 10);

    if (missingSections.length > 0) {
        issues.push(`Missing clear section headers: ${missingSections.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}`);
        suggestions.push(`Add clear, standard headers for: ${missingSections.join(', ')}`);
    }

    // 2. Check Resume Length (Word Count)
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount < 200) {
        issues.push("Resume is too short (less than 200 words).");
        suggestions.push("Expand on your experience and skills to provide more context.");
    } else if (wordCount > 1500) { // Approx 3 pages
        issues.push("Resume might be too long (more than 2 pages).");
        suggestions.push("Try to condense your resume to 1-2 pages for better readability.");
    }

    // 3. Check for Bullet Points vs Paragraphs
    // Heuristic: Count lines starting with typical bullet characters or short lines
    const lines = resumeText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const bulletPattern = /^[-•*➢➤●]\s/i;
    const bulletLines = lines.filter(l => bulletPattern.test(l)).length;
    const totalLines = lines.length;

    if (totalLines > 20 && (bulletLines / totalLines) < 0.2) {
        issues.push("Low usage of bullet points detected.");
        suggestions.push("Convert long paragraphs into bullet points to improve ATS readability.");
    }

    // 4. Check for Contact Info (Email/Phone) - reusing entity extraction logic conceptually
    const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/;
    const phoneRegex = /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/;

    if (!emailRegex.test(resumeText)) {
        issues.push("No email address detected.");
        suggestions.push("Ensure your email address is clearly visible.");
    }
    if (!phoneRegex.test(resumeText)) {
        issues.push("No phone number detected.");
        suggestions.push("Include a phone number for recruiters to contact you.");
    }

    // 5. Check Section Ordering (Skills should be prominent)
    // Simple check: if 'skills' section appears very late in the text
    const skillsIndex = resumeText.toLowerCase().indexOf('skills');
    if (skillsIndex > resumeText.length * 0.7) {
        suggestions.push("Consider moving your Skills section higher up (e.g., after Summary) for better visibility.");
    }

    return {
        formattingIssues: issues,
        formattingSuggestions: suggestions
    };
}
/*

/**
 * ATS Formatting & Structure Analyzer
 * Conservative, rule-based checks for ATS parse reliability
 * Avoids ATS myths and unverifiable claims
 */

export function checkFormatting(resumeText = '', sections = {}) {
  const issues = [];
  const suggestions = [];

  const lowerText = resumeText.toLowerCase();
  const lines = resumeText
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  /* -------------------- 1. Section Headers -------------------- */

  const REQUIRED_SECTIONS = ['experience', 'education', 'skills'];

  const missingSections = REQUIRED_SECTIONS.filter(
    sec => !sections[sec] || !sections[sec].trim()
  );

  if (missingSections.length > 0) {
    issues.push(
      `Missing standard section headers: ${missingSections
        .map(s => s[0].toUpperCase() + s.slice(1))
        .join(', ')}`
    );
    suggestions.push(
      `Use clear, standard section headers such as: Experience, Education, Skills.`
    );
  }

  /* -------------------- 2. Resume Length (Readability, not ATS) -------------------- */

  const wordCount = resumeText.split(/\s+/).length;

  if (wordCount < 200) {
    suggestions.push(
      'Resume appears very brief. Consider adding more detail to better explain your experience.'
    );
  } else if (wordCount > 1500) {
    suggestions.push(
      'Resume appears long. Consider shortening it for better recruiter readability.'
    );
  }

  /* -------------------- 3. Bullet Usage (Human Readability Signal) -------------------- */

  const bulletLikeLines = lines.filter(line =>
    /^[-•*●➢➤]/.test(line) || line.length < 120
  ).length;

  if (lines.length > 20 && bulletLikeLines / lines.length < 0.25) {
    suggestions.push(
      'Large blocks of text detected. Breaking content into bullet points may improve readability.'
    );
  }

  /* -------------------- 4. Contact Information -------------------- */

  const emailRegex =
    /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/;

  const phoneRegex =
    /\b(\+?\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}\b/;

  if (!emailRegex.test(resumeText)) {
    issues.push('No email address detected.');
    suggestions.push('Include a clearly visible email address.');
  }

  if (!phoneRegex.test(resumeText)) {
    issues.push('No phone number detected.');
    suggestions.push('Include a phone number with country code if applicable.');
  }

  /* -------------------- 5. ATS-Safe Formatting Warnings -------------------- */

  if (resumeText.includes('|')) {
    suggestions.push(
      'Avoid complex table-like layouts. ATS systems parse plain text more reliably.'
    );
  }

  if (resumeText.match(/\t/)) {
    suggestions.push(
      'Avoid excessive tab usage; use simple spacing for better ATS parsing.'
    );
  }

  return {
    formattingIssues: issues,
    formattingSuggestions: suggestions
  };
}
