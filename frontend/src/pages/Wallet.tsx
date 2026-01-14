import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { walletAPI } from "../lib/api";
import { Withdrawal } from "../types";
import {
  formatCoins,
  formatINR,
  formatDateTime,
  coinsToINR,
  validateUPI,
} from "../lib/utils";
import {
  Wallet as WalletIcon,
  TrendingDown,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react";

export function Wallet() {
  const { profile, refreshProfile } = useAuth();
  const [upiId, setUpiId] = useState("");
  const [coins, setCoins] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);

  const minWithdrawal = 100;
  const coinRate = 0.1;

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const data = await walletAPI.getWithdrawals();
      const withdrawalsRaw = data.withdrawals || [];
      const mapped: Withdrawal[] = withdrawalsRaw.map((w: any) => ({
        id: w._id,
        user_id: w.user,
        coins: w.amount,
        amount_inr: coinsToINR(w.amount, coinRate),
        upi_id: w.withdrawalDetails?.account || "—",
        status: w.status,
        rejection_reason: w.description?.includes("Rejected")
          ? w.description
          : null,
        processed_at: w.processedAt || null,
        processed_by: w.processedBy || null,
        created_at: w.createdAt,
      }));
      setWithdrawals(mapped);
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
    } finally {
      setLoadingWithdrawals(false);
    }
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateUPI(upiId)) {
      setError("Please enter a valid UPI ID (e.g., username@upi)");
      return;
    }

    const coinsValue = parseFloat(coins);
    if (isNaN(coinsValue) || coinsValue < minWithdrawal) {
      setError(`Minimum withdrawal is ${minWithdrawal} coins`);
      return;
    }

    if (coinsValue > (profile?.walletBalance || 0)) {
      setError("Insufficient balance");
      return;
    }

    setLoading(true);

    try {
      const data = await walletAPI.withdraw(coinsValue, "upi", upiId);
      setSuccess(
        `Withdrawal request submitted successfully! Amount: ${formatINR(
          coinsToINR(coinsValue, coinRate)
        )}`
      );
      setUpiId("");
      setCoins("");
      await refreshProfile();
      await fetchWithdrawals();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create withdrawal"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "approved":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet</h1>
          <p className="text-gray-600">
            Manage your earnings and withdraw funds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center space-x-2 mb-2">
              <WalletIcon className="h-5 w-5" />
              <p className="text-sm font-medium opacity-90">
                Available Balance
              </p>
            </div>
            <p className="text-4xl font-bold mb-1">
              {profile ? formatCoins(profile.walletBalance) : "0.00"}
            </p>
            <p className="text-sm opacity-75">
              ≈ {formatINR(coinsToINR(profile?.walletBalance || 0, coinRate))}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5" />
              <p className="text-sm font-medium opacity-90">Total Earned</p>
            </div>
            <p className="text-4xl font-bold mb-1">
              {profile ? formatCoins(profile.totalEarned) : "0.00"}
            </p>
            <p className="text-sm opacity-75">
              ≈ {formatINR(coinsToINR(profile?.totalEarned || 0, coinRate))}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="h-5 w-5" />
              <p className="text-sm font-medium opacity-90">Total Withdrawn</p>
            </div>
            <p className="text-4xl font-bold mb-1">
              {profile ? formatCoins(profile.totalWithdrawn) : "0.00"}
            </p>
            <p className="text-sm opacity-75">
              ≈ {formatINR(coinsToINR(profile?.totalWithdrawn || 0, coinRate))}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Withdraw Funds
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Withdrawal Info
                  </p>
                  <ul className="text-xs text-blue-700 mt-2 space-y-1">
                    <li>
                      • Minimum withdrawal: {minWithdrawal} coins (
                      {formatINR(coinsToINR(minWithdrawal, coinRate))})
                    </li>
                    <li>• Conversion rate: 1 coin = ₹{coinRate}</li>
                    <li>• Processing time: 24-48 hours</li>
                  </ul>
                </div>
              </div>
            </div>

            <form onSubmit={handleWithdrawal} className="space-y-4">
              <div>
                <label
                  htmlFor="upi"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  UPI ID
                </label>
                <input
                  id="upi"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="coins"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Amount (Coins)
                </label>
                <input
                  id="coins"
                  type="number"
                  value={coins}
                  onChange={(e) => setCoins(e.target.value)}
                  placeholder={`Min. ${minWithdrawal} coins`}
                  min={minWithdrawal}
                  max={profile?.walletBalance}
                  step="1"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                {coins && !isNaN(parseFloat(coins)) && (
                  <p className="text-sm text-gray-600 mt-2">
                    You will receive:{" "}
                    {formatINR(coinsToINR(parseFloat(coins), coinRate))}
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700 font-medium">
                    {success}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Submit Withdrawal Request</span>
                )}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Withdrawal History
            </h2>

            {loadingWithdrawals ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : withdrawals.length === 0 ? (
              <div className="text-center py-12">
                <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No withdrawals yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {withdrawals.map((withdrawal) => (
                  <div
                    key={withdrawal.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-900">
                          {formatCoins(withdrawal.coins)} coins
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatINR(withdrawal.amount_inr)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          withdrawal.status
                        )}`}
                      >
                        {withdrawal.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      UPI: {withdrawal.upi_id}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDateTime(withdrawal.created_at)}
                    </p>
                    {withdrawal.rejection_reason && (
                      <p className="text-xs text-red-600 mt-2">
                        Reason: {withdrawal.rejection_reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
