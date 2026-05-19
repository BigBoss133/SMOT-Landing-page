import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initDb } from './db';
import authRouter from './routes/auth';
import licenseRouter from './routes/license';
import paymentsRouter from './routes/payments';

// Validate required environment variables at startup
function validateEnv() {
  const required = ['JWT_SECRET', 'FRONTEND_URL'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error(`[FATAL] Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
  // Stripe keys are required only if payments are enabled
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey && !stripeKey.startsWith('sk_test_') && !stripeKey.startsWith('sk_live_')) {
    console.error('[FATAL] STRIPE_SECRET_KEY must start with sk_test_ or sk_live_');
    process.exit(1);
  }
}
validateEnv();

const app = express();
const PORT = process.env.PORT || 3000;

// Stripe webhook needs raw body BEFORE json parser
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }));

const allowedOrigins = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
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
