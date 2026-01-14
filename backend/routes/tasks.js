import express from 'express';
import { body } from 'express-validator';
import Task from '../models/Task.js';
import Submission from '../models/Submission.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { protect, authorize, checkVerification } from '../middleware/auth.js';
import { validate } from '../middleware/error.js';

const router = express.Router();

// Simple in-memory captcha challenge store
const challengeStore = new Map();
const CHALLENGE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const pruneChallenges = () => {
  const now = Date.now();
  for (const [key, value] of challengeStore.entries()) {
    if (value.expiresAt < now) {
      challengeStore.delete(key);
    }
  }
};

const createMathChallenge = () => {
  pruneChallenges();
  const a = Math.floor(Math.random() * 20) + 5;
  const b = Math.floor(Math.random() * 20) + 1;
  const question = `${a} + ${b}`;
  const answer = a + b;
  const challengeId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  challengeStore.set(challengeId, { answer, expiresAt: Date.now() + CHALLENGE_TTL_MS });
  return { challengeId, question };
};

const recordEarning = async ({ user, amount, taskType, description, relatedTask }) => {
  const balanceBefore = user.wallet.balance;
  user.wallet.balance += amount;
  user.wallet.totalEarned += amount;
  await user.save();

  await Transaction.create({
    user: user._id,
    type: 'earning',
    taskType,
    amount,
    status: 'completed',
    description,
    relatedTask,
    balanceBefore,
    balanceAfter: user.wallet.balance,
    processedAt: new Date()
  });

  return user.wallet.balance;
};

// @route   GET /api/tasks
// @desc    Get all tasks (with filters)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, category, creator, isApproved, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (creator) query.creator = creator;
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';
    
    // Workers only see approved active tasks
    if (req.user.role === 'worker') {
      query.isApproved = true;
      query.status = 'active';
      query.availableSlots = { $gt: 0 };
    }

    const skip = (page - 1) * limit;

    const tasks = await Task.find(query)
      .populate('creator', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      tasks,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: tasks.length,
        totalTasks: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
});

// @route   GET /api/tasks/configs
// @desc    Get task configuration (limits/rewards)
// @access  Private
router.get('/configs', protect, async (req, res) => {
  try {
    const configs = [
      { taskType: 'captcha', dailyLimit: 50, reward: 2 },
      { taskType: 'spin-wheel', dailyLimit: 3, reward: 10 },
      { taskType: 'referral', dailyLimit: 0, reward: 10 }
    ];

    res.json(configs);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task configs',
      error: error.message
    });
  }
});

// @route   GET /api/tasks/captcha-challenge
// @desc    Issue a server-validated captcha challenge
// @access  Private
router.get('/captcha-challenge', protect, checkVerification, async (req, res) => {
  try {
    const challenge = createMathChallenge();
    res.json({ success: true, ...challenge, ttl: CHALLENGE_TTL_MS });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating captcha challenge',
      error: error.message
    });
  }
});

// @route   POST /api/tasks/complete-captcha
// @desc    Validate captcha and award coins
// @access  Private (Worker)
router.post('/complete-captcha', protect, checkVerification, async (req, res) => {
  try {
    const { challengeId, answer } = req.body;

    if (!challengeId || typeof answer === 'undefined') {
      return res.status(400).json({ success: false, message: 'Challenge and answer are required' });
    }

    pruneChallenges();
    const challenge = challengeStore.get(challengeId);

    if (!challenge) {
      return res.status(400).json({ success: false, message: 'Captcha expired. Please try again.' });
    }

    challengeStore.delete(challengeId);

    const numericAnswer = Number(answer);
    if (Number.isNaN(numericAnswer) || numericAnswer !== challenge.answer) {
      return res.status(400).json({ success: false, message: 'Incorrect captcha answer' });
    }

    const { start, end } = getTodayRange();
    const todayCount = await Transaction.countDocuments({
      user: req.user.id,
      type: 'earning',
      taskType: 'captcha',
      createdAt: { $gte: start, $lte: end }
    });

    if (todayCount >= 50) {
      return res.status(400).json({ success: false, message: 'Daily captcha limit reached' });
    }

    const user = await User.findById(req.user.id);
    const rewardCoins = 2;

    const balance = await recordEarning({
      user,
      amount: rewardCoins,
      taskType: 'captcha',
      description: 'Captcha solved'
    });

    res.json({
      success: true,
      coinsEarned: rewardCoins,
      balance,
      remaining: 50 - todayCount - 1
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing captcha task',
      error: error.message
    });
  }
});

// @route   POST /api/tasks/complete-daily-login
// @desc    Daily login reward with streaks
// @access  Private (Worker)
router.post('/complete-daily-login', protect, checkVerification, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { start, end } = getTodayRange();

    const alreadyClaimed = await Transaction.exists({
      user: user._id,
      type: 'earning',
      taskType: 'daily-login',
      createdAt: { $gte: start, $lte: end }
    });

    if (alreadyClaimed) {
      return res.status(400).json({ success: false, message: 'Already claimed today' });
    }

    const yesterday = new Date(start);
    yesterday.setDate(yesterday.getDate() - 1);

    let streak = 1;
    if (user.lastDailyTaskAt && user.lastDailyTaskAt >= yesterday && user.lastDailyTaskAt < start) {
      streak = user.streakCount + 1;
    }

    const baseReward = 10;
    const bonus = streak >= 7 ? 15 : streak >= 3 ? 5 : 0;
    const coinsEarned = baseReward + bonus;

    user.streakCount = streak;
    user.lastDailyTaskAt = new Date();

    const balance = await recordEarning({
      user,
      amount: coinsEarned,
      taskType: 'daily-login',
      description: 'Daily login reward'
    });

    res.json({
      success: true,
      coinsEarned,
      streakCount: streak,
      balance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing daily login',
      error: error.message
    });
  }
});

// @route   POST /api/tasks/complete-spin-wheel
// @desc    Spin wheel reward with daily limit
// @access  Private (Worker)
router.post('/complete-spin-wheel', protect, checkVerification, async (req, res) => {
  try {
    const { start, end } = getTodayRange();
    const spinsToday = await Transaction.countDocuments({
      user: req.user.id,
      type: 'earning',
      taskType: 'spin-wheel',
      createdAt: { $gte: start, $lte: end }
    });

    if (spinsToday >= 3) {
      return res.status(400).json({ success: false, message: 'No spins left for today' });
    }

    const PRIZES = [10, 20, 5, 50, 15, 100, 25, 30];
    const rewardCoins = PRIZES[Math.floor(Math.random() * PRIZES.length)];

    const user = await User.findById(req.user.id);
    const balance = await recordEarning({
      user,
      amount: rewardCoins,
      taskType: 'spin-wheel',
      description: 'Spin wheel reward'
    });

    res.json({
      success: true,
      coinsEarned: rewardCoins,
      balance,
      remaining: 3 - spinsToday - 1
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing spin wheel',
      error: error.message
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('creator', 'name email statistics.rating')
      .populate({
        path: 'submissions',
        populate: {
          path: 'worker',
          select: 'name email'
        }
      });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error.message
    });
  }
});

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private (Creator only)
router.post(
  '/',
  protect,
  authorize('creator', 'admin'),
  checkVerification,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('reward').isFloat({ min: 0 }).withMessage('Valid reward is required'),
    body('totalSlots').isInt({ min: 1 }).withMessage('Total slots must be at least 1'),
    body('category').optional().isIn(['data-entry', 'captcha', 'survey', 'content-writing', 'social-media', 'testing', 'other'])
  ],
  validate,
  async (req, res) => {
    try {
      const { title, description, reward, category, requirements, totalSlots, expiresAt } = req.body;

      const task = await Task.create({
        title,
        description,
        creator: req.user.id,
        reward,
        category,
        requirements,
        totalSlots,
        expiresAt,
        status: 'pending',
        isApproved: false
      });

      // Update user statistics
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 'statistics.tasksCreated': 1 }
      });

      res.status(201).json({
        success: true,
        message: 'Task created successfully. Waiting for admin approval.',
        task
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating task',
        error: error.message
      });
    }
  }
);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private (Creator/Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Only creator or admin can update
    if (task.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    const { title, description, reward, category, requirements, status, totalSlots } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (reward) task.reward = reward;
    if (category) task.category = category;
    if (requirements) task.requirements = requirements;
    if (status) task.status = status;
    if (totalSlots) {
      const usedSlots = task.totalSlots - task.availableSlots;
      task.totalSlots = totalSlots;
      task.availableSlots = Math.max(0, totalSlots - usedSlots);
    }

    await task.save();

    res.json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private (Creator/Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Only creator or admin can delete
    if (task.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
});

// @route   GET /api/tasks/:id/my-submission
// @desc    Check if user has submitted for this task
// @access  Private (Worker)
router.get('/:id/my-submission', protect, authorize('worker'), async (req, res) => {
  try {
    const submission = await Submission.findOne({
      task: req.params.id,
      worker: req.user.id
    });

    res.json({
      success: true,
      hasSubmitted: !!submission,
      submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking submission',
      error: error.message
    });
  }
});

export default router;
