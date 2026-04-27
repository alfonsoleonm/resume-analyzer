import express from 'express';
import cors from 'cors';
import analysisRoutes from './routes/analysis.routes';

const app = express();

app.use(cors({
    origin: [
        'http://localhost:4200',
        /\.netlify\.app$/,
    ],
    methods: ['GET', 'POST'],
}));

app.use(express.json());
app.use('/api', analysisRoutes);

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

export default app;