import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDb } from './db';
import authRouter from './routes/auth';
import licenseRouter from './routes/license';
import paymentsRouter from './routes/payments';

function validateEnv() {
  const required: Record<string, string | undefined> = {
    FRONTEND_URL: process.env.FRONTEND_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  };
  const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length > 0) {
    console.error(`[SMOT API] Missing required env vars: ${missing.join(', ')}`);
    process.exit(1);
  }
  if (process.env.JWT_SECRET === 'cambiami-con-una-stringa-sicura') {
    console.error('[SMOT API] JWT_SECRET is still the default placeholder. Set a secure value.');
    process.exit(1);
  }
  if (!process.env.STRIPE_SECRET_KEY!.startsWith('sk_')) {
    console.error('[SMOT API] STRIPE_SECRET_KEY does not look valid.');
    process.exit(1);
  }
}

validateEnv();

const app = express();
const PORT = process.env.PORT || 3000;

app.post('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(cors({ origin: process.env.FRONTEND_URL }));
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
