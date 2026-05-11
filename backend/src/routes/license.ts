import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { LicenseStatus } from '../types';

const router = Router();

function generateLicenseKey(): string {
  const parts = [uuid().slice(0, 4).toUpperCase(),
    uuid().slice(0, 4).toUpperCase(),
    uuid().slice(0, 4).toUpperCase(),
    uuid().slice(0, 4).toUpperCase()];
  return `SMOT-${parts.join('-')}`;
}

function getLicenseStatus(license: any): LicenseStatus {
  const now = Date.now();
  const expires = new Date(license.expires_at).getTime();
  const graceMs = 24 * 60 * 60 * 1000;

  if (now <= expires) {
    return { valid: true, blocked: false, grace: false, plan: license.plan, expires_at: license.expires_at };
  }
  if (now <= expires + graceMs) {
    return {
      valid: true, blocked: false, grace: true,
      plan: license.plan, expires_at: license.expires_at,
      grace_until: new Date(expires + graceMs).toISOString(),
    };
  }
  return { valid: false, blocked: true, grace: false, expires_at: license.expires_at };
}

router.get('/status', authMiddleware, (req: AuthRequest, res) => {
  const license = db.prepare('SELECT * FROM licenses WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(req.user!.id) as any;
  if (!license) {
    return res.json({ hasLicense: false });
  }
  res.json({ hasLicense: true, ...getLicenseStatus(license) });
});

router.get('/validate/:key', (req, res) => {
  const license = db.prepare('SELECT * FROM licenses WHERE key = ?').get(req.params.key) as any;
  if (!license) {
    return res.json({ valid: false, blocked: false, error: 'Chiave non valida' });
  }
  res.json(getLicenseStatus(license));
});

export default router;
