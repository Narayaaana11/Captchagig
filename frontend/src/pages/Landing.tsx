import { ArrowRight, Coins, Gift, Target, TrendingUp, Users, Zap, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 border-b border-purple-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-captch p-2 rounded-lg">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:inline">
                CaptchGig
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#earning-ways"
                className="text-gray-300 hover:text-white transition-colors"
              >
                How to Earn
              </a>
              <a
                href="#social-proof"
                className="text-gray-300 hover:text-white transition-colors"
              >
                About
              </a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex">
              <Link
                to="/auth"
                className="bg-gradient-captch text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
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
                className="block text-gray-300 hover:text-white transition-colors py-2"
              >
                Features
              </a>
              <a
                href="#earning-ways"
                className="block text-gray-300 hover:text-white transition-colors py-2"
              >
                How to Earn
              </a>
              <a
                href="#social-proof"
                className="block text-gray-300 hover:text-white transition-colors py-2"
              >
                About
              </a>
              <Link
                to="/auth"
                className="block bg-gradient-captch text-white px-6 py-2.5 rounded-lg font-semibold text-center hover:shadow-lg transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl opacity-50 animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-40 animate-float animate-delay-200"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
              Where Your Income
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Grows
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-up max-w-2xl">
              Earn passive income by solving captchas, completing micro-tasks,
              and building your network. Join thousands of users earning real
              money every day on the most secure and user-friendly platform.
            </p>

            <Link
              to="/auth"
              className="inline-flex items-center justify-center bg-gradient-captch text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-200 mb-16 animate-scale-in gap-2"
            >
              Try Now
              <ArrowRight className="h-5 w-5" />
            </Link>

            {/* Premium Hero Image Card with Glass Effect */}
            <div className="relative mx-auto max-w-2xl">
              {/* Glass effect wrapper */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-3xl opacity-30 blur-2xl"></div>

              <div className="relative rounded-3xl overflow-hidden backdrop-blur-2xl border border-purple-400/30 bg-white/5 p-8 animate-slide-up shadow-2xl">
                {/* Floating geometric elements */}
                {/* Floating geometric elements */}
                <div className="grid grid-cols-3 gap-6 h-80">
                  {/* Card 1 – Earning / Money Aesthetic */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/40 to-purple-600/40 rounded-2xl backdrop-blur-sm border border-purple-400/20 opacity-70 animate-float">
                    <img
                      src="https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=cover&w=800&q=80"
                      alt="Earning Money Aesthetic"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Card 2 – Financial Growth / Analytics */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-2xl backdrop-blur-sm border border-blue-400/20 opacity-80 animate-float animate-delay-200">
                    <img
                      src="https://images.unsplash.com/photo-1531384695056-3f4893f42cda?auto=format&fit=cover&w=800&q=80"
                      alt="Financial Growth"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Card 3 – Wallet / Payments */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-pink-500/40 to-pink-600/40 rounded-2xl backdrop-blur-sm border border-pink-400/20 opacity-70 animate-float animate-delay-400">
                    <img
                      src="https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=cover&w=800&q=80"
                      alt="Wallet / Finance"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* <div className="grid grid-cols-3 gap-6 h-80">
                  <div className="bg-gradient-to-br from-purple-500/40 to-purple-600/40 rounded-2xl backdrop-blur-sm border border-purple-400/20 opacity-70 animate-float"></div>
                  <div className="bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-2xl backdrop-blur-sm border border-blue-400/20 opacity-80 animate-float animate-delay-200"></div>
                  <div className="bg-gradient-to-br from-pink-500/40 to-pink-600/40 rounded-2xl backdrop-blur-sm border border-pink-400/20 opacity-70 animate-float animate-delay-400"></div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 md:py-32 bg-slate-900/50 border-t border-purple-800/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What is CaptchGig?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl">
              CaptchGig is a premium earning platform designed to help you grow
              your income through simple, legitimate tasks. Stay in full control
              of your earnings with instant withdrawals and transparent rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-purple-900/50 to-blue-900/30 border border-purple-700/30 hover:border-purple-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-2 animate-slide-up">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Growing Returns
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Earn passive income as your wallet balance grows with every
                  completed task. Your earnings never stop accumulating.
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-blue-900/50 to-cyan-900/30 border border-blue-700/30 hover:border-blue-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-2 animate-slide-up animate-delay-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/10 group-hover:to-cyan-600/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Instant Access
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Withdraw your earnings anytime you want. Instant access to
                  your funds when you need them most.
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-pink-900/50 to-purple-900/30 border border-pink-700/30 hover:border-pink-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20 transform hover:-translate-y-2 animate-slide-up animate-delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/0 to-purple-600/0 group-hover:from-pink-600/10 group-hover:to-purple-600/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  100% Hands-Free
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  No complex strategies to manage. Our platform handles
                  everything automatically for you.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 text-purple-400 font-bold text-lg hover:text-purple-300 transition-all group"
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
        className="py-20 md:py-24 bg-slate-950/50 border-t border-purple-800/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Backed by Industry Leaders
            </h2>
            <p className="text-gray-400">
              Trusted by users and supported by the best companies
            </p>
          </div>

          {/* Partner Logos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-center">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center h-16 px-6 rounded-lg bg-slate-800/40 border border-purple-700/20 hover:border-purple-500/40 transition-all duration-300 opacity-60 hover:opacity-100"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-gray-400 font-semibold text-sm text-center">
                    Partner {i + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to Earn Section */}
      <section id="earning-ways" className="py-20 md:py-32 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ways to Earn
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Multiple ways to grow your income. Choose tasks that fit your
              schedule and maximize your earnings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Daily Login */}
            <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2 animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:to-blue-600/5 rounded-2xl transition-all duration-300"></div>
              <div className="relative">
                <div className="bg-blue-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 border border-blue-400/30">
                  <Target className="h-7 w-7 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Daily Login
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Earn coins just by logging in daily. Build streaks for bonus
                  rewards.
                </p>
                <div className="text-blue-400 font-bold text-sm">
                  Up to 50 coins/day
                </div>
              </div>
            </div>

            {/* Solve Captcha */}
            <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 transform hover:-translate-y-2 animate-scale-in animate-delay-100">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 to-green-600/0 group-hover:from-green-600/5 group-hover:to-green-600/5 rounded-2xl transition-all duration-300"></div>
              <div className="relative">
                <div className="bg-green-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 border border-green-400/30">
                  <Zap className="h-7 w-7 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Solve Captcha
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Complete simple math captchas and earn instantly. Up to 50 per
                  day.
                </p>
                <div className="text-green-400 font-bold text-sm">
                  2 coins/captcha
                </div>
              </div>
            </div>

            {/* Spin & Win */}
            <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 transform hover:-translate-y-2 animate-scale-in animate-delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:to-purple-600/5 rounded-2xl transition-all duration-300"></div>
              <div className="relative">
                <div className="bg-purple-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 border border-purple-400/30">
                  <Gift className="h-7 w-7 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Spin & Win
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Spin the wheel 3 times daily for a chance to win bonus coins.
                </p>
                <div className="text-purple-400 font-bold text-sm">
                  Up to 100 coins/spin
                </div>
              </div>
            </div>

            {/* Refer & Earn */}
            <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 transform hover:-translate-y-2 animate-scale-in animate-delay-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/0 to-orange-600/0 group-hover:from-orange-600/5 group-hover:to-orange-600/5 rounded-2xl transition-all duration-300"></div>
              <div className="relative">
                <div className="bg-orange-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 border border-orange-400/30">
                  <Users className="h-7 w-7 text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Refer & Earn
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Invite friends and earn when they complete their first task.
                </p>
                <div className="text-orange-400 font-bold text-sm">
                  50 coins/referral
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-purple-900/40 relative overflow-hidden border-t border-purple-800/30">
        <div className="absolute inset-0 bg-black opacity-20"></div>
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
            className="inline-flex items-center justify-center space-x-2 bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-white/30 transform hover:scale-105 transition-all duration-300"
          >
            <span>Create Free Account</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-gray-400 py-12 border-t border-purple-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-captch p-2 rounded-lg">
                  <Coins className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CaptchGig</span>
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
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2024 CaptchGig. All rights reserved.</p>
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
