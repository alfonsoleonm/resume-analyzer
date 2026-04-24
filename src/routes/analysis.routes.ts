import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.middleware';
import { v4 as uuidv4 } from 'uuid';
import { AnalysisResult } from '../models/analysis.model';
import { extractTextFromPDF } from '../services/pdf.service';

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

        const stub: AnalysisResult = {
            analysisId: uuidv4(),
            createdAt: new Date().toISOString(),
            fitScore: 72,
            matchedSkills: ['TypeScript', 'Node.js', 'REST APIs'],
            missingSkills: ['Kubernetes', 'GraphQL'],
            sectionFeedback: {
                experience: 'Strong backend background, but lacks cloud-native mentions.',
                education: 'Matches stated requirements.',
                skills: 'Add Kubernetes and GraphQL to align with the job description.',
            },
            summary: 'Good overall fit. Focus on cloud skills to close the gap.',
            resumeSnippet: extractedText.slice(0, 200),
        };

        res.status(200).json(stub);
    } catch (err) {
        res.status(500).json({ error: 'Failed to parse PDF' });
    }
});

router.get('/analysis/:id', (req: Request, res: Response) => {
    res.status(200).json({ message: `Fetching analysis ${req.params.id} -- coming soon` });
});

export default router;