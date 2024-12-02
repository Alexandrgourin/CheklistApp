import express, { Request, Response, NextFunction, Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';
import { auth, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/error';

// Define interfaces for type safety
interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface UserResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  token?: string;
}

const router: Router = express.Router();

// Registration
router.post('/register', 
  async (
    req: Request<{}, UserResponse | { error: string }, RegisterRequestBody>,
    res: Response<UserResponse | { error: string }>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      
      // Validate input
      if (!name || !email || !password) {
        throw new AppError('All fields are required', 400);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new AppError('Invalid email format', 400);
      }

      // Validate password length
      if (password.length < 6) {
        throw new AppError('Password must be at least 6 characters long', 400);
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError('Email already exists', 400);
      }

      // Create new user
      const user = new User({ name, email, password });
      await user.save();

      // Create token
      const token = jwt.sign(
        { 
          id: user._id.toString(),
          email: user.email 
        },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      // Send response
      res.status(201).json({
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar
        },
        token
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login
router.post('/login',
  async (
    req: Request<{}, UserResponse | { error: string }, LoginRequestBody>,
    res: Response<UserResponse | { error: string }>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError('Email and password are required', 400);
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new AppError('Invalid credentials', 401);
      }

      // Create token
      const token = jwt.sign(
        { 
          id: user._id.toString(),
          email: user.email 
        },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      // Send response
      res.json({
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar
        },
        token
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get current user
router.get('/me', auth,
  async (
    req: AuthRequest,
    res: Response<UserResponse['user'] | { error: string }>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw new AppError('Authentication required', 401);
      }

      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
