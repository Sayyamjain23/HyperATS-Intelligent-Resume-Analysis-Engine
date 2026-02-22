
import Fuse from 'fuse.js';

/**
 * Standardized list of technical skills for normalization
 */
const CANONICAL_SKILLS = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin',
    'React', 'React.js', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Express.js', 'NestJS',
    'Node.js', 'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'Laravel', 'Ruby on Rails',
    'HTML', 'HTML5', 'CSS', 'CSS3', 'Sass', 'Less', 'Tailwind CSS', 'Bootstrap', 'Material UI',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'GraphQL', 'Firebase', 'Supabase',
    'AWS', 'Azure', 'Google Cloud Platform', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitHub Actions',
    'Git', 'Linux', 'Bash', 'Shell Scripting',
    'Machine Learning', 'Deep Learning', 'Data Science', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy',
    'Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence',
    'REST API', 'Microservices', 'Serverless', 'CI/CD', 'TDD', 'BDD',
    'R', 'MATLAB', 'Perl', 'Groovy', 'Objective-C',
    'Scala', 'Haskell', 'Lua', 'Julia', 'Dart', 'Solidity',
    'Assembly', 'VBA', 'FastAPI', 'Koa.js', 'Hapi.js',
    'gRPC', 'WebSockets', 'SOAP',
    'Event-Driven Architecture', 'Monolithic Architecture',
    'CQRS', 'Domain-Driven Design',
    'API Gateway', 'Rate Limiting', 'Redux', 'Zustand', 'MobX',
    'Webpack', 'Vite', 'Parcel',
    'Babel', 'ES6', 'ESNext',
    'jQuery', 'Three.js', 'D3.js',
    'Chart.js', 'Oracle', 'SQLite', 'MariaDB', 'Cassandra', 'CouchDB',
    'DynamoDB', 'Neo4j', 'InfluxDB',
    'Apache Kafka', 'Apache Spark', 'Hadoop',
    'Airflow', 'DBT',
    'Postman', 'Swagger', 'OpenAPI',
    'Figma', 'Adobe XD',
    'Notion', 'Slack',
    'Trello', 'Asana', 'Design Patterns', 'SOLID Principles',
    'Clean Architecture', 'Refactoring',
    'Code Review', 'Version Control',
    'Agile Development', 'Scrum Master',
    'Jest', 'Mocha', 'Chai', 'Cypress',
    'Playwright', 'Selenium',
    'JUnit', 'Mockito',
    'Load Testing', 'Performance Testing',
    'Security Testing',
    'AWS EC2', 'AWS S3', 'AWS Lambda', 'AWS RDS',
    'Azure DevOps', 'Google Cloud Run',
    'Helm', 'Ansible', 'Chef', 'Puppet',
    'Nginx', 'Apache HTTP Server',
    'Prometheus', 'Grafana', 'ELK Stack',
    'React Native', 'Flutter', 'Xamarin',
    'Android', 'Android Studio',
    'iOS', 'Xcode',
    'SwiftUI', 'Jetpack Compose'
];

/**
 * Normalize skills using fuzzy matching
 * @param {string[]} skills - List of raw skills extracted from resume
 * @returns {string[]} - List of normalized canonical skills
 */
export function normalizeSkills(skills) {
    if (!skills || !Array.isArray(skills)) return [];

    const fuse = new Fuse(CANONICAL_SKILLS, {
        includeScore: true,
        threshold: 0.3, // Lower threshold means stricter matching
    });

    const normalized = new Set();

    skills.forEach(skill => {
        if (!skill || typeof skill !== 'string') return;

        const trimmedSkill = skill.trim();
        if (trimmedSkill.length < 2) return;

        // Direct match check (case-insensitive)
        const directMatch = CANONICAL_SKILLS.find(s => s.toLowerCase() === trimmedSkill.toLowerCase());
        if (directMatch) {
            normalized.add(directMatch);
            return;
        }

        // Fuzzy match
        const result = fuse.search(trimmedSkill);
        if (result.length > 0) {
            normalized.add(result[0].item);
        } else {
            // Keep original if no match found, but capitalized nicely
            normalized.add(trimmedSkill.charAt(0).toUpperCase() + trimmedSkill.slice(1));
        }
    });

    return Array.from(normalized);
}
