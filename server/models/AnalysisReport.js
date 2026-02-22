import mongoose from 'mongoose';

const analysisReportSchema = new mongoose.Schema({
  resumeText: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  strengths: {
    type: [String],
    default: []
  },
  weaknesses: {
    type: [String],
    default: []
  },
  missingSkills: {
    type: [String],
    default: []
  },
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  suggestions: {
    type: [String],
    default: []
  },
  careerPath: {
    bestFitRoles: {
      type: [String],
      default: []
    },
    futureRoles: {
      type: [String],
      default: []
    },
    missingCertifications: {
      type: [String],
      default: []
    },
    skillsRoadmap: {
      type: [{
        skill: String,
        priority: String,
        timeline: String
      }],
      default: []
    }
  },
  qualityScore: {
    overall: {
      type: Number,
      default: 0
    },
    clarity: {
      type: Number,
      default: 0
    },
    structure: {
      type: Number,
      default: 0
    },
    grammar: {
      type: Number,
      default: 0
    },
    atsCompatibility: {
      type: Number,
      default: 0
    },
    relevancy: {
      type: Number,
      default: 0
    },
    feedback: {
      type: [String],
      default: []
    }
  },
  uniqueness: {
    score: {
      type: Number,
      default: 0
    },
    genericPhrases: {
      type: [String],
      default: []
    },
    cliches: {
      type: [String],
      default: []
    },
    suggestions: {
      type: [String],
      default: []
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AnalysisReport = mongoose.model('AnalysisReport', analysisReportSchema);

export default AnalysisReport;
