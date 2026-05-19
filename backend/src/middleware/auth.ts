import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../db';
import { User } from '../types';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`[FATAL] ${name} environment variable is required`);
  return value;
}

const JWT_SECRET = requireEnv('JWT_SECRET');

export interface AuthRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
}

export { JWT_SECRET };

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const cookieToken = req.cookies?.['smot-token'];
  const headerToken = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
  const token = cookieToken || headerToken;

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
