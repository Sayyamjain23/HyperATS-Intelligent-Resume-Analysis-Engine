/**
 * Certification Recommender
 * Suggests certifications based on detected skills and missing JD skills.
 

const CERT_MAP = {
    'cloud': ['AWS Certified Cloud Practitioner', 'Microsoft Azure Fundamentals (AZ-900)', 'Google Cloud Digital Leader'],
    'aws': ['AWS Certified Solutions Architect - Associate', 'AWS Certified Developer - Associate'],
    'azure': ['Microsoft Certified: Azure Administrator Associate', 'Microsoft Certified: Azure Developer Associate'],
    'frontend': ['Meta Front-End Developer Professional Certificate', 'Legacy Front End Development (FreeCodeCamp)'],
    'react': ['Meta Front-End Developer Professional Certificate'],
    'backend': ['OpenJS Node.js Services Developer (JSNSD)', 'Meta Back-End Developer Professional Certificate'],
    'node': ['OpenJS Node.js Application Developer (JSNAD)'],
    'devops': ['Docker Certified Associate', 'Certified Kubernetes Administrator (CKA)'],
    'data': ['Google Data Analytics Professional Certificate', 'IBM Data Science Professional Certificate'],
    'security': ['CompTIA Security+', 'Certified Ethical Hacker (CEH)'],
    'python': ['PCEP – Certified Entry-Level Python Programmer'],
    'java': ['Oracle Certified Professional: Java SE Programmer'],
    'javascript': ['Meta Front-End Developer Professional Certificate'],
    'machine learning': ['Google Data Analytics Professional Certificate', 'IBM Data Science Professional Certificate'],
    'deep learning': ['Google Data Analytics Professional Certificate', 'IBM Data Science Professional Certificate'],
};

export function recommendCertifications(normalizedSkills, jobDescription) {
    const recommendations = new Set();
    const jdText = jobDescription.toLowerCase();

    // Helper to check if cert is already in resume (simple check)
    // In a real app, we'd parse the 'Certifications' section specifically
    // For now, we assume if it's not in the skills list or JD, we recommend it based on domain.

    // 1. Recommend based on detected skills
    normalizedSkills.forEach(skill => {
        const key = skill.toLowerCase();
        // Check exact match in map
        if (CERT_MAP[key]) {
            CERT_MAP[key].forEach(cert => recommendations.add(cert));
        }
        // Check partial match (e.g., 'reactjs' -> 'react')
        Object.keys(CERT_MAP).forEach(mapKey => {
            if (key.includes(mapKey)) {
                CERT_MAP[mapKey].forEach(cert => recommendations.add(cert));
            }
        });
    });

    // 2. Recommend based on JD keywords (if missing in resume)
    Object.keys(CERT_MAP).forEach(key => {
        if (jdText.includes(key)) {
            CERT_MAP[key].forEach(cert => recommendations.add(cert));
        }
    });

    return Array.from(recommendations).slice(0, 5); // Return top 5
}
/*
/**
 * Certification Recommender
 * Rule-based, explainable, JD-aware
 * Avoids substring false positives and noisy recommendations
 */

/* -------------------- CERT DATABASE -------------------- */

const CERT_MAP = {
  cloud: {
    certs: [
      'AWS Certified Cloud Practitioner',
      'Microsoft Azure Fundamentals (AZ-900)',
      'Google Cloud Digital Leader'
    ],
    level: 'foundational'
  },
  aws: {
    certs: [
      'AWS Certified Solutions Architect – Associate',
      'AWS Certified Developer – Associate'
    ],
    level: 'associate'
  },
  azure: {
    certs: [
      'Microsoft Certified: Azure Administrator Associate',
      'Microsoft Certified: Azure Developer Associate'
    ],
    level: 'associate'
  },
  frontend: {
    certs: [
      'Meta Front-End Developer Professional Certificate',
      'freeCodeCamp Front End Development Libraries'
    ],
    level: 'foundational'
  },
  react: {
    certs: ['Meta Front-End Developer Professional Certificate'],
    level: 'foundational'
  },
  backend: {
    certs: [
      'Meta Back-End Developer Professional Certificate',
      'OpenJS Node.js Services Developer (JSNSD)'
    ],
    level: 'associate'
  },
  node: {
    certs: ['OpenJS Node.js Application Developer (JSNAD)'],
    level: 'associate'
  },
  devops: {
    certs: [
      'Docker Certified Associate',
      'Certified Kubernetes Administrator (CKA)'
    ],
    level: 'professional'
  },
  data: {
    certs: [
      'Google Data Analytics Professional Certificate',
      'IBM Data Science Professional Certificate'
    ],
    level: 'foundational'
  },
  security: {
    certs: ['CompTIA Security+'],
    level: 'foundational'
  },
  python: {
    certs: ['PCEP – Certified Entry-Level Python Programmer'],
    level: 'foundational'
  },
  java: {
    certs: ['Oracle Certified Professional: Java SE Programmer'],
    level: 'associate'
  }
};

/* -------------------- HELPERS -------------------- */

function normalize(text = '') {
  return text.toLowerCase();
}

function tokenize(text = '') {
  return normalize(text).split(/\W+/);
}

/* -------------------- CORE LOGIC -------------------- */

export function recommendCertifications(
  normalizedSkills = [],
  jobDescription = ''
) {
  const recommendations = new Map();
  const resumeSkills = new Set(normalizedSkills.map(normalize));
  const jdTokens = new Set(tokenize(jobDescription));

  /* ---------- 1. JD skill gaps (highest priority) ---------- */

  Object.entries(CERT_MAP).forEach(([skill, meta]) => {
    const requiredByJD = jdTokens.has(skill);
    const missingInResume = !resumeSkills.has(skill);

    if (requiredByJD && missingInResume) {
      meta.certs.forEach(cert => {
        recommendations.set(cert, {
          reason: `Recommended because '${skill}' is required in the job description but missing from your resume.`,
          priority: 3
        });
      });
    }
  });

  /* ---------- 2. Resume skills without validation ---------- */

  resumeSkills.forEach(skill => {
    if (CERT_MAP[skill]) {
      CERT_MAP[skill].certs.forEach(cert => {
        if (!recommendations.has(cert)) {
          recommendations.set(cert, {
            reason: `Recommended to formally validate your existing '${skill}' skill.`,
            priority: 2
          });
        }
      });
    }
  });

  /* ---------- 3. Foundational coverage (lowest priority) ---------- */

  if (resumeSkills.size <= 5) {
    Object.entries(CERT_MAP).forEach(([skill, meta]) => {
      if (meta.level === 'foundational' && !resumeSkills.has(skill)) {
        meta.certs.forEach(cert => {
          if (!recommendations.has(cert)) {
            recommendations.set(cert, {
              reason: `Recommended as a foundational certification to strengthen your profile.`,
              priority: 1
            });
          }
        });
      }
    });
  }

  /* ---------- Final ranking ---------- */

  return Array.from(recommendations.entries())
    .sort((a, b) => b[1].priority - a[1].priority)
    .slice(0, 5)
    .map(([cert, meta]) => ({
      certification: cert,
      reason: meta.reason
    }));
}
