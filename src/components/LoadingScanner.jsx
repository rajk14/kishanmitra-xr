import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { translations } from '../i18n/translations';

const LoadingScanner = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.floor(Math.random() * 15);
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
      <div className="relative w-64 h-64 mb-12">
        {/* Animated Scanner Grid */}
        <div className="absolute inset-0 grid-overlay opacity-50 border border-primary/20 rounded-2xl" />
        <div className="scan-line" />
        
        {/* Pulsing Orb */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 m-auto w-32 h-32 bg-primary/20 rounded-full blur-3xl"
        />
        
        {/* Progress Circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-surface"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="754"
            animate={{ strokeDashoffset: 754 - (754 * progress) / 100 }}
            className="text-primary"
            style={{ filter: 'drop-shadow(0 0 8px #00ff88)' }}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-display font-bold text-primary">{progress}%</span>
        </div>
      </div>

      <motion.h2 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-2xl font-display font-bold mb-4"
      >
        {t.analyzing_ai}
      </motion.h2>
      <p className="text-muted max-w-xs">{language === 'hi' ? 'हमारा AI रोग के संकेतों के लिए आपकी फसल की जांच कर रहा है...' : 'Our AI is scanning your crop for disease signs...'}</p>
    </div>
  );
};

export default LoadingScanner;
