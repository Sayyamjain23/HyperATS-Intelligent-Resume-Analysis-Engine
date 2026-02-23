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
const GEMINI_MODEL_CANDIDATES = [
    process.env.GEMINI_MODEL,
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash'
].filter(Boolean);

function normalizeModelName(modelName) {
    return String(modelName).replace(/^models\//, '');
}

function isModelUnavailableError(error) {
    const message = String(error?.message || '').toLowerCase();
    return message.includes('404') ||
        message.includes('is not found') ||
        message.includes('not supported for generatecontent');
}

function extractCareerPathJson(text) {
    const cleaned = String(text || '')
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

    if (!cleaned) {
        throw new Error('Empty Gemini response');
    }

    try {
        return JSON.parse(cleaned);
    } catch {
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        if (start === -1 || end === -1 || end <= start) {
            throw new Error('Gemini response did not contain valid JSON');
        }
        return JSON.parse(cleaned.slice(start, end + 1));
    }
}

const NON_CORE_SKILL_TERMS = new Set([
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'swift', 'kotlin',
    'r', 'matlab', 'perl', 'groovy', 'objective-c', 'scala', 'haskell', 'lua', 'julia', 'dart',
    'react', 'react.js', 'vue.js', 'angular', 'svelte', 'next.js', 'nuxt.js', 'express.js',
    'node.js', 'django', 'flask', 'spring boot', 'asp.net', 'laravel', 'ruby on rails',
    'fastapi', 'koa.js', 'hapi.js', 'jquery', 'three.js', 'd3.js'
]);

function isCoreSkill(skill) {
    return !NON_CORE_SKILL_TERMS.has(String(skill || '').trim().toLowerCase());
}

async function generateJsonWithGemini(apiKey, prompt, featureName) {
    const genAI = new GoogleGenerativeAI(apiKey);
    let lastError = null;

    for (const candidate of GEMINI_MODEL_CANDIDATES) {
        const modelName = normalizeModelName(candidate);

        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const text = result?.response?.text?.() ||
                result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
            const parsed = extractCareerPathJson(text);

            console.log(`[Gemini] ${featureName} model used: ${modelName}`);
            return parsed;
        } catch (error) {
            lastError = error;
            if (isModelUnavailableError(error)) {
                console.warn(`[Gemini] Model unavailable: ${modelName}. Trying next candidate.`);
                continue;
            }

            console.warn(`[Gemini] ${featureName} request failed on ${modelName}:`, error.message);
            break;
        }
    }

    throw lastError || new Error(`Gemini ${featureName} failed`);
}

/**
 * AI-Powered Career Path Prediction using Gemini API
 * @param {string} resumeText - The resume content
 * @param {string} jobDescription - The job description
 * @returns {Promise<Object>} Career path predictions
 */
export async function predictCareerPathWithAI(resumeText, jobDescription) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return predictCareerPath(resumeText, jobDescription);

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

    try {
        const parsed = await generateJsonWithGemini(apiKey, prompt, 'Career path');
        return {
            bestFitRoles: (parsed.bestFitRoles || []).slice(0, 4),
            futureRoles: (parsed.futureRoles || []).slice(0, 3),
            missingCertifications: (parsed.missingCertifications || []).slice(0, 4),
            skillsRoadmap: (parsed.skillsRoadmap || []).slice(0, 5)
        };
    } catch (error) {
        console.warn('Gemini failed -> switching to rule-based:', error.message);
        return predictCareerPath(resumeText, jobDescription);
    }
}

async function suggestResumeImprovementsWithAI(
    resumeText,
    jobDescription,
    keywordAnalysis,
    formattingAnalysis,
    contentAnalysis,
    seniorityAnalysis
) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    const prompt = `You are an ATS resume reviewer.

Analyze the resume against the job description and return only strict JSON.

RESUME (truncated):
${resumeText.substring(0, 5000)}

JOB DESCRIPTION (truncated):
${jobDescription.substring(0, 2500)}

RULE-BASED SIGNALS:
- Missing keywords detected: ${(keywordAnalysis.missingKeywords || []).slice(0, 15).join(', ') || 'None'}
- Formatting issues: ${(formattingAnalysis.formattingIssues || []).slice(0, 10).join(' | ') || 'None'}
- Content issues: ${(contentAnalysis.contentIssues || []).slice(0, 10).join(' | ') || 'None'}
- Seniority suggestions: ${(seniorityAnalysis.senioritySuggestions || []).slice(0, 10).join(' | ') || 'None'}

Return JSON with this schema:
{
  "missingSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "areasForImprovement": ["improvement1", "improvement2", "improvement3", "improvement4", "improvement5"],
  "keywordSuggestions": ["tip1", "tip2", "tip3", "tip4", "tip5"]
}

Rules:
- missingSkills must be explicit skills demanded by the job description but absent from the resume.
- areasForImprovement must be actionable and specific.
- Keep each item concise.
- No markdown. JSON only.`;

    try {
        const parsed = await generateJsonWithGemini(apiKey, prompt, 'Resume improvement');
        return {
            missingSkills: (parsed.missingSkills || []).slice(0, 10),
            areasForImprovement: (parsed.areasForImprovement || []).slice(0, 10),
            keywordSuggestions: (parsed.keywordSuggestions || []).slice(0, 8)
        };
    } catch (error) {
        console.warn('Gemini improvement suggestions failed, using rule-based:', error.message);
        return null;
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
    const coreSkills = normalizedSkills.filter(isCoreSkill);

    // 5. Advanced ATS Analysis (New Modules)
    const formattingAnalysis = checkFormatting(resumeText, sections);
    const keywordAnalysis = analyzeKeywordDensity(resumeText, jobDescription);
    const seniorityAnalysis = checkSeniority(totalExperience, jobDescription);
    const contentAnalysis = analyzeContentQuality(resumeText, experienceData.blocks);
    const recommendedCertifications = recommendCertifications(coreSkills, jobDescription);

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
    const matchedTechSkills = coreSkills.filter(skill =>
        jobDescription.toLowerCase().includes(skill.toLowerCase())
    );

    // Scoring Weights
    const jdRelevantSkills = (keywordAnalysis.jdSkillDensity || [])
        .filter(({ keyword }) => isCoreSkill(keyword));
    const matchedJdSkills = jdRelevantSkills.filter(({ resumeCount }) => resumeCount > 0);
    const skillMatchRatio = matchedJdSkills.length / (jdRelevantSkills.length || 1);
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
    const atsScore = Math.round((semanticScore * 0.4) + (ruleScore * 0.6))+ 20 ;

    const ruleAreasForImprovement = [
        ...formattingAnalysis.formattingIssues,
        ...contentAnalysis.contentIssues,
        ...seniorityAnalysis.senioritySuggestions
    ];

    const aiSuggestions = await suggestResumeImprovementsWithAI(
        resumeText,
        jobDescription,
        keywordAnalysis,
        formattingAnalysis,
        contentAnalysis,
        seniorityAnalysis
    );

    const finalMissingSkills = ((aiSuggestions?.missingSkills && aiSuggestions.missingSkills.length > 0)
        ? aiSuggestions.missingSkills
        : keywordAnalysis.missingKeywords).filter(isCoreSkill);

    const finalAreasForImprovement = (aiSuggestions?.areasForImprovement && aiSuggestions.areasForImprovement.length > 0)
        ? aiSuggestions.areasForImprovement
        : ruleAreasForImprovement;

    const finalKeywordSuggestions = (aiSuggestions?.keywordSuggestions && aiSuggestions.keywordSuggestions.length > 0)
        ? aiSuggestions.keywordSuggestions
        : keywordAnalysis.keywordSuggestions;

    if (finalAreasForImprovement.length === 0) {
        finalAreasForImprovement.push('Tailor your resume keywords and project impact statements to the exact job description.');
    }

    // 8. Construct Final Response
    return {
        atsScore: Math.min(100, Math.max(0, atsScore)),
        summary: `Analyzed resume with ${totalExperience} years of experience. Found ${coreSkills.length} core skills. Seniority alignment: ${seniorityAnalysis.seniorityAlignment}.`,
        strengths: [
            ...matchedTechSkills.slice(0, 3).map(s => `Matches skill: ${s}`),
            ...(formattingAnalysis.formattingIssues.length === 0 ? ['Good formatting'] : []),
            ...(contentAnalysis.contentIssues.length === 0 ? ['Strong action verbs used'] : [])
        ],
        weaknesses: [
            ...formattingAnalysis.formattingIssues.slice(0, 3),
            ...contentAnalysis.contentIssues.slice(0, 3),
            ...keywordAnalysis.missingKeywords.filter(isCoreSkill).slice(0, 3).map(k => `Missing keyword: ${k}`)
        ],
        missingSkills: finalMissingSkills,

        // New Fields
        areasForImprovement: finalAreasForImprovement,
        recommendedCertifications,
        formattingSuggestions: formattingAnalysis.formattingSuggestions,
        contentSuggestions: contentAnalysis.contentSuggestions,
        keywordSuggestions: finalKeywordSuggestions,
        seniorityAlignment: seniorityAnalysis.seniorityAlignment,
        overallNotes: `Your resume is a ${seniorityAnalysis.detectedLevel} level match for this ${seniorityAnalysis.requiredLevel} role.`,

        suggestions: [
            ...finalAreasForImprovement.slice(0, 2),
            ...formattingAnalysis.formattingSuggestions,
            ...contentAnalysis.contentSuggestions,
            ...finalKeywordSuggestions
        ].slice(0, 5),

        details: {
            normalizedSkills: coreSkills,
            matchedTechSkills,
            entities,
            experienceBlocks: experienceData.blocks,
            totalExperience,
            jdSkillDensity: jdRelevantSkills,
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

