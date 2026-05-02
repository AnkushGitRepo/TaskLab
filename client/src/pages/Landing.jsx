import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Twitter, Github, Linkedin } from 'lucide-react';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import FeaturesSection from '../components/landing/FeaturesSection';

const LOGOS = ['MANAE STUDIO', 'CREATIVENEST', 'Nova', 'FLOWSTATE', 'Syncro', 'Orbit'];

/**
 * @page Landing
 * @desc  Public landing page — pixel-perfect match to Stitch design
 */
const Landing = () => {
  return (
    <div className="min-h-screen bg-surface">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-outline-variant/50">
        <div className="max-w-container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-gradient-primary flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <rect x="3" y="5" width="18" height="2.5" rx="1.25" fill="white"/>
                <rect x="3" y="10.75" width="14" height="2.5" rx="1.25" fill="white" opacity="0.8"/>
                <rect x="3" y="16.5" width="11" height="2.5" rx="1.25" fill="white" opacity="0.6"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-on-surface">Tasklab</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {['Product', 'Service', 'Pricing', 'Support'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                {item}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary py-2 text-sm">
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-20">
        <HeroSection />
      </div>

      {/* Trusted by */}
      <section className="py-12 bg-white border-y border-outline-variant">
        <div className="max-w-container mx-auto px-6">
          <p className="text-center text-sm font-semibold text-on-surface-variant mb-8">
            Trusted by innovative teams worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {LOGOS.map((logo) => (
              <span key={logo} className="text-sm font-bold text-outline tracking-widest uppercase">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatsSection />

      {/* Features */}
      <FeaturesSection />

      {/* Testimonial */}
      <section className="py-20 bg-white">
        <div className="max-w-container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              {[1,2,3,4,5].map((i) => (
                <span key={i} className="text-secondary-400 text-2xl">★</span>
              ))}
            </div>
            <blockquote className="text-2xl font-semibold text-on-surface mb-6 leading-relaxed">
              "Tasklab completely changed how our team operates. It's so clean, we actually enjoy logging in to manage our work."
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700">
                S
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-on-surface">Sarah Chen</p>
                <p className="text-xs text-on-surface-variant">Product Lead at Creativenest</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to get organized?</h2>
          <p className="text-primary-100 text-lg mb-8">Join 12,000+ teams who use Tasklab daily.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-pill bg-white text-primary-600 font-bold text-base hover:bg-primary-50 transition-colors shadow-modal">
            Start for free — no credit card
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-on-surface py-12">
        <div className="max-w-container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-gradient-primary flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                  <rect x="3" y="5" width="18" height="2.5" rx="1.25" fill="white"/>
                  <rect x="3" y="10.75" width="14" height="2.5" rx="1.25" fill="white" opacity="0.8"/>
                </svg>
              </div>
              <span className="text-white font-bold">Tasklab</span>
            </div>
            <p className="text-outline text-sm">© 2026 Tasklab. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-outline hover:text-white transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
