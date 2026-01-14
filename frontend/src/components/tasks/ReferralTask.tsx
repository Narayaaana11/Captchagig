import { useState } from 'react';
import { Users, Copy, Check, Share2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function ReferralTask() {
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);
  const referralLink = `${window.location.origin}/auth?ref=${profile?.referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join CaptchGig',
          text: `Join me on CaptchGig and earn real money! Use my referral code: ${profile?.referralCode}`,
          url: referralLink,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Refer & Earn</h3>
            <p className="text-sm text-gray-600">Earn 50 coins per referral</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-xl p-4 border border-green-200">
          <p className="text-sm text-gray-600 mb-1">Total Referrals</p>
          <p className="text-2xl font-bold text-green-600">--</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-green-200">
          <p className="text-sm text-gray-600 mb-1">Pending Rewards</p>
          <p className="text-2xl font-bold text-orange-600">--</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border-2 border-green-200 mb-4">
        <p className="text-xs font-medium text-gray-700 mb-2">Your Referral Code</p>
        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
          <code className="text-lg font-bold text-gray-900">{profile?.referralCode}</code>
          <button
            onClick={handleCopy}
            className="text-green-600 hover:text-green-700 transition-colors"
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleCopy}
          className="w-full bg-white text-green-600 border-2 border-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {copied ? (
            <>
              <Check className="h-5 w-5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-5 w-5" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Share2 className="h-5 w-5" />
          <span>Share Now</span>
        </button>
      </div>

      <div className="mt-4 bg-green-100 rounded-lg p-3">
        <p className="text-xs text-green-800 font-medium">How it works:</p>
        <ol className="text-xs text-green-700 mt-2 space-y-1 list-decimal list-inside">
          <li>Share your referral link with friends</li>
          <li>They sign up using your link</li>
          <li>Earn 50 coins when they complete first task</li>
        </ol>
      </div>
    </div>
  );
}
