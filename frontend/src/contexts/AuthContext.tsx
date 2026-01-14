import { createContext, useContext, useEffect, useState } from "react";
import { authAPI, userAPI, type User } from "../lib/api";
import type { Profile } from "../types";

interface AuthContextType {
  profile: Profile | null;
  loading: boolean;
  register: (
    name: string,
    email: string,
    password: string,
    referralCode?: string | null
  ) => Promise<{ error: Error | null }>;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setProfile(null);
      return;
    }

    try {
      const resp = await authAPI.getProfile();
      const user: User = resp.user;
      const normalized: Profile = {
        id: user.id || user._id || "",
        name: user.name,
        email: user.email,
        walletBalance: user.wallet?.balance ?? 0,
        totalEarned: user.wallet?.totalEarned ?? 0,
        totalWithdrawn: user.wallet?.totalWithdrawn ?? 0,
        streakCount: (user as any).streakCount ?? 0,
        referralCode: user.referralCode,
        isAdmin: (user as any).isAdmin || user.role === "admin",
        createdAt: user.createdAt,
        lastLoginDate: user.lastLogin as string | undefined,
        lastDailyTaskAt: (user as any).lastDailyTaskAt || null,
      };
      setProfile(normalized);
    } catch (error) {
      setProfile(null);
      console.error("Error fetching profile:", error);
      localStorage.removeItem("authToken");
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // In future, we can connect WebSocket for live wallet updates

  const register = async (
    name: string,
    email: string,
    password: string,
    referralCode?: string | null
  ) => {
    try {
      const resp = await authAPI.register(name, email, password, "worker");
      localStorage.setItem("authToken", resp.token);
      if (referralCode) {
        try {
          await userAPI.applyReferral(referralCode);
        } catch (err) {
          console.warn("Referral apply failed:", err);
        }
      }
      await fetchProfile();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const resp = await authAPI.login(email, password);
      localStorage.setItem("authToken", resp.token);
      await fetchProfile();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("authToken");
    setProfile(null);
  };

  const value = {
    profile,
    loading,
    register,
    login,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
