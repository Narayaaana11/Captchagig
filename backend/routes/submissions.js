import express from 'express';
import { body } from 'express-validator';
import Submission from '../models/Submission.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { protect, authorize, checkVerification } from '../middleware/auth.js';
import { validate } from '../middleware/error.js';

const router = express.Router();

// @route   GET /api/submissions
// @desc    Get all submissions (filtered by user role)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, task, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (task) query.task = task;
    
    // Workers see only their submissions
    if (req.user.role === 'worker') {
      query.worker = req.user.id;
    }
    
    // Creators see submissions for their tasks
    if (req.user.role === 'creator') {
      const creatorTasks = await Task.find({ creator: req.user.id }).select('_id');
      query.task = { $in: creatorTasks.map(t => t._id) };
    }

    const skip = (page - 1) * limit;

    const submissions = await Submission.find(query)
      .populate('task', 'title reward creator')
      .populate('worker', 'name email statistics.rating')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Submission.countDocuments(query);

    res.json({
      success: true,
      submissions,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: submissions.length,
        totalSubmissions: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
      error: error.message
    });
  }
});

// @route   GET /api/submissions/:id
// @desc    Get single submission
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('task')
      .populate('worker', 'name email statistics')
      .populate('reviewedBy', 'name');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.json({
      success: true,
      submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching submission',
      error: error.message
    });
  }
});

// @route   POST /api/submissions
// @desc    Submit task proof
// @access  Private (Worker only)
router.post(
  '/',
  protect,
  authorize('worker'),
  checkVerification,
  [
    body('task').notEmpty().withMessage('Task ID is required'),
    body('proof').trim().notEmpty().withMessage('Proof is required')
  ],
  validate,
  async (req, res) => {
    try {
      const { task, proof, attachments } = req.body;

      // Check if task exists
      const taskDoc = await Task.findById(task);
      if (!taskDoc) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Check if task is approved and active
      if (!taskDoc.isApproved || taskDoc.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'Task is not available for submission'
        });
      }

      // Check if slots are available
      if (taskDoc.availableSlots <= 0) {
        return res.status(400).json({
          success: false,
          message: 'No slots available for this task'
        });
      }

      // Check if user already submitted
      const existingSubmission = await Submission.findOne({
        task,
        worker: req.user.id
      });

      if (existingSubmission) {
        return res.status(400).json({
          success: false,
          message: 'You have already submitted for this task'
        });
      }

      // Create submission
      const submission = await Submission.create({
        task,
        worker: req.user.id,
        proof,
        attachments,
        reward: taskDoc.reward,
        status: 'pending'
      });

      // Update task
      taskDoc.availableSlots -= 1;
      taskDoc.submissions.push(submission._id);
      
      if (taskDoc.availableSlots === 0) {
        taskDoc.status = 'completed';
      }
      
      await taskDoc.save();

      res.status(201).json({
        success: true,
        message: 'Submission created successfully. Waiting for review.',
        submission
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating submission',
        error: error.message
      });
    }
  }
);

// @route   PUT /api/submissions/:id/approve
// @desc    Approve submission
// @access  Private (Creator/Admin only)
router.put('/:id/approve', protect, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate('task worker');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check authorization
    const task = submission.task;
    if (task.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to approve this submission'
      });
    }

    if (submission.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Submission already approved'
      });
    }

    const { rating, feedback } = req.body;

    // Update submission
    submission.status = 'approved';
    submission.reviewedBy = req.user.id;
    submission.reviewedAt = new Date();
    submission.isPaid = true;
    if (rating) submission.rating = rating;
    if (feedback) submission.feedback = feedback;
    await submission.save();

    // Update worker wallet
    const worker = submission.worker;
    const commission = submission.reward * 0.05; // 5% platform commission
    const workerEarning = submission.reward - commission;

    worker.wallet.balance += workerEarning;
    worker.wallet.totalEarned += workerEarning;
    worker.statistics.tasksCompleted += 1;
    
    // Update rating
    if (rating) {
      const totalRatings = worker.statistics.totalRatings;
      const currentRating = worker.statistics.rating;
      worker.statistics.rating = ((currentRating * totalRatings) + rating) / (totalRatings + 1);
      worker.statistics.totalRatings += 1;
    }

    await worker.save();

    // Create transaction
    await Transaction.create({
      user: worker._id,
      type: 'earning',
      taskType: task.category,
      amount: workerEarning,
      status: 'completed',
      description: `Earning from task: ${task.title}`,
      relatedTask: task._id,
      relatedSubmission: submission._id,
      balanceBefore: worker.wallet.balance - workerEarning,
      balanceAfter: worker.wallet.balance,
      processedAt: new Date(),
      processedBy: req.user.id
    });

    // Create commission transaction
    await Transaction.create({
      user: worker._id,
      type: 'commission',
      taskType: task.category,
      amount: commission,
      status: 'completed',
      description: `Platform commission (5%) - ${task.title}`,
      relatedTask: task._id,
      relatedSubmission: submission._id,
      balanceBefore: worker.wallet.balance - workerEarning,
      balanceAfter: worker.wallet.balance,
      processedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Submission approved successfully',
      submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving submission',
      error: error.message
    });
  }
});

// @route   PUT /api/submissions/:id/reject
// @desc    Reject submission
// @access  Private (Creator/Admin only)
router.put('/:id/reject', protect, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate('task');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check authorization
    const task = submission.task;
    if (task.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this submission'
      });
    }

    const { rejectionReason } = req.body;

    submission.status = 'rejected';
    submission.reviewedBy = req.user.id;
    submission.reviewedAt = new Date();
    submission.rejectionReason = rejectionReason;
    await submission.save();

    // Return slot to task
    task.availableSlots += 1;
    if (task.status === 'completed') {
      task.status = 'active';
    }
    await task.save();

    res.json({
      success: true,
      message: 'Submission rejected',
      submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting submission',
      error: error.message
    });
  }
});

export default router;
