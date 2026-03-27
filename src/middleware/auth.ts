import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtUserPayload {
  sub: string;
  name: string;
  roles: string[];
  jti: string;
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_KEY!) as JwtUserPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRoles: string[] = req.user?.roles ?? [];
    const hasRole = roles.some((r) => userRoles.includes(r));
    if (!hasRole) {
      res.status(403).json({ message: 'Forbidden: insufficient role' });
      return;
    }
    next();
  };
}
