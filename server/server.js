import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

import analysisRoutes from './routes/analysis.js';
import pkg from "@google/generative-ai/package.json" assert { type: "json" };

dotenv.config();
const geminiModelPreference = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
console.log("Gemini SDK version:", pkg.version);
console.log("Gemini model preference:", geminiModelPreference);

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', analysisRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'AI Resume Analyzer API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);

    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `File upload error: ${err.message}` });
    }

    res.status(500).json({ error: err.message || 'Internal server error' });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-analyzer';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`API endpoint: http://localhost:${PORT}/api`);
            console.log(`Health check: http://localhost:${PORT}/health`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n Shutting down gracefully...');
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});

