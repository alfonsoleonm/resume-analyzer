import express from 'express';
import analysisRoutes from './routes/analysis.routes';

const app = express();

app.use(express.json());
app.use('/api', analysisRoutes);

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

export default app;