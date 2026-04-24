import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisResult } from '../models/analysis.model';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeWithGemini(
    resumeText: string,
    jobDescription: string
): Promise<Omit<AnalysisResult, 'analysisId' | 'createdAt' | 'resumeSnippet'>> {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `
You are a professional resume analyzer. Analyze the resume against the job description and return a JSON object only, with no markdown, no backticks, no explanation.

The JSON must follow this exact structure:
{
  "fitScore": <number between 0 and 100>,
  "matchedSkills": [<list of skills found in both resume and job description>],
  "missingSkills": [<list of skills in the job description not found in the resume>],
  "sectionFeedback": {
    "experience": "<feedback on the experience section>",
    "education": "<feedback on the education section>",
    "skills": "<feedback on the skills section>"
  },
  "summary": "<2-3 sentence overall summary and recommendation>"
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const parsed = JSON.parse(text);
    return parsed;
}