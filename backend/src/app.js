import express from 'express';
import cors from 'cors';
import analysisRoutes from './routes/analysis.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/analysis', analysisRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
