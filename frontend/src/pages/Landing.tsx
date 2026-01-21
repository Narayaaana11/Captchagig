import {
  ArrowRight,
  Gift,
  Target,
  TrendingUp,
  Users,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-black p-2 rounded-lg">
                <img src="/coins.svg" alt="CaptchaGig" className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-black hidden sm:inline">
                CaptchaGig
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-black transition-colors"
              >
                Features
              </a>
              <a
                href="#earning-ways"
                className="text-gray-700 hover:text-black transition-colors"
              >
                How to Earn
              </a>
              <a
                href="#social-proof"
                className="text-gray-700 hover:text-black transition-colors"
              >
                About
              </a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex">
              <Link
                to="/auth"
                className="bg-black text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-black/50 transform hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-black"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-3">
              <a
                href="#features"
                className="block text-gray-700 hover:text-black transition-colors py-2"
              >
                Features
              </a>
              <a
                href="#earning-ways"
                className="block text-gray-700 hover:text-black transition-colors py-2"
              >
                How to Earn
              </a>
              <a
                href="#social-proof"
                className="block text-gray-700 hover:text-black transition-colors py-2"
              >
                About
              </a>
              <Link
                to="/auth"
                className="block bg-black text-white px-6 py-2.5 rounded-lg font-semibold text-center hover:shadow-lg transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight animate-fade-in">
              Where Your Income
              <span className="block text-gray-800">Grows</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto animate-slide-up">
              Earn passive income by solving captchas, completing micro-tasks,
              and building your network. Join thousands of users earning real
              money every day on the most secure and user-friendly platform.
            </p>

            <Link
              to="/auth"
              className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-black/50 transform hover:scale-105 transition-all duration-200 animate-scale-in gap-2"
            >
              Try Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 md:py-32 bg-gray-50 border-t border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              What is CaptchaGig?
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl">
              CaptchaGig is a premium earning platform designed to help you grow
              your income through simple, legitimate tasks. Stay in full control
              of your earnings with instant withdrawals and transparent rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="group relative p-8 rounded-2xl bg-white border border-gray-300 hover:border-black transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 animate-slide-up">
              <div className="relative">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-3">
                  Growing Returns
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Earn passive income as your wallet balance grows with every
                  completed task. Your earnings never stop accumulating.
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group relative p-8 rounded-2xl bg-white border border-gray-300 hover:border-black transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 animate-slide-up animate-delay-100">
              <div className="relative">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-3">
                  Instant Access
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Withdraw your earnings anytime you want. Instant access to
                  your funds when you need them most.
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="group relative p-8 rounded-2xl bg-white border border-gray-300 hover:border-black transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 animate-slide-up animate-delay-200">
              <div className="relative">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-3">
                  100% Hands-Free
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  No complex strategies to manage. Our platform handles
                  everything automatically for you.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 text-black font-bold text-lg hover:text-gray-700 transition-all group"
            >
              Explore Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section
        id="social-proof"
        className="py-20 md:py-24 bg-white border-t border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Backed by Industry Leaders
            </h2>
            <p className="text-gray-700">
              Trusted by users and supported by the best companies
            </p>
          </div>

          {/* Partner Logos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-center">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center h-16 px-6 rounded-lg bg-gray-100 border border-gray-300 hover:border-black transition-all duration-300 opacity-60 hover:opacity-100"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-gray-700 font-semibold text-sm text-center">
                    Partner {i + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to Earn Section */}
      <section id="earning-ways" className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Ways to Earn
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Multiple ways to grow your income. Choose tasks that fit your
              schedule and maximize your earnings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Daily Login */}
            <div className="group relative p-6 rounded-2xl bg-white border border-gray-300 hover:border-black transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 animate-scale-in">
              <div className="relative">
                <div className="bg-gray-200 w-14 h-14 rounded-xl flex items-center justify-center mb-4 border border-gray-400">
                  <Target className="h-7 w-7 text-black" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">
                  Daily Login
                </h3>
                <p className="text-gray-700 mb-4 text-sm">
                  Earn coins just by logging in daily. Build streaks for bonus
                  rewards.
                </p>
                <div className="text-black font-bold text-sm">
                  Up to 50 coins/day
                </div>
              </div>
            </div>

            {/* Solve Captcha */}
            <div className="group relative p-6 rounded-2xl bg-white border border-gray-300 hover:border-black transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 animate-scale-in animate-delay-100">
              <div className="relative">
                <div className="bg-gray-200 w-14 h-14 rounded-xl flex items-center justify-center mb-4 border border-gray-400">
                  <Zap className="h-7 w-7 text-black" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">
                  Solve Captcha
                </h3>
                <p className="text-gray-700 mb-4 text-sm">
                  Complete simple math captchas and earn instantly. Up to 50 per
                  day.
                </p>
                <div className="text-black font-bold text-sm">
                  2 coins/captcha
                </div>
              </div>
            </div>

            {/* Spin & Win */}
            <div className="group relative p-6 rounded-2xl bg-white border border-gray-300 hover:border-black transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 animate-scale-in animate-delay-200">
              <div className="relative">
                <div className="bg-gray-200 w-14 h-14 rounded-xl flex items-center justify-center mb-4 border border-gray-400">
                  <Gift className="h-7 w-7 text-black" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">
                  Spin & Win
                </h3>
                <p className="text-gray-700 mb-4 text-sm">
                  Spin the wheel 3 times daily for a chance to win bonus coins.
                </p>
                <div className="text-black font-bold text-sm">
                  Up to 100 coins/spin
                </div>
              </div>
            </div>

            {/* Refer & Earn */}
            <div className="group relative p-6 rounded-2xl bg-white border border-gray-300 hover:border-black transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 animate-scale-in animate-delay-300">
              <div className="relative">
                <div className="bg-gray-200 w-14 h-14 rounded-xl flex items-center justify-center mb-4 border border-gray-400">
                  <Users className="h-7 w-7 text-black" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">
                  Refer & Earn
                </h3>
                <p className="text-gray-700 mb-4 text-sm">
                  Invite friends and earn when they complete their first task.
                </p>
                <div className="text-black font-bold text-sm">
                  50 coins/referral
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-black relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            Ready to Start Earning?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users earning real money every day. It only takes
            seconds to get started.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center space-x-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-white/30 transform hover:scale-105 transition-all duration-300"
          >
            <span>Create Free Account</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white p-2 rounded-lg">
                  <img src="/coins.svg" alt="CaptchaGig" className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold text-white">CaptchaGig</span>
              </div>
              <p className="text-sm text-gray-500">
                Earn real money completing simple tasks and micro-jobs.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="hover:text-gray-300 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#earning-ways"
                    className="hover:text-gray-300 transition-colors"
                  >
                    How to Earn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Developers */}
            <div>
              <h4 className="font-semibold text-white mb-4">Developers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    API Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    Integration
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p>© 2024 CaptchaGig. All rights reserved.</p>
              <span className="hidden md:inline">|</span>
              <p className="text-gray-600">
                Developed by{" "}
                <span className="font-semibold text-gray-400">IndentDev</span>
              </p>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-gray-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
