import express, { Response, NextFunction } from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import { Checklist, ChecklistStatus, IChecklist } from '../models/checklist';
import { AppError } from '../middleware/error';
import { Document, Types } from 'mongoose';

const router = express.Router();

interface ChecklistResponse {
  id: string;
  title: string;
  shortName: string;
  status: ChecklistStatus;
  userId: string;
  userName: string;
  createdAt: number;
  updatedAt: number;
}

function createChecklistResponse(checklist: Document<unknown, any, IChecklist> & IChecklist): ChecklistResponse {
  return {
    id: checklist._id.toString(),
    title: checklist.title,
    shortName: checklist.shortName,
    status: checklist.status,
    userId: checklist.userId.toString(),
    userName: checklist.userName,
    createdAt: checklist.createdAt.getTime(),
    updatedAt: checklist.updatedAt.getTime()
  };
}

// Get all user's checklists
router.get('/', auth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new AppError('Authentication required', 401);
    }

    const checklists = await Checklist.find({ userId: new Types.ObjectId(req.user.id) });
    const response = checklists.map(createChecklistResponse);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Create new checklist
router.post('/', auth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new AppError('Authentication required', 401);
    }

    const { title, shortName, status } = req.body as {
      title: string;
      shortName: string;
      status: ChecklistStatus;
    };

    // Validate input
    if (!title || !shortName || !status) {
      throw new AppError('Title, shortName and status are required', 400);
    }

    // Validate status
    if (!Object.values(ChecklistStatus).includes(status)) {
      throw new AppError('Invalid status value', 400);
    }

    const checklist = new Checklist({
      title,
      shortName,
      status,
      userId: new Types.ObjectId(req.user.id),
      userName: req.user.email || 'Anonymous'
    });

    await checklist.save();
    res.status(201).json(createChecklistResponse(checklist));
  } catch (error) {
    next(error);
  }
});

// Update checklist
router.put('/:id', auth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new AppError('Authentication required', 401);
    }

    const { title, shortName, status } = req.body as {
      title: string;
      shortName: string;
      status: ChecklistStatus;
    };

    // Validate input
    if (!title || !shortName || !status) {
      throw new AppError('Title, shortName and status are required', 400);
    }

    // Validate status
    if (!Object.values(ChecklistStatus).includes(status)) {
      throw new AppError('Invalid status value', 400);
    }

    const checklist = await Checklist.findOneAndUpdate(
      { 
        _id: new Types.ObjectId(req.params.id), 
        userId: new Types.ObjectId(req.user.id) 
      },
      { title, shortName, status },
      { new: true }
    );

    if (!checklist) {
      throw new AppError('Checklist not found', 404);
    }

    res.json(createChecklistResponse(checklist));
  } catch (error) {
    next(error);
  }
});

// Delete checklist
router.delete('/:id', auth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new AppError('Authentication required', 401);
    }

    const checklist = await Checklist.findOneAndDelete({
      _id: new Types.ObjectId(req.params.id),
      userId: new Types.ObjectId(req.user.id)
    });

    if (!checklist) {
      throw new AppError('Checklist not found', 404);
    }

    res.json({ message: 'Checklist deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
