import React from 'react';
import { useAppStore } from '../store/appStore';
import { clsx } from 'clsx';

const LanguageToggle = () => {
  const { language, setLanguage } = useAppStore();

  return (
    <div className="flex bg-surface/50 p-1 rounded-full border border-border">
      <button
        onClick={() => setLanguage('hi')}
        className={clsx(
          "px-4 py-1 rounded-full text-sm font-bold transition-all duration-300",
          language === 'hi' ? "bg-primary text-background shadow-[0_0_15px_rgba(0,255,136,0.3)]" : "text-muted hover:text-text"
        )}
      >
        हिं
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={clsx(
          "px-4 py-1 rounded-full text-sm font-bold transition-all duration-300",
          language === 'en' ? "bg-primary text-background shadow-[0_0_15px_rgba(0,255,136,0.3)]" : "text-muted hover:text-text"
        )}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
