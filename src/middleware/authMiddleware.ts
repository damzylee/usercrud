import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: any;
  }
  
  export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
    // Verify JWT token
    jwt.verify(token, 'secret', (err, user) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
      req.user = user;
      next();
    });
};
