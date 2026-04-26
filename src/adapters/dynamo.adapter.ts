import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { AnalysisResult } from '../models/analysis.model';

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME!;

export async function saveAnalysis(analysis: AnalysisResult): Promise<void> {
    await docClient.send(
        new PutCommand({
            TableName: TABLE_NAME,
            Item: analysis,
        })
    );
}

export async function getAnalysis(analysisId: string): Promise<AnalysisResult | null> {
    const response = await docClient.send(
        new GetCommand({
            TableName: TABLE_NAME,
            Key: { analysisId },
        })
    );

    return (response.Item as AnalysisResult) ?? null;
}