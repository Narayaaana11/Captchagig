import { useState } from "react";
import { Calendar, Flame, Gift, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { taskAPI } from "../../lib/api";

export function DailyLoginTask() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const canClaim = () => {
    if (!profile?.lastDailyTaskAt) return true;

    const lastReward = new Date(profile.lastDailyTaskAt);
    const today = new Date();

    return (
      lastReward.getDate() !== today.getDate() ||
      lastReward.getMonth() !== today.getMonth() ||
      lastReward.getFullYear() !== today.getFullYear()
    );
  };

  const handleClaim = async () => {
    if (!canClaim()) {
      setError("Already claimed today. Come back tomorrow!");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await taskAPI.completeDailyLogin();
      setMessage(
        `Success! Earned ${data.coinsEarned} coins. Streak: ${data.streakCount} days`
      );
      await refreshProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim reward");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-black p-3 rounded-xl">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Daily Login</h3>
            <p className="text-sm text-gray-600">Claim your daily reward</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 bg-orange-100 px-3 py-1 rounded-full">
          <Flame className="h-4 w-4 text-orange-600" />
          <span className="text-sm font-bold text-orange-600">
            {profile?.streakCount || 0}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Base Reward</span>
          <span className="font-bold text-orange-600">10 coins</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Streak Bonus</span>
          <div className="flex items-center space-x-1">
            <Gift className="h-4 w-4 text-orange-600" />
            <span className="font-bold text-orange-600">
              {profile?.streakCount && profile.streakCount >= 7
                ? "+15"
                : profile?.streakCount && profile.streakCount >= 3
                ? "+5"
                : "0"}{" "}
              coins
            </span>
          </div>
        </div>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-green-700 font-medium">{message}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        onClick={handleClaim}
        disabled={loading || !canClaim()}
        className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Claiming...</span>
          </>
        ) : canClaim() ? (
          <span>Claim Daily Reward</span>
        ) : (
          <span>Claimed Today</span>
        )}
      </button>

      {profile?.streakCount ? (
        <p className="text-xs text-gray-500 text-center mt-3">
          Keep your streak alive! Next milestone:{" "}
          {profile.streakCount < 3 ? 3 : profile.streakCount < 7 ? 7 : 30} days
        </p>
      ) : null}
    </div>
  );
}
