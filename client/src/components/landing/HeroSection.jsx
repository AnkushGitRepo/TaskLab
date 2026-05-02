import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Calendar, Flag, MessageSquare } from 'lucide-react';

/**
 * @component HeroSection
 * @desc      Landing page hero with animated floating task cards
 */
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-surface">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary-100 to-transparent opacity-60" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-gradient-radial from-secondary-50 to-transparent opacity-60" />
      </div>

      <div className="relative max-w-container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left: Copy */}
        <div className="animate-fade-in-up">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-primary-50 text-primary-600 text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            Smart Productivity Suite
          </div>

          <h1 className="text-[52px] font-bold text-on-surface leading-tight tracking-tight mb-6">
            Organize{' '}
            <span className="text-gradient-primary">everything</span>
            {' '}in your life
          </h1>

          <p className="text-body-lg text-on-surface-variant mb-8 max-w-md">
            A simple, elegant way to manage tasks, collaborate with your team, and achieve your goals without the clutter.
          </p>

          <div className="flex items-center gap-4">
            <Link to="/register" className="btn-primary text-base px-8 py-4">
              Get Started Free
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-ghost text-base">
              Sign In
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 mt-10">
            <div className="flex -space-x-2">
              {['#6B4EFF', '#FF6B6B', '#FFD84D', '#4ECDC4'].map((color, i) => (
                <div key={i} className="w-8 h-8 rounded-full ring-2 ring-white" style={{ backgroundColor: color }} />
              ))}
            </div>
            <p className="text-sm text-on-surface-variant">
              <span className="font-semibold text-on-surface">12,000+</span> teams already organized
            </p>
          </div>
        </div>

        {/* Right: Floating task cards */}
        <div className="relative h-[480px] hidden lg:block">
          {/* Main card */}
          <div className="absolute top-8 right-0 w-72 card p-5 animate-float shadow-modal">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-primary-500" />
              <span className="text-xs font-semibold text-on-surface-variant">Design Sprint</span>
            </div>
            <h3 className="font-semibold text-on-surface mb-3">Redesign onboarding flow</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-priority-high">🔴 High</span>
              <span className="flex items-center gap-1 text-xs text-on-surface-variant"><Calendar size={12} />May 5</span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-1.5">
              <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '65%' }} />
            </div>
          </div>

          {/* Secondary card */}
          <div className="absolute top-32 left-0 w-64 card p-4 animate-float-delay shadow-card">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-green-500" />
              <div>
                <p className="text-sm font-semibold text-on-surface">Q4 Strategy Deck</p>
                <p className="text-xs text-on-surface-variant">Completed 2 days ago</p>
              </div>
            </div>
          </div>

          {/* Analytics card */}
          <div className="absolute bottom-16 right-8 w-56 card p-4 animate-float-slow shadow-card">
            <p className="text-xs font-semibold text-on-surface-variant mb-2">This Week</p>
            <div className="flex items-end gap-1 h-12">
              {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 bg-primary-100 rounded-sm" style={{ height: `${h}%` }}>
                  <div className="w-full bg-primary-500 rounded-sm" style={{ height: '60%' }} />
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-on-surface mt-2">24 tasks done</p>
          </div>

          {/* Notification card */}
          <div className="absolute bottom-40 left-8 w-52 card p-3 animate-float shadow-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary-300 flex items-center justify-center text-xs font-bold">A</div>
              <div>
                <p className="text-xs font-semibold text-on-surface">Alex commented</p>
                <p className="text-xs text-on-surface-variant">"Looks great! ✨"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
