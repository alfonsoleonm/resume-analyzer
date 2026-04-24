import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.middleware';
import { extractTextFromPDF } from '../services/pdf.service';
import { analyzeResume } from '../services/analysis.service';

const router = Router();

router.post('/analyze', upload.single('resume'), async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ error: 'Resume PDF is required' });
        return;
    }

    if (!req.body.jobDescription) {
        res.status(400).json({ error: 'Job description is required' });
        return;
    }

    try {
        const extractedText = await extractTextFromPDF(req.file.buffer);
        const result = await analyzeResume(extractedText, req.body.jobDescription);
        res.status(200).json(result);
    } catch (err) {
        console.error('Analysis error:', err);
        res.status(500).json({ error: 'Failed to analyze resume' });
    }
});

router.get('/analysis/:id', (req: Request, res: Response) => {
    res.status(200).json({ message: `Fetching analysis ${req.params.id} -- coming soon` });
});

export default router;