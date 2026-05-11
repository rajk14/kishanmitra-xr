import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { translations } from '../i18n/translations';
import { Scan, Sparkles, Volume2, Maximize, ArrowRight } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";
import PricingModal from '../components/PricingModal';

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -10, borderColor: 'rgba(0, 255, 136, 0.4)' }}
    className="glass-card p-8 flex flex-col items-center text-center group cursor-pointer transition-all border-border/50"
  >
    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="text-primary" size={32} />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-muted text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

const Home = () => {
  const { language, plan } = useAppStore();
  const t = translations[language];
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [showPricing, setShowPricing] = React.useState(false);

  const handleStartScan = () => {
    if (!isSignedIn) {
      alert(language === 'hi' ? "कृपया पहले लॉगिन करें।" : "Please login first.");
      return;
    }
    if (!plan) {
      setShowPricing(true);
      return;
    }
    navigate('/diagnose');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Animated Orbs */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ y: [20, -20, 20], x: [10, -10, 10], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-[10%] right-[5%] w-[35vw] h-[35vw] bg-secondary/10 rounded-full blur-[100px]"
        />
        <div className="absolute inset-0 grid-overlay opacity-[0.03]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center mb-6"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <motion.img 
                src="/logo.png" 
                alt="KisanMitra XR Logo" 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-32 h-32 md:w-48 md:h-48 rounded-full object-cover shadow-2xl shadow-primary/20 border-4 border-primary/10"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Sparkles size={14} />
            Next-Gen Crop Protection
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-6xl md:text-8xl font-display font-bold mb-8 leading-[0.9] tracking-tight"
          >
            {t.hero_title.split(' ').map((word, i) => (
              <span key={i} className={i % 2 === 1 ? "text-primary" : ""}>{word} </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted max-w-3xl mx-auto mb-12 font-medium"
          >
            {t.hero_subline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button 
              onClick={handleStartScan}
              className="btn-primary w-full sm:w-auto text-lg px-12 group h-14"
            >
              {t.start_scan}
              <ArrowRight className="group-hover:translate-x-2 transition-transform ml-2" />
            </button>
            <Link to="/learn" className="btn-secondary w-full sm:w-auto text-lg px-12 h-14 flex items-center justify-center">
              {t.learn}
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-primary mb-1">50+</span>
              <span className="text-muted text-sm font-medium uppercase tracking-widest">{t.stats_diseases}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-primary mb-1">10</span>
              <span className="text-muted text-sm font-medium uppercase tracking-widest">{t.stats_crops}</span>
            </div>
            <div className="flex flex-col items-center col-span-2 md:col-span-1">
              <span className="text-4xl font-bold text-primary mb-1">100%</span>
              <span className="text-muted text-sm font-medium uppercase tracking-widest">{t.stats_hindi}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Sparkles} 
              title={t.feature_ai} 
              desc={t.feature_ai_desc} 
              delay={0.1} 
            />
            <FeatureCard 
              icon={Volume2} 
              title={t.feature_voice} 
              desc={t.feature_voice_desc} 
              delay={0.2} 
            />
            <FeatureCard 
              icon={Maximize} 
              title={t.feature_xr} 
              desc={t.feature_xr_desc} 
              delay={0.3} 
            />
          </div>
        </div>
      </section>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-[0.05] z-0">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.1" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.1" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.05" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.05" />
        </svg>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
};

export default Home;
