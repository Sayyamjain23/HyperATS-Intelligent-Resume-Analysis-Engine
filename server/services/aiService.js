/**
 * AI Service for Resume Analysis
 * This service provides intelligent analysis of resumes against job descriptions.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { parseSections } from './ats/sectionParser.js';
import { extractEntities } from './ats/entityExtractor.js';
import { extractExperience } from './ats/dateExtractor.js';
import { normalizeSkills } from './ats/normalizeSkills.js';
import { embedText, cosineSimilarity } from './ats/embeddings.js';

// New ATS Modules
import { checkFormatting } from './ats/atsFormattingChecks.js';
import { analyzeKeywordDensity } from './ats/keywordDensity.js';
import { checkSeniority } from './ats/seniorityCheck.js';
import { recommendCertifications } from './ats/certificationRecommender.js';
import { analyzeContentQuality } from './ats/resumeContentQuality.js';

/**
 * AI-Powered Career Path Prediction using Gemini API
 * @param {string} resumeText - The resume content
 * @param {string} jobDescription - The job description
 * @returns {Promise<Object>} Career path predictions
 */
export async function predictCareerPathWithAI(resumeText, jobDescription) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return predictCareerPath(resumeText, jobDescription);

    try {
        const genAI = new GoogleGenerativeAI(apiKey, {
            httpOptions: { apiVersion: 'v1' }
        });
        const model = genAI.getGenerativeModel({
            model: 'models/gemini-1.5-flash'
        });

        const prompt = `You are an expert career counselor. Analyze this resume and predict a realistic career path.

RESUME:
${resumeText.substring(0, 5000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 2000)}

RULES:
- Detect if fresher (B.Tech student, intern, 0-1 years)
- For freshers: Only entry-level roles (Intern, Junior)
- For mid (2-4 years): Regular to Senior roles
- For senior (5+ years): Lead/Principal roles

Return ONLY valid JSON with this schema:
{
  "bestFitRoles": ["role1", "role2", "role3"],
  "futureRoles": ["role1", "role2"],
  "missingCertifications": ["cert1"],
  "skillsRoadmap": [{"skill": "skill", "priority": "High", "timeline": "2 months"}]
}`;

        const result = await model.generateContent(prompt);

        const text =
            result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) throw new Error("Empty Gemini response");

        const cleaned = text
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        const parsed = JSON.parse(cleaned);

        return {
            bestFitRoles: (parsed.bestFitRoles || []).slice(0, 4),
            futureRoles: (parsed.futureRoles || []).slice(0, 3),
            missingCertifications: (parsed.missingCertifications || []).slice(0, 4),
            skillsRoadmap: (parsed.skillsRoadmap || []).slice(0, 5)
        };

    } catch (error) {
        console.warn("Gemini failed → switching to rule-based:", error.message);
        return predictCareerPath(resumeText, jobDescription);
    }
}


/**
 * Analyzes a resume against a job description
 * @param {string} resumeText - The resume content
 * @param {string} jobDescription - The job description to compare against
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeResume(resumeText, jobDescription) {
    // 1. Parse Sections
    const sections = parseSections(resumeText);

    // 2. Extract Entities
    const entities = extractEntities(resumeText);

    // 3. Extract Experience & Calculate Duration
    const experienceData = extractExperience(sections.experience || resumeText);
    const totalExperience = experienceData.totalExperienceYears;

    // 4. Normalize Skills (from skills section + inferred)
    const rawSkillsText = sections.skills || resumeText;
    const potentialSkills = rawSkillsText.match(/\b[A-Za-z0-9.#+]+\b/g) || [];
    const normalizedSkills = normalizeSkills(potentialSkills);

    // 5. Advanced ATS Analysis (New Modules)
    const formattingAnalysis = checkFormatting(resumeText, sections);
    const keywordAnalysis = analyzeKeywordDensity(resumeText, jobDescription);
    const seniorityAnalysis = checkSeniority(totalExperience, jobDescription);
    const contentAnalysis = analyzeContentQuality(resumeText, experienceData.blocks);
    const recommendedCertifications = recommendCertifications(normalizedSkills, jobDescription);

    // 6. Calculate Semantic Score (Embeddings)
    let semanticScore = 0;
    try {
        if (process.env.GEMINI_API_KEY) {
            const resumeEmbedding = await embedText(resumeText.substring(0, 1000));
            const jdEmbedding = await embedText(jobDescription.substring(0, 1000));
            semanticScore = cosineSimilarity(resumeEmbedding, jdEmbedding) * 100;
        }
    } catch (e) {
        console.warn('Embedding calculation failed:', e.message);
    }

    // 7. Calculate Rule-Based Score
    let ruleScore = 0;
    const matchedTechSkills = normalizedSkills.filter(skill =>
        jobDescription.toLowerCase().includes(skill.toLowerCase())
    );
    const missingSkills = normalizedSkills.length > 0 ?
        keywordAnalysis.missingKeywords.slice(0, 5) : []; // Use keyword analysis for missing skills

    // Scoring Weights
    const skillMatchRatio = matchedTechSkills.length / (keywordAnalysis.jdSkillDensity.length || 1);
    ruleScore += Math.min(skillMatchRatio * 50, 50); // Max 50 points for skills

    // Experience Score (Fresher Safe)
    if (totalExperience > 0) {
        ruleScore += Math.min(totalExperience * 5, 20); // Max 20 points for experience
    } else {
        // For freshers, give points for projects/education
        if (sections.projects.length > 50) ruleScore += 10;
        if (sections.education.length > 50) ruleScore += 10;
    }

    // Formatting Score
    if (formattingAnalysis.formattingIssues.length === 0) ruleScore += 10;
    else ruleScore += Math.max(0, 10 - formattingAnalysis.formattingIssues.length * 2);

    // Content Quality Score
    if (contentAnalysis.contentIssues.length === 0) ruleScore += 10;
    else ruleScore += Math.max(0, 10 - contentAnalysis.contentIssues.length * 2);

    // Final ATS Score (Weighted Average: 40% Semantic, 60% Rule-Based)
    const atsScore = Math.round((semanticScore * 0.4) + (ruleScore * 0.6));

    // 8. Construct Final Response
    return {
        atsScore: Math.min(100, Math.max(0, atsScore)),
        summary: `Analyzed resume with ${totalExperience} years of experience. Found ${normalizedSkills.length} skills. Seniority alignment: ${seniorityAnalysis.seniorityAlignment}.`,
        strengths: [
            ...matchedTechSkills.slice(0, 3).map(s => `Matches skill: ${s}`),
            ...(formattingAnalysis.formattingIssues.length === 0 ? ['Good formatting'] : []),
            ...(contentAnalysis.contentIssues.length === 0 ? ['Strong action verbs used'] : [])
        ],
        weaknesses: [
            ...formattingAnalysis.formattingIssues.slice(0, 3),
            ...contentAnalysis.contentIssues.slice(0, 3),
            ...keywordAnalysis.missingKeywords.slice(0, 3).map(k => `Missing keyword: ${k}`)
        ],
        missingSkills: keywordAnalysis.missingKeywords,

        // New Fields
        areasForImprovement: [
            ...formattingAnalysis.formattingIssues,
            ...contentAnalysis.contentIssues,
            ...seniorityAnalysis.senioritySuggestions
        ],
        recommendedCertifications,
        formattingSuggestions: formattingAnalysis.formattingSuggestions,
        contentSuggestions: contentAnalysis.contentSuggestions,
        keywordSuggestions: keywordAnalysis.keywordSuggestions,
        seniorityAlignment: seniorityAnalysis.seniorityAlignment,
        overallNotes: `Your resume is a ${seniorityAnalysis.detectedLevel} level match for this ${seniorityAnalysis.requiredLevel} role.`,

        suggestions: [
            ...formattingAnalysis.formattingSuggestions,
            ...contentAnalysis.contentSuggestions,
            ...keywordAnalysis.keywordSuggestions
        ].slice(0, 5),

        details: {
            normalizedSkills,
            entities,
            experienceBlocks: experienceData.blocks,
            totalExperience,
            jdSkillDensity: keywordAnalysis.jdSkillDensity,
            sections
        }
    };
}

// Keep existing helper functions if needed for backward compatibility or internal use
export function predictCareerPath(resumeText, jobDescription) {
    // Simple rule-based fallback
    return {
        bestFitRoles: ["Software Engineer", "Full Stack Developer"],
        futureRoles: ["Senior Engineer", "Tech Lead"],
        missingCertifications: ["AWS Certified Solutions Architect"],
        skillsRoadmap: [
            { skill: "System Design", priority: "High", timeline: "3 months" },
            { skill: "Cloud Architecture", priority: "Medium", timeline: "6 months" }
        ]
    };
}

export function calculateQualityScore(resumeText, jobDescription) {
    // Placeholder - now handled by analyzeResume internally but kept for controller compatibility
    return {
        clarity: 8,
        structure: 7,
        grammar: 8,
        atsCompatibility: 7,
        relevancy: 8
    };
}

export function checkUniqueness(resumeText) {
    // Placeholder
    return {
        score: 85,
        plagiarized: false,
        uniquePhrases: ["Spearheaded migration", "Optimized latency by 50%"]
    };
}