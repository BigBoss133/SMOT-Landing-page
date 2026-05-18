import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../db';
import { User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const tokenFromHeader = header?.startsWith('Bearer ') ? header.slice(7) : null;
  const token = tokenFromHeader || req.cookies?.['smot-token'];

  if (!token) {
    return res.status(401).json({ error: 'Token mancante' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
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
