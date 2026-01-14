import express from 'express';
import User from '../models/User.js';
import Submission from '../models/Submission.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/leaderboard/workers
// @desc    Get top workers by earnings/tasks
// @access  Public
router.get('/workers', async (req, res) => {
  try {
    const { sortBy = 'earnings', limit = 50 } = req.query;

    let sortField = 'wallet.totalEarned';
    if (sortBy === 'tasks') sortField = 'statistics.tasksCompleted';
    if (sortBy === 'rating') sortField = 'statistics.rating';

    const workers = await User.find({ 
      role: 'worker',
      isActive: true,
      isApproved: true
    })
      .select('name statistics wallet createdAt')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));

    const leaderboard = workers.map((worker, index) => ({
      rank: index + 1,
      name: worker.name,
      tasksCompleted: worker.statistics.tasksCompleted,
      totalEarned: worker.wallet.totalEarned,
      rating: worker.statistics.rating,
      successRate: worker.statistics.successRate,
      joinedAt: worker.createdAt
    }));

    res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
});

// @route   GET /api/leaderboard/creators
// @desc    Get top creators
// @access  Public
router.get('/creators', async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const creators = await User.find({ 
      role: 'creator',
      isActive: true,
      isApproved: true
    })
      .select('name statistics createdAt')
      .sort({ 'statistics.tasksCreated': -1 })
      .limit(parseInt(limit));

    const leaderboard = creators.map((creator, index) => ({
      rank: index + 1,
      name: creator.name,
      tasksCreated: creator.statistics.tasksCreated,
      rating: creator.statistics.rating,
      joinedAt: creator.createdAt
    }));

    res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching creators leaderboard',
      error: error.message
    });
  }
});

// @route   GET /api/leaderboard/my-rank
// @desc    Get current user's rank
// @access  Private
router.get('/my-rank', protect, async (req, res) => {
  try {
    if (req.user.role === 'worker') {
      const workersAbove = await User.countDocuments({
        role: 'worker',
        isActive: true,
        'wallet.totalEarned': { $gt: req.user.wallet.totalEarned }
      });

      return res.json({
        success: true,
        rank: workersAbove + 1,
        stats: {
          tasksCompleted: req.user.statistics.tasksCompleted,
          totalEarned: req.user.wallet.totalEarned,
          rating: req.user.statistics.rating
        }
      });
    }

    if (req.user.role === 'creator') {
      const creatorsAbove = await User.countDocuments({
        role: 'creator',
        isActive: true,
        'statistics.tasksCreated': { $gt: req.user.statistics.tasksCreated }
      });

      return res.json({
        success: true,
        rank: creatorsAbove + 1,
        stats: {
          tasksCreated: req.user.statistics.tasksCreated,
          rating: req.user.statistics.rating
        }
      });
    }

    res.json({
      success: true,
      message: 'Leaderboard not applicable for your role'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching rank',
      error: error.message
    });
  }
});

export default router;
