import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../db';
import { User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export interface AuthRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token mancante' });
  }

  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET) as { id: string };
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.id) as User | undefined;
    if (!user) {
      return res.status(401).json({ error: 'Utente non trovato' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Token non valido' });
  }
}
