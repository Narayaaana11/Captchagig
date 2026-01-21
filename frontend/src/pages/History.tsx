import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { earningsAPI } from "../lib/api";
import { Earning } from "../types";
import { formatCoins, formatDateTime } from "../lib/utils";
import {
  History as HistoryIcon,
  Filter,
  Loader2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export function History() {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTask, setFilterTask] = useState<string>("all");

  useEffect(() => {
    fetchEarnings();
  }, [filterStatus, filterTask]);

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filterStatus !== "all") params.status = filterStatus;
      if (filterTask !== "all") params.taskType = filterTask;
      const { items } = await earningsAPI.getHistory(params);
      const mapped: Earning[] = items.map((e: any) => {
        const status =
          e.status === "completed"
            ? "credited"
            : e.status === "pending"
            ? "pending"
            : "reversed";
        return {
          id: e._id,
          task_type: e.taskType,
          coins: e.coins ?? e.amount,
          status,
          description: e.description || "Earning",
          created_at: e.createdAt,
        } as Earning;
      });
      setEarnings(mapped);
    } catch (err) {
      console.error("Error fetching earnings:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "credited":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "reversed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case "daily_login":
      case "daily-login":
        return "📅";
      case "captcha":
        return "🛡️";
      case "spin_win":
      case "spin-wheel":
        return "🎡";
      case "referral":
        return "👥";
      case "signup_bonus":
        return "🎁";
      default:
        return "💰";
    }
  };

  const getTaskName = (taskType: string) => {
    switch (taskType) {
      case "daily_login":
      case "daily-login":
        return "Daily Login";
      case "captcha":
        return "Captcha";
      case "spin_win":
      case "spin-wheel":
        return "Spin & Win";
      case "referral":
        return "Referral Bonus";
      case "signup_bonus":
        return "Signup Bonus";
      default:
        return taskType;
    }
  };

  const totalCredited = earnings
    .filter((e) => e.status === "credited")
    .reduce((sum, e) => sum + e.coins, 0);

  const totalPending = earnings
    .filter((e) => e.status === "pending")
    .reduce((sum, e) => sum + e.coins, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Earnings History
          </h1>
          <p className="text-gray-600">
            Track all your earnings and transactions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-black rounded-2xl p-6 text-white shadow-lg border-2 border-gray-800">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5" />
              <p className="text-sm font-medium opacity-90">Total Credited</p>
            </div>
            <p className="text-4xl font-bold">{formatCoins(totalCredited)}</p>
            <p className="text-sm opacity-75 mt-1">Successfully earned</p>
          </div>

          <div className="bg-gray-100 rounded-2xl p-6 border-2 border-gray-300 shadow-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="h-5 w-5 text-gray-700" />
              <p className="text-sm font-medium text-gray-700">Pending</p>
            </div>
            <p className="text-4xl font-bold text-black">
              {formatCoins(totalPending)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Under review</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <HistoryIcon className="h-6 w-6 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">
                Transaction History
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="credited">Credited</option>
                  <option value="pending">Pending</option>
                  <option value="reversed">Reversed</option>
                </select>
              </div>

              <select
                value={filterTask}
                onChange={(e) => setFilterTask(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Tasks</option>
                <option value="daily-login">Daily Login</option>
                <option value="captcha">Captcha</option>
                <option value="spin-wheel">Spin & Win</option>
                <option value="referral">Referral</option>
                <option value="signup_bonus">Signup Bonus</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : earnings.length === 0 ? (
            <div className="text-center py-12">
              <HistoryIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No transactions found</p>
              <p className="text-sm text-gray-500 mt-1">
                Complete tasks to start earning coins
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {earnings.map((earning) => (
                <div
                  key={earning.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="text-3xl">
                        {getTaskIcon(earning.task_type || "")}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">
                          {getTaskName(earning.task_type || "")}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {earning.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDateTime(earning.created_at || "")}
                        </p>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-green-600">
                        +{formatCoins(earning.coins)}
                      </p>
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          earning.status
                        )}`}
                      >
                        {earning.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
