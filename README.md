# CaptchaGig - Production Ready Earnings Platform

A full-stack web application where users earn real money by completing simple tasks like solving captchas, daily logins, spinning wheels, and referrals.

## 🚀 Tech Stack

### Backend

- Node.js + Express.js
- MongoDB (Mongoose ORM)
- WebSocket (Socket.io) for real-time updates
- JWT Authentication
- BCrypt for password hashing

### Frontend

- React 18 + TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Axios for HTTP requests
- Socket.io-client for WebSocket connection

## 📋 Prerequisites

- Node.js 16+ and npm
- MongoDB (local or MongoDB Atlas)
- Git

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Captchagig
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=http://localhost:5000
VITE_APP_NAME=CaptchaGig
VITE_MIN_WITHDRAWAL=100
VITE_COIN_TO_INR_RATE=0.1
```

Start the frontend:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🎯 Features

### For Users

- ✅ **Daily Login Rewards** - Earn coins every day with streak bonuses
- ✅ **Captcha Tasks** - Solve simple math problems (up to 50/day)
- ✅ **Spin & Win** - Lucky wheel with prizes (3 spins/day)
- ✅ **Referral System** - Earn 50 coins per successful referral
- ✅ **Wallet Management** - Track earnings and withdrawals
- ✅ **UPI Withdrawals** - Convert coins to INR (100 coins = ₹10)
- ✅ **Real-time Updates** - WebSocket powered live notifications

### For Admins

- ✅ Admin dashboard with statistics
- ✅ User management
- ✅ Withdrawal approval system
- ✅ Transaction monitoring

## 📱 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Tasks

- `GET /api/tasks/captcha/challenge` - Get new captcha challenge
- `POST /api/tasks/captcha/verify` - Verify captcha answer
- `POST /api/tasks/daily-login` - Claim daily login reward
- `POST /api/tasks/spin-wheel` - Spin the wheel

### Wallet

- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/withdraw` - Request withdrawal
- `GET /api/wallet/withdrawals` - Get withdrawal history
- `GET /api/wallet/transactions` - Get transaction history

### Admin

- `GET /api/admin/dashboard` - Get admin dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/withdrawals/:id` - Approve/reject withdrawal

## 🔒 Security Features

- JWT-based authentication
- Password hashing with BCrypt
- Protected API routes
- Input validation
- CORS configuration
- Environment variable protection

## 💰 Earning System

### Task Rewards

- **Daily Login**: 10 coins base + streak bonus
  - 3-day streak: +5 coins
  - 7-day streak: +15 coins
- **Captcha**: 2 coins per solve (max 50/day)
- **Spin Wheel**: 5-100 coins random (3/day)
- **Referral**: 50 coins per active referral

### Withdrawal

- Minimum: 100 coins (₹10)
- Rate: 1 coin = ₹0.10
- Method: UPI only
- Processing: Admin approval required

## 🚀 Production Deployment

### Backend Deployment (Recommended: Railway/Render)

1. Set environment variables
2. Deploy from GitHub
3. Update MongoDB to production cluster

### Frontend Deployment (Recommended: Vercel/Netlify)

1. Set environment variables
2. Connect GitHub repo
3. Deploy with automatic builds

### Environment Variables for Production

**Backend:**

- `MONGODB_URI` - Production MongoDB URI
- `JWT_SECRET` - Strong secret key
- `CLIENT_URL` - Production frontend URL
- `NODE_ENV=production`

**Frontend:**

- `VITE_API_URL` - Production API URL
- `VITE_WS_URL` - Production WebSocket URL

## 📊 Database Schema

### User Model

- Personal info (name, email, password)
- Wallet (balance, totalEarned, totalWithdrawn)
- Statistics (tasksCompleted, successRate, rating)
- Referral system
- Streak tracking

### Transaction Model

- Type (earning, withdrawal, refund, bonus)
- Amount and status
- Related task/submission
- Withdrawal details (UPI ID, transaction ID)

### Task/Submission Models

- Task management
- Submission tracking
- Approval workflow

## 🧪 Testing

Run backend tests:

```bash
cd backend
npm test
```

Run frontend tests:

```bash
cd frontend
npm test
```

## 📝 License

This project is proprietary software.

## 👨‍💻 Developer

Developed by **IndentDev**

---

## 🔍 Troubleshooting

### MongoDB Connection Error

- Verify MongoDB is running
- Check connection string in `.env`
- Whitelist your IP in MongoDB Atlas

### CORS Errors

- Ensure `CLIENT_URL` in backend `.env` matches frontend URL
- Check CORS configuration in `server.js`

### WebSocket Not Connecting

- Verify `VITE_WS_URL` matches backend URL
- Check firewall settings

## 📞 Support

For issues and questions, contact: support@captchagig.com
