import express from 'express';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Submission from '../models/Submission.js';
import Transaction from '../models/Transaction.js';
import AdminLog from '../models/AdminLog.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin role
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWorkers = await User.countDocuments({ role: 'worker' });
    const totalCreators = await User.countDocuments({ role: 'creator' });
    const pendingUsers = await User.countDocuments({ isApproved: false });
    
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ isApproved: false });
    const activeTasks = await Task.countDocuments({ status: 'active', isApproved: true });
    
    const totalSubmissions = await Submission.countDocuments();
    const pendingSubmissions = await Submission.countDocuments({ status: 'pending' });
    
    const pendingWithdrawals = await Transaction.countDocuments({ 
      type: 'withdrawal', 
      status: 'pending' 
    });

    const totalEarnings = await Transaction.aggregate([
      { $match: { type: 'commission', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const platformRevenue = totalEarnings.length > 0 ? totalEarnings[0].total : 0;

    res.json({
      success: true,
      statistics: {
        users: {
          total: totalUsers,
          workers: totalWorkers,
          creators: totalCreators,
          pending: pendingUsers
        },
        tasks: {
          total: totalTasks,
          pending: pendingTasks,
          active: activeTasks
        },
        submissions: {
          total: totalSubmissions,
          pending: pendingSubmissions
        },
        withdrawals: {
          pending: pendingWithdrawals
        },
        revenue: {
          total: platformRevenue
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with filters
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
  try {
    const { role, isApproved, isActive, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: users.length,
        totalUsers: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/users/:id/approve
// @desc    Approve user
// @access  Private (Admin only)
router.put('/users/:id/approve', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await AdminLog.create({
      admin: req.user.id,
      action: 'approve_user',
      targetUser: user._id,
      description: `Approved user: ${user.email}`
    });

    res.json({
      success: true,
      message: 'User approved successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving user',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/users/:id/reject
// @desc    Reject/Ban user
// @access  Private (Admin only)
router.put('/users/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: false, isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await AdminLog.create({
      admin: req.user.id,
      action: 'reject_user',
      targetUser: user._id,
      description: `Rejected/Banned user: ${user.email}`,
      metadata: { reason }
    });

    res.json({
      success: true,
      message: 'User rejected/banned successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting user',
      error: error.message
    });
  }
});

// @route   GET /api/admin/tasks
// @desc    Get all tasks
// @access  Private (Admin only)
router.get('/tasks', async (req, res) => {
  try {
    const { isApproved, status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';
    if (status) query.status = status;

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

// @route   PUT /api/admin/tasks/:id/approve
// @desc    Approve task
// @access  Private (Admin only)
router.put('/tasks/:id/approve', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, status: 'active', approvedBy: req.user.id },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await AdminLog.create({
      admin: req.user.id,
      action: 'approve_task',
      targetTask: task._id,
      description: `Approved task: ${task.title}`
    });

    res.json({
      success: true,
      message: 'Task approved successfully',
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving task',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/tasks/:id/reject
// @desc    Reject task
// @access  Private (Admin only)
router.put('/tasks/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { isApproved: false, status: 'rejected', rejectionReason: reason },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await AdminLog.create({
      admin: req.user.id,
      action: 'reject_task',
      targetTask: task._id,
      description: `Rejected task: ${task.title}`,
      metadata: { reason }
    });

    res.json({
      success: true,
      message: 'Task rejected successfully',
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting task',
      error: error.message
    });
  }
});

// @route   GET /api/admin/withdrawals
// @desc    Get all withdrawal requests
// @access  Private (Admin only)
router.get('/withdrawals', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = { type: 'withdrawal' };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const withdrawals = await Transaction.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      withdrawals,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: withdrawals.length,
        totalWithdrawals: total
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

// @route   PUT /api/admin/withdrawals/:id/approve
// @desc    Approve withdrawal
// @access  Private (Admin only)
router.put('/withdrawals/:id/approve', async (req, res) => {
  try {
    const { transactionId } = req.body;

    const withdrawal = await Transaction.findById(req.params.id).populate('user');

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    withdrawal.status = 'completed';
    withdrawal.processedAt = new Date();
    withdrawal.processedBy = req.user.id;
    if (transactionId) {
      withdrawal.withdrawalDetails.transactionId = transactionId;
    }
    await withdrawal.save();

    // Update user's total withdrawn
    const user = withdrawal.user;
    user.wallet.totalWithdrawn += withdrawal.amount;
    await user.save();

    await AdminLog.create({
      admin: req.user.id,
      action: 'process_withdrawal',
      targetUser: user._id,
      description: `Approved withdrawal of ${withdrawal.amount} for ${user.email}`
    });

    res.json({
      success: true,
      message: 'Withdrawal approved successfully',
      withdrawal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving withdrawal',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/withdrawals/:id/reject
// @desc    Reject withdrawal
// @access  Private (Admin only)
router.put('/withdrawals/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;

    const withdrawal = await Transaction.findById(req.params.id).populate('user');

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    withdrawal.status = 'failed';
    withdrawal.processedAt = new Date();
    withdrawal.processedBy = req.user.id;
    withdrawal.description += ` (Rejected: ${reason})`;
    await withdrawal.save();

    // Refund to user wallet
    const user = withdrawal.user;
    user.wallet.balance += withdrawal.amount;
    await user.save();

    // Create refund transaction
    await Transaction.create({
      user: user._id,
      type: 'refund',
      amount: withdrawal.amount,
      status: 'completed',
      description: `Refund for rejected withdrawal`,
      balanceBefore: user.wallet.balance - withdrawal.amount,
      balanceAfter: user.wallet.balance,
      processedAt: new Date(),
      processedBy: req.user.id
    });

    await AdminLog.create({
      admin: req.user.id,
      action: 'process_withdrawal',
      targetUser: user._id,
      description: `Rejected withdrawal of ${withdrawal.amount} for ${user.email}`,
      metadata: { reason }
    });

    res.json({
      success: true,
      message: 'Withdrawal rejected and amount refunded',
      withdrawal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting withdrawal',
      error: error.message
    });
  }
});

// @route   GET /api/admin/logs
// @desc    Get admin activity logs
// @access  Private (Admin only)
router.get('/logs', async (req, res) => {
  try {
    const { action, page = 1, limit = 50 } = req.query;
    
    const query = {};
    if (action) query.action = action;

    const skip = (page - 1) * limit;

    const logs = await AdminLog.find(query)
      .populate('admin', 'name email')
      .populate('targetUser', 'name email')
      .populate('targetTask', 'title')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await AdminLog.countDocuments(query);

    res.json({
      success: true,
      logs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: logs.length,
        totalLogs: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching logs',
      error: error.message
    });
  }
});

export default router;
