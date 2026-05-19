import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import db from '../db';
import { generateToken, authMiddleware, AuthRequest, JWT_SECRET } from '../middleware/auth';

const router = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: '/',
};

function setAuthCookie(res: Response, token: string) {
  res.cookie('smot-token', token, COOKIE_OPTIONS);
}

const registerSchema = z.object({
  email: z.string().email('Email non valida'),
  password: z.string().min(6, 'Password minima 6 caratteri'),
});

router.post('/register', (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }

  const { email, password } = parsed.data;

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Email già registrata' });
  }

  const id = uuid();
  const password_hash = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)').run(id, email, password_hash);

  const user = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?').get(id) as any;
  const token = generateToken(user);
  setAuthCookie(res, token);
  res.status(201).json({ user });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password richieste' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Credenziali non valide' });
  }

  const token = generateToken(user);
  const { password_hash, ...safeUser } = user;
  setAuthCookie(res, token);
  res.json({ user: safeUser });
});

router.post('/logout', (_req, res) => {
  res.clearCookie('smot-token', { path: '/' });
  res.json({ ok: true });
});

router.get('/me', authMiddleware, (req: AuthRequest, res) => {
  const { password_hash, ...safeUser } = req.user!;
  res.json(safeUser);
});

export default router;
