import { Navbar } from "../components/Navbar";
import { Card, CardContent } from "@/components/ui";
import { DailyLoginTask } from "../components/tasks/DailyLoginTask";
import { CaptchaTask } from "../components/tasks/CaptchaTask";
import { SpinWheelTask } from "../components/tasks/SpinWheelTask";
import { ReferralTask } from "../components/tasks/ReferralTask";
import { useAuth } from "../contexts/AuthContext";
import { TrendingUp, Flame } from "lucide-react";
import { formatCoins } from "../lib/utils";

export function Dashboard() {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground">
            Complete tasks to earn coins and withdraw real money
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Total Earned
                  </p>
                  <p className="text-2xl font-bold text-black">
                    {profile ? formatCoins(profile.totalEarned) : "0.00"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    All time earnings
                  </p>
                </div>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Available Balance
                  </p>
                  <p className="text-2xl font-bold text-black">
                    {profile ? formatCoins(profile.walletBalance) : "0.00"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Ready to withdraw
                  </p>
                </div>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Current Streak
                  </p>
                  <p className="text-2xl font-bold text-black">
                    {profile?.streakCount || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Days in a row</p>
                </div>
                <Flame className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Tasks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DailyLoginTask />
            <CaptchaTask />
            <SpinWheelTask />
            <ReferralTask />
          </div>
        </div>
      </div>
    </div>
  );
}
