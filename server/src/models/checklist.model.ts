import mongoose from 'mongoose';

const checklistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  shortName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const Checklist = mongoose.model('Checklist', checklistSchema);
