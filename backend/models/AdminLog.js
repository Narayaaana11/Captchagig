import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: [
      'approve_user',
      'reject_user',
      'approve_task',
      'reject_task',
      'approve_submission',
      'reject_submission',
      'process_withdrawal',
      'ban_user',
      'unban_user',
      'resolve_dispute',
      'update_settings',
      'other'
    ],
    required: true
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  targetTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  targetSubmission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission'
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: String
}, {
  timestamps: true
});

adminLogSchema.index({ admin: 1, createdAt: -1 });
adminLogSchema.index({ action: 1 });

const AdminLog = mongoose.model('AdminLog', adminLogSchema);

export default AdminLog;
