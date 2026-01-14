import express from 'express';
import { body } from 'express-validator';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Submission from '../models/Submission.js';
import Transaction from '../models/Transaction.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/error.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  protect,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('skills').optional().isArray().withMessage('Skills must be an array')
  ],
  validate,
  async (req, res) => {
    try {
      const { name, skills } = req.body;

      const user = await User.findById(req.user.id);

      if (name) user.name = name;
      if (skills) user.skills = skills;

      await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating profile',
        error: error.message
      });
    }
  }
);

// @route   GET /api/users/wallet
// @desc    Get wallet details
// @access  Private
router.get('/wallet', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      wallet: user.wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching wallet',
      error: error.message
    });
  }
});

// @route   GET /api/users/transactions
// @desc    Get user transaction history
// @access  Private
router.get('/transactions', protect, async (req, res) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;
    
    const query = { user: req.user.id };
    
    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(query)
      .populate('relatedTask', 'title')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      transactions,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: transactions.length,
        totalTransactions: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
});

// @route   GET /api/users/task-history
// @desc    Get user's task history
// @access  Private
router.get('/task-history', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};
    
    if (req.user.role === 'worker') {
      query.worker = req.user.id;
      if (status) query.status = status;

      const skip = (page - 1) * limit;

      const submissions = await Submission.find(query)
        .populate('task', 'title reward category')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

      const total = await Submission.countDocuments(query);

      return res.json({
        success: true,
        history: submissions,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: submissions.length,
          totalTasks: total
        }
      });
    }

    if (req.user.role === 'creator') {
      query.creator = req.user.id;
      if (status) query.status = status;

      const skip = (page - 1) * limit;

      const tasks = await Task.find(query)
        .populate('submissions')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

      const total = await Task.countDocuments(query);

      return res.json({
        success: true,
        history: tasks,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: tasks.length,
          totalTasks: total
        }
      });
    }

    res.json({
      success: true,
      history: [],
      pagination: {
        current: 1,
        total: 0,
        count: 0,
        totalTasks: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task history',
      error: error.message
    });
  }
});

// @route   GET /api/users/statistics
// @desc    Get user statistics
// @access  Private
router.get('/statistics', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      statistics: user.statistics,
      wallet: user.wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// @route   GET /api/users/referrals
// @desc    Get user referrals
// @access  Private
router.get('/referrals', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('referrals.user', 'name email createdAt');
    
    res.json({
      success: true,
      referralCode: user.referralCode,
      referrals: user.referrals,
      totalReferrals: user.referrals.length,
      totalEarned: user.referrals.reduce((sum, ref) => sum + ref.earned, 0)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching referrals',
      error: error.message
    });
  }
});

// @route   POST /api/users/apply-referral
// @desc    Apply referral code
// @access  Private
router.post(
  '/apply-referral',
  protect,
  [
    body('referralCode').trim().notEmpty().withMessage('Referral code is required')
  ],
  validate,
  async (req, res) => {
    try {
      const { referralCode } = req.body;

      if (req.user.referredBy) {
        return res.status(400).json({
          success: false,
          message: 'You have already applied a referral code'
        });
      }

      const referrer = await User.findOne({ referralCode });

      if (!referrer) {
        return res.status(404).json({
          success: false,
          message: 'Invalid referral code'
        });
      }

      if (referrer._id.toString() === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'You cannot use your own referral code'
        });
      }

      // Pull fresh users with wallets
      const currentUser = await User.findById(req.user.id);
      const referrerFresh = await User.findById(referrer._id);

      // Update current user referral linkage
      currentUser.referredBy = referrerFresh._id;
      await currentUser.save();

      // Add to referrer's referrals
      referrerFresh.referrals.push({
        user: currentUser._id,
        earned: 0
      });
      await referrerFresh.save();

      // Give bonus to both
      const bonusAmount = 50; // align with UI messaging

      const currentBefore = currentUser.wallet.balance;
      const referrerBefore = referrerFresh.wallet.balance;

      currentUser.wallet.balance += bonusAmount;
      referrerFresh.wallet.balance += bonusAmount;
      await currentUser.save();
      await referrerFresh.save();

      // Create transactions
      await Transaction.create([
        {
          user: currentUser._id,
          type: 'bonus',
          amount: bonusAmount,
          status: 'completed',
          description: `Referral signup bonus`,
          balanceBefore: currentBefore,
          balanceAfter: currentBefore + bonusAmount,
          processedAt: new Date()
        },
        {
          user: referrerFresh._id,
          type: 'referral',
          amount: bonusAmount,
          status: 'completed',
          description: `Referral bonus - ${currentUser.name} joined`,
          balanceBefore: referrerBefore,
          balanceAfter: referrerBefore + bonusAmount,
          processedAt: new Date()
        }
      ]);

      res.json({
        success: true,
        message: `Referral code applied! You both received ${bonusAmount} coins bonus!`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error applying referral code',
        error: error.message
      });
    }
  }
);

export default router;
