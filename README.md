# Resume Analyzer — Backend

Node.js/Express backend for the Resume Analyzer application. Handles PDF text extraction, AI-powered resume analysis via Gemini 2.5 Flash, and data persistence with AWS DynamoDB.

## Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express
- **AI:** Google Gemini 2.5 Flash
- **Database:** AWS DynamoDB
- **PDF Parsing:** pdf-parse

## Architecture
POST /api/analyze
→ multer (PDF upload)
→ pdf.service (text extraction)
→ analysis.service (orchestration)
→ gemini.adapter (AI analysis)
→ dynamo.adapter (persist result)
→ return AnalysisResult JSON
GET /api/analysis/:id
→ dynamo.adapter (fetch result)
→ return AnalysisResult JSON

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze` | Upload PDF + job description, returns AI analysis |
| `GET` | `/api/analysis/:id` | Retrieve a saved analysis by ID |
| `GET` | `/health` | Health check |

### Request — POST /api/analyze

`multipart/form-data` with:
- `resume` — PDF file (max 5MB)
- `jobDescription` — plain text string

### Response shape

```json
{
  "analysisId": "uuid",
  "createdAt": "ISO timestamp",
  "fitScore": 92,
  "matchedSkills": ["Angular", "Node.js"],
  "missingSkills": ["Docker", "GraphQL"],
  "sectionFeedback": {
    "experience": "...",
    "education": "...",
    "skills": "..."
  },
  "summary": "Overall summary from AI.",
  "resumeSnippet": "First 200 chars of extracted resume text"
}
```

## Local Setup

### Prerequisites

- Node.js 18+
- AWS account with DynamoDB table named `analyses`
- Google Gemini API key

### Steps

```bash
git clone https://github.com/alfonsoleonm/resume-analyzer-backend.git
cd resume-analyzer-backend
npm install
```

Create a `.env` file in the root:
PORT=3000
GEMINI_API_KEY=your_gemini_api_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=analyses

```bash
npm run dev
```

Server runs at `http://localhost:3000`.

## Deployment

Deployed on [Render](https://render.com) free tier.

Live URL: `https://resume-analyzer-backend-ji6h.onrender.com`

> Note: Free tier instances spin down after inactivity. The first request may take up to 50 seconds to cold start.

## Planned Enhancements

- **Async Lambda processing** — Move the Gemini AI call into an AWS Lambda function triggered via API Gateway. The backend would return an `analysisId` immediately and the frontend would poll `GET /api/analysis/:id` until the result is ready. This enables non-blocking analysis and better scalability.
- **Authentication** — Add AWS Cognito for user accounts and per-user analysis history.
- **PDF validation** — Reject non-resume PDFs before sending to Gemini.
