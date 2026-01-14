# CaptchGig - Task-Based Earning Platform

A production-ready, scalable platform where users earn virtual coins by completing tasks such as solving captchas, daily logins, spinning wheels, and referring friends. Coins can be converted to real money and withdrawn via UPI.

## Features

### User Features
- **Authentication**: Secure phone/OTP-based authentication via Supabase
- **Multiple Earning Tasks**:
  - Daily Login with streak bonuses
  - Captcha solving (up to 50 per day)
  - Spin & Win wheel (3 spins per day)
  - Refer & Earn program
- **Wallet Management**: Track earnings, balance, and withdrawals
- **Withdrawal System**: Convert coins to INR and withdraw via UPI
- **Earnings History**: Complete transaction log with filters
- **Real-time Updates**: Live wallet balance updates
- **Responsive Design**: Mobile-first, works on all devices

### Technical Features
- **Secure Architecture**: Row Level Security (RLS) on all database tables
- **Anti-Fraud Measures**: Daily limits, streak validation, task verification
- **Transaction Safety**: Atomic wallet updates
- **Scalable Backend**: Supabase Edge Functions for business logic
- **Type-Safe**: Full TypeScript implementation
- **Production Ready**: Built with industry best practices

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and optimized builds
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons

### Backend
- Supabase (PostgreSQL database)
- Supabase Auth (Phone/OTP authentication)
- Supabase Edge Functions (Deno runtime)
- Real-time subscriptions for wallet updates

## Project Structure

```
src/
├── components/
│   ├── tasks/
│   │   ├── DailyLoginTask.tsx
│   │   ├── CaptchaTask.tsx
│   │   ├── SpinWheelTask.tsx
│   │   └── ReferralTask.tsx
│   ├── Navbar.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── pages/
│   ├── Landing.tsx
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   ├── Wallet.tsx
│   └── History.tsx
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx

supabase/functions/
├── complete-daily-login/
├── complete-captcha/
├── complete-spin-win/
└── create-withdrawal/
```

## Database Schema

### Tables
- **profiles**: User profile data (wallet balance, streak, referral code)
- **tasks**: Task configuration and limits
- **user_tasks**: Task completion tracking
- **earnings**: Complete earnings history and audit trail
- **withdrawals**: Withdrawal requests and processing
- **referrals**: Referral tracking and rewards
- **system_config**: Platform configuration

## Task Details

### Daily Login
- Earn 10 coins per day
- Build streaks for bonus rewards:
  - 3 days: +5 coins
  - 7 days: +15 coins
  - 30 days: +50 coins
- Resets if you miss a day

### Captcha Solving
- Earn 2 coins per captcha
- Up to 50 captchas per day
- Simple math problems
- Instant verification

### Spin & Win
- 3 spins per day
- Win between 5-100 coins
- Animated wheel with 8 prize segments
- Random prize selection

### Refer & Earn
- Share unique referral link
- Earn 50 coins when referred friend completes first task
- Referred friend gets 20 coin signup bonus
- Unlimited referrals

## Withdrawal System

- **Minimum Withdrawal**: 100 coins (₹10)
- **Conversion Rate**: 1 coin = ₹0.10
- **Payment Method**: UPI
- **Processing Time**: 24-48 hours
- **Status Tracking**: Pending, Approved, Completed, Rejected

## Security Features

- Row Level Security (RLS) on all tables
- JWT-based authentication
- Daily task limits to prevent abuse
- Streak validation
- UPI ID validation
- Transaction-safe wallet updates
- Blocked account checking
- Device fingerprinting support

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Lint code
npm run lint
```

## Deployment

The application is designed to be deployed on any platform that supports:
- Node.js for the build process
- Static file hosting for the frontend
- Supabase for backend services

### Edge Functions
All Edge Functions are deployed to Supabase and handle:
- Task completion validation
- Coin rewards calculation
- Wallet balance updates
- Withdrawal request creation

## User Flow

1. User lands on landing page
2. Clicks "Start Earning" → Redirected to authentication
3. Enters phone number → Receives OTP
4. Verifies OTP → Profile created automatically
5. Redirected to Dashboard with available tasks
6. Completes tasks → Earns coins (live updates)
7. Views earnings history with detailed logs
8. Requests withdrawal via Wallet page
9. Receives payment to UPI ID

## Future Enhancements

- Admin dashboard for user management
- Withdrawal approval system
- Advanced fraud detection
- Rewarded video ads integration
- Offerwall partnerships
- Email notifications
- Push notifications
- Social media authentication
- Leaderboards
- Achievement badges

## License

Proprietary - All rights reserved

## Support

For issues or questions, please contact the development team.
