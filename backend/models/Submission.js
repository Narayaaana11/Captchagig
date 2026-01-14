import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  proof: {
    type: String,
    required: [true, 'Submission proof is required']
  },
  attachments: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under-review'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  rejectionReason: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String,
  reward: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create index for faster queries
submissionSchema.index({ task: 1, worker: 1 });
submissionSchema.index({ status: 1 });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
