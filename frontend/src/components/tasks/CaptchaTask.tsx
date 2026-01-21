import { useState, useEffect } from "react";
import { Shield, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { taskAPI, earningsAPI } from "../../lib/api";
import "./captcha.css";

export function CaptchaTask() {
  const { refreshProfile } = useAuth();
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [todayCount, setTodayCount] = useState(0);
  const [dailyLimit, setDailyLimit] = useState<number>(50);
  const [challenge, setChallenge] = useState<{
    id: string;
    question: string;
  } | null>(null);

  useEffect(() => {
    fetchTodayCount();
    fetchTaskConfig();
    loadChallenge();
  }, []);

  const loadChallenge = async () => {
    try {
      const data = await taskAPI.getCaptchaChallenge();
      setChallenge({ id: data.challengeId, question: data.question });
      setAnswer("");
      setError("");
      setMessage("");
    } catch (err) {
      setError("Unable to load captcha. Please retry.");
    }
  };

  const fetchTodayCount = async () => {
    try {
      const today = new Date();
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const { items } = await earningsAPI.getHistory({
        taskType: "captcha",
        startDate: start.toISOString(),
      });
      setTodayCount(items.length);
    } catch (err) {
      console.error("Error fetching count:", err);
    }
  };

  const fetchTaskConfig = async () => {
    try {
      const resp = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000/api"
        }/tasks/configs`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
          },
        }
      );
      const tasks = await resp.json();
      const captchaTask = tasks.find((t: any) => t.taskType === "captcha");
      if (captchaTask) setDailyLimit(captchaTask.dailyLimit);
    } catch (err) {
      console.error("Error fetching task config:", err);
    }
  };

  const regenerateCaptcha = () => {
    loadChallenge();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (todayCount >= dailyLimit) {
      setError("Daily limit reached. Try again tomorrow!");
      return;
    }

    if (!answer.trim()) {
      setError("Please enter the captcha");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (!challenge) {
        throw new Error("Captcha not ready yet. Please refresh.");
      }

      const data = await taskAPI.completeCaptcha(challenge.id, answer.trim());
      setMessage(`Success! Earned ${data.coinsEarned} coins`);
      setTodayCount((prev) => prev + 1);
      await refreshProfile();
      regenerateCaptcha();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
      regenerateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const remaining = dailyLimit - todayCount;

  return (
    <div className="card-modern">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-black p-3 rounded-xl">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Solve Captcha</h3>
            <p className="text-sm text-gray-600">Earn 2 coins per captcha</p>
          </div>
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
          <span className="text-sm font-bold text-black">
            {remaining}/{dailyLimit}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border-2 border-black rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-gray-700">
              Solve the math challenge:
            </p>
            <button
              type="button"
              onClick={regenerateCaptcha}
              className="text-black hover:text-gray-700 transition-colors transform hover:scale-110 duration-200"
              title="Refresh Captcha"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white px-6 py-4 rounded-lg border-2 border-purple-100 shadow-sm text-2xl font-bold text-gray-800">
              {challenge?.question || "..."}
            </div>

            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer"
              className="w-full text-center text-lg font-medium border-2 border-purple-200 bg-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all"
              disabled={loading || remaining === 0}
              required
            />
          </div>
        </div>

        {message && (
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
            <p className="text-sm text-green-700 font-semibold">{message}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
            <p className="text-sm text-red-600 font-semibold">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || remaining === 0 || !answer}
          className="w-full bg-black text-white py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-gray-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : remaining === 0 ? (
            <span>Daily Limit Reached</span>
          ) : (
            <span>Submit Answer</span>
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-4">
        {remaining > 0
          ? `${remaining} captcha${remaining !== 1 ? "s" : ""} remaining today`
          : "Come back tomorrow for more!"}
      </p>
    </div>
  );
}
