export interface SectionFeedback {
    experience: string;
    education: string;
    skills: string;
}

export interface AnalysisResult {
    analysisId: string;
    createdAt: string;
    fitScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    sectionFeedback: SectionFeedback;
    summary: string;
    resumeSnippet: string;
}