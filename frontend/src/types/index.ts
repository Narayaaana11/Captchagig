export interface Profile {
  id: string;
  name: string;
  email: string;
  walletBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  streakCount: number;
  referralCode?: string;
  isAdmin?: boolean;
  isBlocked?: boolean;
  createdAt?: string;
  lastLoginDate?: string | null;
  lastDailyTaskAt?: string | null;
}

export interface Task {
  id: string;
  task_type: string;
  name: string;
  description: string;
  reward_coins: number;
  daily_limit: number;
  cooldown_minutes: number;
  is_active: boolean;
  created_at: string;
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  task_type: string;
  coins_earned: number;
  completed_at: string;
  date: string;
  metadata: Record<string, unknown>;
}

export interface Earning {
  // Backend camelCase fields
  _id?: string;
  userId?: string;
  taskType?: string;
  coins: number;
  status: 'credited' | 'pending' | 'reversed';
  referenceId?: string | null;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  // Legacy snake_case fields (for Supabase-based screens)
  id?: string;
  user_id?: string;
  task_type?: string;
  reference_id?: string | null;
  created_at?: string;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  coins: number;
  amount_inr: number;
  upi_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  rejection_reason: string | null;
  processed_at: string | null;
  processed_by: string | null;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referee_id: string;
  reward_claimed: boolean;
  referee_first_task_completed: boolean;
  created_at: string;
}

export interface SystemConfig {
  key: string;
  value: Record<string, unknown>;
  description: string | null;
  updated_at: string;
}

export type TaskType = 'daily_login' | 'captcha' | 'spin_win' | 'referral';

export interface TaskCompletionResult {
  success: boolean;
  coins_earned?: number;
  message: string;
  streak_count?: number;
  new_balance?: number;
}
