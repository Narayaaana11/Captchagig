import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function Auth() {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (mode === "register") {
      if (!name.trim()) {
        setError("Please enter your name");
        return;
      }
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        const { error } = await register(
          name.trim(),
          email.trim(),
          password,
          referralCode
        );
        if (error) throw error;
      } else {
        const { error } = await login(email.trim(), password);
        if (error) throw error;
      }
      navigate("/dashboard");
    } catch (err) {
      setError("Authentication failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="bg-black p-3 rounded-xl">
              <img src="/coins.svg" alt="CaptchaGig" className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold text-black">CaptchaGig</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === "login" ? "Welcome Back" : "Create your account"}
          </h1>
          <p className="text-gray-600">
            {mode === "login"
              ? "Login with your email and password"
              : "Sign up with name, email and password"}
          </p>
        </div>

        {referralCode && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-green-800 font-medium">
              You've been referred! Get 20 bonus coins on signup.
            </p>
            <p className="text-xs text-green-600 mt-1">
              Referral Code: {referralCode}
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "register" && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {mode === "register"
                  ? "Use at least 6 characters"
                  : "Enter your account password"}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>
                    {mode === "login" ? "Logging in..." : "Creating account..."}
                  </span>
                </>
              ) : (
                <span>{mode === "login" ? "Login" : "Sign Up"}</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              disabled={loading}
              className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              {mode === "login"
                ? "New here? Create an account"
                : "Already have an account? Login"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
