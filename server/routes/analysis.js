import express from 'express';
import { analyze, saveReport, getHistory, getReportById } from '../controllers/analysisController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/analyze', upload.single('resume'), analyze);
router.post('/saveReport', saveReport);
router.get('/history', getHistory);
router.get('/report/:id', getReportById);

export default router;
