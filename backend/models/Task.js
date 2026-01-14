import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Task description is required']
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['data-entry', 'captcha', 'survey', 'content-writing', 'social-media', 'testing', 'other'],
    default: 'other'
  },
  reward: {
    type: Number,
    required: [true, 'Reward amount is required'],
    min: [0, 'Reward must be positive']
  },
  requirements: {
    description: String,
    skills: [String],
    timeEstimate: Number, // in minutes
    maxSubmissions: {
      type: Number,
      default: 1
    }
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'paused', 'completed', 'rejected'],
    default: 'pending'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  totalSlots: {
    type: Number,
    required: true,
    min: 1
  },
  availableSlots: {
    type: Number
  },
  submissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission'
  }],
  priority: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: String
}, {
  timestamps: true
});

// Initialize available slots
taskSchema.pre('save', function(next) {
  if (this.isNew) {
    this.availableSlots = this.totalSlots;
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
