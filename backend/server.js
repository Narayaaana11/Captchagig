import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/error.js';

// Import routes
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import submissionRoutes from './routes/submissions.js';
import userRoutes from './routes/users.js';
import walletRoutes from './routes/wallet.js';
import adminRoutes from './routes/admin.js';
import leaderboardRoutes from './routes/leaderboard.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Resolve client origin from environment
const CLIENT_ORIGIN = process.env.CLIENT_URL || 'https://captchagig-m6dgse5ui-erens-projects-bfd14c7f.vercel.app/';

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect to database
connectDB();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Make io accessible to routes
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join user-specific room
  socket.on('join', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Join admin room
  socket.on('joinAdmin', (userId) => {
    socket.join('admin');
    console.log(`Admin ${userId} joined admin room`);
  });

  // Handle real-time events
  socket.on('taskStarted', (data) => {
    io.to(`user:${data.userId}`).emit('taskUpdate', {
      type: 'started',
      taskId: data.taskId,
      timestamp: new Date()
    });
  });

  socket.on('submissionCreated', (data) => {
    io.to(`user:${data.userId}`).emit('submissionUpdate', {
      type: 'created',
      submissionId: data.submissionId,
      status: data.status,
      timestamp: new Date()
    });
  });

  socket.on('leaderboardUpdated', (data) => {
    io.emit('leaderboardUpdate', {
      type: 'updated',
      data: data,
      timestamp: new Date()
    });
  });

  socket.on('walletUpdated', (data) => {
    io.to(`user:${data.userId}`).emit('walletUpdate', {
      type: 'updated',
      balance: data.balance,
      transaction: data.transaction,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Helper function to emit notifications
export const emitNotification = (io, userId, notification) => {
  io.to(`user:${userId}`).emit('notification', notification);
};

export const emitAdminNotification = (io, notification) => {
  io.to('admin').emit('adminNotification', notification);
};

// API Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CaptchaGig API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      submissions: '/api/submissions',
      users: '/api/users',
      wallet: '/api/wallet',
      admin: '/api/admin',
      leaderboard: '/api/leaderboard'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log('Server started');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Port: ${PORT}`);
  console.log(`Client URL: ${process.env.CLIENT_URL ? process.env.CLIENT_URL : 'not set (using default)'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  httpServer.close(() => process.exit(1));
});

export { io };
export default app;
