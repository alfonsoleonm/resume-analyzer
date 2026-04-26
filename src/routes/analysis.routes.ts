import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.middleware';
import { extractTextFromPDF } from '../services/pdf.service';
import { analyzeResume, fetchAnalysis } from '../services/analysis.service';

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

router.get('/analysis/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        const result = await fetchAnalysis(req.params.id);
        if (!result) {
            res.status(404).json({ error: 'Analysis not found' });
            return;
        }
        res.status(200).json(result);
    } catch (err) {
        console.error('Fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch analysis' });
    }
});

export default router;