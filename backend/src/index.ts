import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDb } from './db';
import authRouter from './routes/auth';
import licenseRouter from './routes/license';
import paymentsRouter from './routes/payments';

const app = express();
const PORT = process.env.PORT || 3000;

// Stripe webhook needs raw body BEFORE json parser
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

initDb();

app.use('/api/auth', authRouter);
app.use('/api/license', licenseRouter);
app.use('/api/payments', paymentsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log('[SMOT API] Running on port', PORT);
});
