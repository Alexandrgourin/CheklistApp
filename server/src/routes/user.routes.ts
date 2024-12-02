import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { auth, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { AppError } from '../middleware/error';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
}).single('avatar');

interface UploadResponse {
  message: string;
  avatarUrl: string;
}

interface ProfileResponse {
  id: string;
  email: string;
  name?: string;
  createdAt: number;
  updatedAt: number;
}

// Upload avatar route with error handling
router.post('/avatar', auth, async (req: AuthRequest, res: Response<UploadResponse | { error: string }>, next: NextFunction) => {
  upload(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size too large. Maximum size is 5MB' });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      if (!req.user?.id) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Delete old avatar if exists
      if (user.avatar) {
        const oldAvatarPath = path.join(__dirname, '../../uploads/avatars', path.basename(user.avatar));
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      // Save avatar path
      const avatarUrl = path.basename(req.file.path);
      user.avatar = avatarUrl;
      await user.save();

      res.json({
        message: 'Avatar uploaded successfully',
        avatarUrl
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error uploading avatar';
      res.status(500).json({ error: errorMessage });
    }
  });
});

// Get user profile
router.get('/profile', auth, async (req: AuthRequest, res: Response<ProfileResponse | { error: string }>, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new AppError('Authentication required', 401);
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const response: ProfileResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime()
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', auth, async (req: AuthRequest, res: Response<ProfileResponse | { error: string }>, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new AppError('Authentication required', 401);
    }

    const { name, email } = req.body;

    if (!name && !email) {
      throw new AppError('At least one field (name or email) must be provided', 400);
    }

    const updateData: { name?: string; email?: string } = {};
    if (name) updateData.name = name;
    if (email) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new AppError('Invalid email format', 400);
      }
      updateData.email = email;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const response: ProfileResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime()
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
