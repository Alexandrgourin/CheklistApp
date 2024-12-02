import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from './error';

// Define the user interface
export interface AuthUser {
  id: string;
  email: string;
}

// Define the request interface
export interface AuthRequest extends Omit<Request, 'user'> {
  user?: AuthUser;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string };
      
      if (!decoded || !decoded.id || !decoded.email) {
        throw new AppError('Invalid token', 401);
      }

      req.user = {
        id: decoded.id,
        email: decoded.email
      };

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid token', 401);
      } else if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token expired', 401);
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
