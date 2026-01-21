import { Menu, X, LogOut, History, Wallet, Shield } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { formatCoins } from "../lib/utils";

export function Navbar() {
  const { profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-black p-2 rounded-lg">
              <img src="/coins.svg" alt="CaptchaGig" className="h-6 w-6" />
            </div>
            <span className="text-lg font-bold text-black">CaptchaGig</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {(profile as any)?.isAdmin && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-black transition-colors font-medium flex items-center gap-1 text-sm"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-black transition-colors font-medium text-sm"
            >
              Tasks
            </Link>
            <Link
              to="/wallet"
              className="text-gray-700 hover:text-black transition-colors font-medium text-sm"
            >
              Wallet
            </Link>
            <Link
              to="/history"
              className="text-gray-700 hover:text-black transition-colors font-medium text-sm"
            >
              History
            </Link>

            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2.5 rounded-lg border border-gray-300">
              <img src="/coins.svg" alt="Coins" className="h-5 w-5" />
              <span className="font-semibold text-gray-900">
                {profile ? formatCoins(profile.walletBalance) : "0.00"}
              </span>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors text-sm font-medium"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            <div className="flex items-center justify-center space-x-2 bg-gray-100 px-4 py-3 rounded-lg border border-gray-300">
              <img src="/coins.svg" alt="Coins" className="h-5 w-5" />
              <span className="font-bold text-black">
                {profile ? formatCoins(profile.walletBalance) : "0.00"} Coins
              </span>
            </div>

            {(profile as any)?.isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 text-gray-700 hover:text-black py-2 px-3 rounded-lg hover:bg-gray-50"
              >
                <Shield className="h-5 w-5" />
                <span className="font-medium">Admin Panel</span>
              </Link>
            )}

            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-gray-700 hover:text-black py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              <img src="/coins.svg" alt="Tasks" className="h-5 w-5" />
              <span className="font-medium">Tasks</span>
            </Link>

            <Link
              to="/wallet"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-gray-700 hover:text-black py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              <Wallet className="h-5 w-5" />
              <span className="font-medium">Wallet</span>
            </Link>

            <Link
              to="/history"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 text-gray-700 hover:text-black py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              <History className="h-5 w-5" />
              <span className="font-medium">History</span>
            </Link>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleSignOut();
              }}
              className="flex items-center space-x-2 text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 w-full"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
