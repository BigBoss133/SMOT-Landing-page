import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import Stripe from 'stripe';
import db from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

// Lazy Stripe initialization — server starts even without Stripe configured
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || (!key.startsWith('sk_test_') && !key.startsWith('sk_live_'))) {
    throw new Error('STRIPE_NOT_CONFIGURED');
  }
  stripeInstance = new Stripe(key);
  return stripeInstance;
}

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const PRICES: Record<string, { amount: number; label: string }> = {
  monthly: { amount: 999, label: 'Monthly' },
  annual: { amount: 8999, label: 'Annual' },
};

router.post('/create-checkout', authMiddleware, async (req: AuthRequest, res) => {
  const { plan } = req.body;
  if (!plan || !PRICES[plan]) {
    return res.status(400).json({ error: 'Piano non valido' });
  }

  const price = PRICES[plan];

  // Check if user already paid before (for trial logic)
  const existingPayment = db.prepare('SELECT id FROM payments WHERE user_id = ? AND status = ?').get(req.user!.id, 'completed');
  const isFirstPayment = !existingPayment;

  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch {
    return res.status(503).json({ error: 'Pagamenti non disponibili. Stripe non configurato.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price_data: { currency: 'eur', product_data: { name: `SMOT ${price.label}` }, unit_amount: price.amount }, quantity: 1 }],
      customer_email: req.user!.email,
      metadata: { user_id: req.user!.id, plan, is_first_payment: isFirstPayment ? '1' : '0' },
      success_url: `${FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/pricing`,
    });
    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/webhook', async (req, res) => {
  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch {
    // Stripe not configured — return 200 so Stripe retries later
    return res.json({ received: true, note: 'Stripe not configured' });
  }

  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { user_id, plan, is_first_payment } = session.metadata || {};

    if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

    const licenseId = uuid();
    const licenseKey = generateKey();
    const days = plan === 'annual' ? 365 : 30;

    // If first payment, add 7 free days
    const trialDays = is_first_payment === '1' ? 7 : 0;
    const totalDays = days + trialDays;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + totalDays * 24 * 60 * 60 * 1000);

    db.prepare(`INSERT INTO licenses (id, user_id, key, plan, status, expires_at, trial_used)
      VALUES (?, ?, ?, ?, 'active', ?, ?)`).run(licenseId, user_id, licenseKey, plan, expiresAt.toISOString(), is_first_payment === '1' ? 1 : 0);

    db.prepare('INSERT INTO payments (id, user_id, license_id, stripe_session_id, amount, status) VALUES (?, ?, ?, ?, ?, ?)')
      .run(uuid(), user_id, licenseId, session.id, (session.amount_total || 0) / 100, 'completed');

    console.log(`[LICENSE] Generated ${licenseKey} for user ${user_id} (${totalDays} days)`);
  }

  res.json({ received: true });
});

function generateKey(): string {
  const p = () => uuid().slice(0, 4).toUpperCase();
  return `SMOT-${p()}-${p()}-${p()}-${p()}`;
}

export default router;
