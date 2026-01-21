import { useState, useEffect } from "react";
import { Disc3, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { taskAPI, earningsAPI } from "../../lib/api";

const PRIZES = [10, 20, 5, 50, 15, 100, 25, 30];

export function SpinWheelTask() {
  const { refreshProfile } = useAuth();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [todayCount, setTodayCount] = useState(0);
  const [dailyLimit, setDailyLimit] = useState<number>(3);

  useEffect(() => {
    fetchTodayCount();
    fetchTaskConfig();
  }, []);

  const fetchTodayCount = async () => {
    try {
      const today = new Date();
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const { items } = await earningsAPI.getHistory({
        taskType: "spin-wheel",
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
      const spinTask = tasks.find((t: any) => t.taskType === "spin-wheel");
      if (spinTask) setDailyLimit(spinTask.dailyLimit);
    } catch (err) {
      console.error("Error fetching task config:", err);
    }
  };

  const handleSpin = async () => {
    if (todayCount >= dailyLimit) {
      setError("Daily limit reached. Come back tomorrow!");
      return;
    }

    setSpinning(true);
    setError("");
    setMessage("");

    try {
      const data = await taskAPI.completeSpinWheel();
      const wonPrize = data.coinsEarned;
      const targetRotation = 360 * 5 + Math.random() * 360;
      setRotation(targetRotation);

      setTimeout(() => {
        setMessage(`Congratulations! You won ${wonPrize} coins!`);
        setTodayCount((prev) => prev + 1);
        refreshProfile();
        setSpinning(false);
      }, 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to spin");
      setSpinning(false);
    }
  };

  const remaining = dailyLimit - todayCount;

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-black p-3 rounded-xl">
            <Disc3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Spin & Win</h3>
            <p className="text-sm text-gray-600">Try your luck!</p>
          </div>
        </div>
        <div className="bg-purple-100 px-3 py-1 rounded-full">
          <span className="text-sm font-bold text-purple-600">
            {remaining}/{dailyLimit}
          </span>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="aspect-square max-w-xs mx-auto relative">
          <div
            className="absolute inset-0 rounded-full border-8 border-white shadow-2xl overflow-hidden"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                : "none",
            }}
          >
            {PRIZES.map((amount, index) => {
              const angle = (360 / PRIZES.length) * index;
              const hue = (360 / PRIZES.length) * index;
              return (
                <div
                  key={index}
                  className="absolute inset-0 origin-center"
                  style={{
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[100px] border-r-[100px] border-t-[150px] border-l-transparent border-r-transparent"
                    style={{
                      borderTopColor: `hsl(${hue}, 70%, 60%)`,
                    }}
                  >
                    <div
                      className="absolute -top-28 left-1/2 -translate-x-1/2 font-bold text-white text-lg"
                      style={{
                        transform: "rotate(0deg)",
                      }}
                    >
                      {amount}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-red-500" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-full w-16 h-16 shadow-lg flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-green-700 font-medium text-center">
            {message}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-600 text-center">{error}</p>
        </div>
      )}

      <button
        onClick={handleSpin}
        disabled={spinning || remaining === 0}
        className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
      >
        {spinning ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Spinning...</span>
          </>
        ) : remaining === 0 ? (
          <span>No Spins Left</span>
        ) : (
          <>
            <Disc3 className="h-5 w-5" />
            <span>Spin Now</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        {remaining > 0
          ? `${remaining} spin${remaining !== 1 ? "s" : ""} remaining today`
          : "Come back tomorrow for more spins!"}
      </p>
    </div>
  );
}
