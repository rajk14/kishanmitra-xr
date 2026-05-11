import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { translations } from '../i18n/translations';
import { Check, X, Zap, Crown, User } from 'lucide-react';
import { clsx } from 'clsx';

const PriceCard = ({ title, price, features, isPopular, icon: Icon, delay }) => {
  const { language } = useAppStore();
  const t = translations[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={clsx(
        "glass-card p-8 flex flex-col relative overflow-hidden",
        isPopular ? "border-primary border-2 shadow-[0_0_40px_rgba(0,255,136,0.1)]" : "border-border"
      )}
    >
      {isPopular && (
        <div className="absolute top-4 right-0 translate-x-1/4 rotate-45 bg-primary text-background text-[10px] font-bold px-10 py-1 uppercase tracking-widest">
          {t.most_popular}
        </div>
      )}

      <div className="mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
          <Icon size={24} />
        </div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-display font-bold">₹{price}</span>
          <span className="text-muted text-sm">/{t.monthly}</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 mb-8">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-3">
            {feature.included ? (
              <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                <Check size={12} />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-surface text-muted flex items-center justify-center">
                <X size={12} />
              </div>
            )}
            <span className={clsx("text-sm", feature.included ? "text-text" : "text-muted")}>
              {feature.label}
            </span>
          </div>
        ))}
      </div>

      <button className={clsx(
        "w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
        isPopular ? "btn-primary" : "btn-secondary"
      )}>
        {language === 'hi' ? 'शुरू करें' : 'Get Started'}
      </button>
    </motion.div>
  );
};

const Pricing = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      title: t.free,
      price: 0,
      icon: User,
      features: [
        { label: "3 Scans / day", included: true },
        { label: "Hindi Voice Support", included: true },
        { label: "Basic Chatbot", included: true },
        { label: "History (2 days)", included: true },
        { label: "Expert Support", included: false }
      ]
    },
    {
      title: t.pro,
      price: isYearly ? 79 : 99,
      isPopular: true,
      icon: Zap,
      features: [
        { label: "Unlimited Scans", included: true },
        { label: "Hindi & English Voice", included: true },
        { label: "Full XR Overlays", included: true },
        { label: "Lifetime History", included: true },
        { label: "Priority AI Support", included: true }
      ]
    },
    {
      title: t.elite,
      price: isYearly ? 239 : 299,
      icon: Crown,
      features: [
        { label: "Everything in Pro", included: true },
        { label: "Soil Testing AI", included: true },
        { label: "Weather Alerts", included: true },
        { label: "Personal Agri-Expert", included: true },
        { label: "1-on-1 Consultation", included: true }
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">{t.pricing}</h1>
        
        {/* Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={clsx("text-sm", !isYearly ? "text-text" : "text-muted")}>{t.monthly}</span>
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className="w-14 h-8 bg-surface border border-border rounded-full p-1 relative flex items-center transition-colors"
          >
            <motion.div
              animate={{ x: isYearly ? 24 : 0 }}
              className="w-6 h-6 bg-primary rounded-full shadow-lg"
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={clsx("text-sm", isYearly ? "text-text" : "text-muted")}>{t.yearly}</span>
            <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              {t.off_20}
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, i) => (
          <PriceCard key={i} {...plan} delay={i * 0.1} />
        ))}
      </div>
    </div>
  );
};

export default Pricing;
