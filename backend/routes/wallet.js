import express from 'express';
import { body } from 'express-validator';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { protect, checkVerification } from '../middleware/auth.js';
import { validate } from '../middleware/error.js';

const router = express.Router();

// @route   POST /api/wallet/withdraw
// @desc    Request withdrawal
// @access  Private
router.post(
  '/withdraw',
  protect,
  checkVerification,
  [
    body('amount').isFloat({ min: 100 }).withMessage('Minimum withdrawal amount is 100'),
    body('method').isIn(['upi', 'paypal', 'bank', 'crypto']).withMessage('Invalid withdrawal method'),
    body('account').trim().notEmpty().withMessage('Account details are required')
  ],
  validate,
  async (req, res) => {
    try {
      const { amount, method, account } = req.body;

      const user = await User.findById(req.user.id);

      if (user.wallet.balance < amount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance'
        });
      }

      // Deduct from wallet
      user.wallet.balance -= amount;
      await user.save();

      // Create withdrawal transaction
      const transaction = await Transaction.create({
        user: req.user.id,
        type: 'withdrawal',
        amount,
        status: 'pending',
        description: `Withdrawal request via ${method}`,
        withdrawalDetails: {
          method,
          account
        },
        balanceBefore: user.wallet.balance + amount,
        balanceAfter: user.wallet.balance
      });

      res.status(201).json({
        success: true,
        message: 'Withdrawal request submitted successfully. Pending admin approval.',
        transaction
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error processing withdrawal',
        error: error.message
      });
    }
  }
);

// @route   GET /api/wallet/withdrawals
// @desc    Get user's withdrawal history
// @access  Private
router.get('/withdrawals', protect, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const withdrawals = await Transaction.find({
      user: req.user.id,
      type: 'withdrawal'
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Transaction.countDocuments({ user: req.user.id, type: 'withdrawal' });

    res.json({
      success: true,
      withdrawals,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: withdrawals.length,
        totalItems: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching withdrawals',
      error: error.message
    });
  }
});

// @route   GET /api/wallet/balance
// @desc    Get wallet balance
// @access  Private
router.get('/balance', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      balance: user.wallet.balance,
      totalEarned: user.wallet.totalEarned,
      totalWithdrawn: user.wallet.totalWithdrawn
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching balance',
      error: error.message
    });
  }
});

// @route   GET /api/wallet/earnings
// @desc    Get earnings breakdown
// @access  Private
router.get('/earnings', protect, async (req, res) => {
  try {
    const earnings = await Transaction.find({
      user: req.user.id,
      type: 'earning',
      status: 'completed'
    })
      .populate('relatedTask', 'title category')
      .sort({ createdAt: -1 })
      .limit(50);

    const totalEarnings = earnings.reduce((sum, t) => sum + t.amount, 0);

    res.json({
      success: true,
      earnings,
      totalEarnings,
      count: earnings.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching earnings',
      error: error.message
    });
  }
});

// @route   GET /api/wallet/earnings-history
// @desc    Get earnings history with optional filters
// @access  Private
router.get('/earnings-history', protect, async (req, res) => {
  try {
    const { startDate, endDate, taskType, limit = 100 } = req.query;

    const query = {
      user: req.user.id,
      type: 'earning',
      status: 'completed'
    };

    if (taskType) {
      query.taskType = taskType;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const items = await Transaction.find(query)
      .populate('relatedTask', 'title category')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);
    const totalAmount = items.reduce((sum, t) => sum + t.amount, 0);

    res.json({
      success: true,
      items: items.map((item) => ({
        ...item.toObject(),
        coins: item.amount
      })),
      total,
      totalAmount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching earnings history',
      error: error.message
    });
  }
});

export default router;
