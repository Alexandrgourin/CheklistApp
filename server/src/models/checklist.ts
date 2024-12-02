import mongoose, { Schema, Document, Types } from 'mongoose';

export enum ChecklistStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export interface IChecklist extends Document {
  _id: Types.ObjectId;
  title: string;
  shortName: string;
  status: ChecklistStatus;
  userId: Types.ObjectId;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
}

const checklistSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  shortName: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: Object.values(ChecklistStatus),
    default: ChecklistStatus.PENDING
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const Checklist = mongoose.model<IChecklist>('Checklist', checklistSchema);
