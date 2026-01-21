import axios from 'axios';
import { io, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// WebSocket connection
let socket: Socket | null = null;

export const initializeSocket = (userId: string) => {
  if (!socket) {
    socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      socket?.emit('join', userId);
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });

    socket.on('notification', (notification) => {
      console.log('🔔 Notification received:', notification);
      // You can add toast notifications here
    });
  }
  return socket;
};

export const joinAdminRoom = (userId: string) => {
  if (socket) {
    socket.emit('joinAdmin', userId);
  }
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Interfaces
export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'worker' | 'creator' | 'admin';
  isVerified: boolean;
  isCaptchaVerified: boolean;
  isApproved: boolean;
  skills?: string[];
  wallet: {
    balance: number;
    totalEarned: number;
    totalWithdrawn: number;
  };
  statistics: {
    tasksCompleted: number;
    tasksCreated: number;
    successRate: number;
    rating: number;
    totalRatings: number;
  };
  referralCode?: string;
  referredBy?: string;
  isActive: boolean;
  createdAt?: string;
  lastLogin?: string;
  lastDailyTaskAt?: string;
  streakCount?: number;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  message?: string;
  user: User;
}

export interface Task {
  _id?: string;
  title: string;
  description: string;
  creator: string | User;
  category: 'data-entry' | 'captcha' | 'survey' | 'content-writing' | 'social-media' | 'testing' | 'other';
  reward: number;
  requirements?: {
    description?: string;
    skills?: string[];
    timeEstimate?: number;
    maxSubmissions?: number;
  };
  status: 'pending' | 'active' | 'paused' | 'completed' | 'rejected';
  isApproved: boolean;
  totalSlots: number;
  availableSlots: number;
  submissions?: string[] | Submission[];
  priority?: number;
  expiresAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Submission {
  _id?: string;
  task: string | Task;
  worker: string | User;
  proof: string;
  attachments?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  reviewedBy?: string | User;
  reviewedAt?: string;
  rejectionReason?: string;
  rating?: number;
  feedback?: string;
  reward: number;
  isPaid: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  _id?: string;
  user: string | User;
  type: 'earning' | 'withdrawal' | 'refund' | 'commission' | 'referral' | 'bonus';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  relatedTask?: string | Task;
  relatedSubmission?: string | Submission;
  withdrawalDetails?: {
    method: 'upi' | 'paypal' | 'bank' | 'crypto';
    account: string;
    transactionId?: string;
  };
  balanceBefore: number;
  balanceAfter: number;
  processedAt?: string;
  processedBy?: string | User;
  createdAt?: string;
}

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string, role: 'worker' | 'creator' = 'worker') => {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
      role,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get<{ success: boolean; user: User }>('/auth/me');
    return response.data;
  },

  verifyCaptcha: async () => {
    const response = await apiClient.post('/auth/verify-captcha');
    return response.data;
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.put('/auth/update-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await apiClient.get<{ success: boolean; user: User }>('/users/profile');
    return response.data;
  },

  updateProfile: async (data: { name?: string; skills?: string[] }) => {
    const response = await apiClient.put('/users/profile', data);
    return response.data;
  },

  getWallet: async () => {
    const response = await apiClient.get('/users/wallet');
    return response.data;
  },

  getTransactions: async (params?: { type?: string; status?: string; page?: number; limit?: number }) => {
    const response = await apiClient.get('/users/transactions', { params });
    return response.data;
  },

  getTaskHistory: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await apiClient.get('/users/task-history', { params });
    return response.data;
  },

  getStatistics: async () => {
    const response = await apiClient.get('/users/statistics');
    return response.data;
  },

  getReferrals: async () => {
    const response = await apiClient.get('/users/referrals');
    return response.data;
  },

  applyReferral: async (referralCode: string) => {
    const response = await apiClient.post('/users/apply-referral', { referralCode });
    return response.data;
  },
};

// Task API
export const taskAPI = {
  getTasks: async (params?: { status?: string; category?: string; page?: number; limit?: number }) => {
    const response = await apiClient.get<{ success: boolean; tasks: Task[] }>('/tasks', { params });
    return response.data;
  },

  getCaptchaChallenge: async () => {
    const response = await apiClient.get('/tasks/captcha-challenge');
    return response.data as { success: boolean; challengeId: string; question: string; ttl: number };
  },

  completeCaptcha: async (challengeId: string, answer: number | string) => {
    const response = await apiClient.post('/tasks/complete-captcha', { challengeId, answer });
    return response.data as { success: boolean; coinsEarned: number; balance: number; remaining: number };
  },

  completeDailyLogin: async () => {
    const response = await apiClient.post('/tasks/complete-daily-login');
    return response.data as { success: boolean; coinsEarned: number; streakCount: number; balance: number };
  },

  completeSpinWheel: async () => {
    const response = await apiClient.post('/tasks/complete-spin-wheel');
    return response.data as { success: boolean; coinsEarned: number; balance: number; remaining: number };
  },

  getTask: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; task: Task }>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: Partial<Task>) => {
    const response = await apiClient.post('/tasks', data);
    return response.data;
  },

  updateTask: async (id: string, data: Partial<Task>) => {
    const response = await apiClient.put(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string) => {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },

  getMySubmission: async (taskId: string) => {
    const response = await apiClient.get(`/tasks/${taskId}/my-submission`);
    return response.data;
  },
};

// Submission API
export const submissionAPI = {
  getSubmissions: async (params?: { status?: string; task?: string; page?: number; limit?: number }) => {
    const response = await apiClient.get<{ success: boolean; submissions: Submission[] }>('/submissions', { params });
    return response.data;
  },

  getSubmission: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; submission: Submission }>(`/submissions/${id}`);
    return response.data;
  },

  createSubmission: async (data: { task: string; proof: string; attachments?: string[] }) => {
    const response = await apiClient.post('/submissions', data);
    return response.data;
  },

  approveSubmission: async (id: string, data?: { rating?: number; feedback?: string }) => {
    const response = await apiClient.put(`/submissions/${id}/approve`, data);
    return response.data;
  },

  rejectSubmission: async (id: string, rejectionReason?: string) => {
    const response = await apiClient.put(`/submissions/${id}/reject`, { rejectionReason });
    return response.data;
  },
};

// Wallet API
export const walletAPI = {
  getBalance: async () => {
    const response = await apiClient.get('/wallet/balance');
    return response.data;
  },

  withdraw: async (amount: number, method: 'upi' | 'paypal' | 'bank' | 'crypto' = 'upi', account: string) => {
    const response = await apiClient.post('/wallet/withdraw', {
      amount,
      method,
      account,
    });
    return response.data;
  },

  getEarnings: async () => {
    const response = await apiClient.get('/wallet/earnings');
    return response.data;
  },

  getWithdrawals: async (params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get('/wallet/withdrawals', { params });
    return response.data;
  },
};

// Earnings API (filtered history)
export const earningsAPI = {
  getHistory: async (params?: { startDate?: string; endDate?: string; taskType?: string; limit?: number }) => {
    const response = await apiClient.get('/wallet/earnings-history', { params });
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async (params?: { role?: string; isApproved?: boolean; isActive?: boolean; page?: number; limit?: number }) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },

  approveUser: async (id: string) => {
    const response = await apiClient.put(`/admin/users/${id}/approve`);
    return response.data;
  },

  rejectUser: async (id: string, reason?: string) => {
    const response = await apiClient.put(`/admin/users/${id}/reject`, { reason });
    return response.data;
  },

  getTasks: async (params?: { isApproved?: boolean; status?: string; page?: number; limit?: number }) => {
    const response = await apiClient.get('/admin/tasks', { params });
    return response.data;
  },

  approveTask: async (id: string) => {
    const response = await apiClient.put(`/admin/tasks/${id}/approve`);
    return response.data;
  },

  rejectTask: async (id: string, reason?: string) => {
    const response = await apiClient.put(`/admin/tasks/${id}/reject`, { reason });
    return response.data;
  },

  getWithdrawals: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await apiClient.get('/admin/withdrawals', { params });
    return response.data;
  },

  approveWithdrawal: async (id: string, transactionId?: string) => {
    const response = await apiClient.put(`/admin/withdrawals/${id}/approve`, { transactionId });
    return response.data;
  },

  rejectWithdrawal: async (id: string, reason?: string) => {
    const response = await apiClient.put(`/admin/withdrawals/${id}/reject`, { reason });
    return response.data;
  },

  getLogs: async (params?: { action?: string; page?: number; limit?: number }) => {
    const response = await apiClient.get('/admin/logs', { params });
    return response.data;
  },
};

// Leaderboard API
export const leaderboardAPI = {
  getWorkers: async (sortBy: 'earnings' | 'tasks' | 'rating' = 'earnings', limit = 50) => {
    const response = await apiClient.get('/leaderboard/workers', { params: { sortBy, limit } });
    return response.data;
  },

  getCreators: async (limit = 50) => {
    const response = await apiClient.get('/leaderboard/creators', { params: { limit } });
    return response.data;
  },

  getMyRank: async () => {
    const response = await apiClient.get('/leaderboard/my-rank');
    return response.data;
  },
};

export default apiClient;
