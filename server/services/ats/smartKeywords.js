/**
 * Smart Keyword Extraction (Noise-Free, ATS-Friendly)
 * - Removes HR junk
 * - Extracts only meaningful technical keywords
 * - Prioritizes multi-word technical phrases
 */

import natural from 'natural';
import stopword from 'stopword';

// 🔥 Clean Technical Stopwords (NO TECH TERMS HERE)
const HR_STOPWORDS = [
    'related', 'preferred', 'strategies', 'solving', 'strong', 'ability', 'learn', 'adapt', 'delivery',
    'seeking', 'enthusiastic', 'talented', 'fresh', 'graduates', 'excellent', 'communication',
    'skills', 'player', 'motivated', 'passionate', 'driven', 'detail', 'responsible', 'duties',
    'include', 'requirements', 'qualifications', 'role', 'position', 'job', 'company', 'organization',
    'industry', 'sector', 'domain', 'area', 'profession', 'career', 'opportunity', 'growth',
    'potential', 'salary', 'benefits', 'compensation', 'package', 'authorization', 'experience',
    'year', 'years', 'plus', 'advantage', 'willing', 'good', 'great', 'best', 'world', 'class',
    'cutting', 'edge', 'office', 'location', 'remote', 'hybrid', 'onsite'
];

// 🔥 Clean Technical Phrase List (NO SOFT SKILLS)
const TECHNICAL_PHRASES = [
    'object oriented programming', 'problem solving', 'data structures', 'algorithms',
    'rest api', 'rest apis', 'restful api', 'restful apis', 'cloud computing',
    'ci cd', 'ci/cd', 'continuous integration', 'continuous deployment',
    'version control', 'machine learning', 'deep learning', 'data science',
    'data analytics', 'etl pipelines', 'big data',

    // frameworks / stacks
    'spring boot', 'react js', 'react.js', 'node js', 'node.js', 'express.js',
    'express js', 'angular', 'vue js', 'vue.js',

    // cloud
    'aws', 'azure', 'google cloud platform', 'gcp',

    // devops
    'docker', 'kubernetes', 'jenkins', 'terraform', 'github actions',

    // db
    'sql', 'mysql', 'postgresql', 'mongodb', 'nosql',

    // languages
    'java', 'python', 'c++', 'javascript', 'typescript',

    // tools
    'git', 'bash', 'linux'
];

const tokenizer = new natural.WordTokenizer();

export function analyzeSmartKeywords(resumeText, jobDescription) {
    const lowerResume = resumeText.toLowerCase();
    const lowerJD = jobDescription.toLowerCase();

    // Clean + tokenize JD words (remove English + HR stopwords)
    const getCleanTokens = (text) => {
        const tokens = tokenizer
            .tokenize(text)
            .map(t => t.toLowerCase());

        return stopword
            .removeStopwords(tokens, [...stopword.en, ...HR_STOPWORDS])
            .filter(t => t.length > 2); // no single chars
    };

    // 1️⃣ Extract meaningful multi-word phrases
    const jdPhrases = [];
    TECHNICAL_PHRASES.forEach(phrase => {
        if (lowerJD.includes(phrase)) {
            jdPhrases.push(phrase);
        }
    });

    // 2️⃣ Extract remaining single-word technical tokens
    const tokens = getCleanTokens(lowerJD);
    const tokenFreq = {};

    tokens.forEach(t => {
        if (!TECHNICAL_PHRASES.includes(t))
            tokenFreq[t] = (tokenFreq[t] || 0) + 1;
    });

    // 3️⃣ Build keyword list
    const keywords = [
        ...jdPhrases.map(p => ({ keyword: p, isPhrase: true, jdCount: 1 })),
        ...Object.entries(tokenFreq).map(([keyword, count]) => ({
            keyword, isPhrase: false, jdCount: count
        }))
    ];

    // 👌 Sort → phrases on top, then high-frequency words
    const sorted = keywords.sort((a, b) => {
        if (a.isPhrase && !b.isPhrase) return -1;
        if (!a.isPhrase && b.isPhrase) return 1;
        return b.jdCount - a.jdCount;
    });

    // 4️⃣ Compute missing + suggestions
    const missing = [];
    const suggestions = [];
    const jdSkillDensity = [];

    sorted.forEach(item => {
        const { keyword, isPhrase, jdCount } = item;

        const regex = isPhrase
            ? new RegExp(keyword, 'gi')
            : new RegExp(`\\b${keyword}\\b`, 'gi');

        const resumeCount = (lowerResume.match(regex) || []).length;

        jdSkillDensity.push({ keyword, jdCount, resumeCount });

        if (resumeCount === 0) {
            // Only include MEANINGFUL TECH TERMS
            missing.push(keyword);
            suggestions.push(`The job emphasizes "${keyword}", but it's missing from your resume.`);
        }
    });

    return {
        keywordSuggestions: suggestions,
        missingKeywords: [...new Set(missing)], // unique
        jdSkillDensity
    };
}
