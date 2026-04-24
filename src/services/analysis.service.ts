import { v4 as uuidv4 } from 'uuid';
import { analyzeWithGemini } from '../adapters/gemini.adapter';
import { AnalysisResult } from '../models/analysis.model';

export async function analyzeResume(
    resumeText: string,
    jobDescription: string
): Promise<AnalysisResult> {
    const aiResult = await analyzeWithGemini(resumeText, jobDescription);

    const result: AnalysisResult = {
        analysisId: uuidv4(),
        createdAt: new Date().toISOString(),
        resumeSnippet: resumeText.slice(0, 200),
        ...aiResult,
    };

    return result;
}