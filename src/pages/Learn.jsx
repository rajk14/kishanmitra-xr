import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { translations } from '../i18n/translations';
import { BookOpen, ChevronRight, X, Info, Shield, Droplets, AlertTriangle } from 'lucide-react';

const DISEASES = [
  {
    id: 'early-blight',
    name_hi: 'अगेती झुलसा (Early Blight)',
    name_en: 'Early Blight',
    crop: 'टमाटर, आलू',
    symptoms: 'पत्तों पर भूरे घेरे वाले धब्बे, निचली पत्तियों से शुरुआत।',
    cause: 'अल्टरनेरिया सोलानी कवक (Fungus)।',
    treatment: 'Mancozeb या Copper Oxychloride का छिड़काव करें।',
    prevention: 'फसल चक्र अपनाएं और जल निकासी सुधारें।',
    color: 'amber'
  },
  {
    id: 'wheat-rust',
    name_hi: 'गेहूं का रतुआ (Wheat Rust)',
    name_en: 'Wheat Rust',
    crop: 'गेहूं',
    symptoms: 'पत्तियों पर पीले या नारंगी रंग के पाउडर जैसे धब्बे।',
    cause: 'पक्सिनिया कवक।',
    treatment: 'Propiconazole का 0.1% घोल छिड़कें।',
    prevention: 'प्रतिरोधी किस्मों के बीज लगाएं।',
    color: 'orange'
  },
  {
    id: 'corn-smut',
    name_hi: 'मक्के का कंडुआ (Corn Smut)',
    name_en: 'Corn Smut',
    crop: 'मक्का',
    symptoms: 'भुट्टे या तने पर सफेद-धूसर रंग की बड़ी गांठें।',
    cause: 'उस्टिलागो मेयडिस कवक।',
    treatment: 'प्रभावित हिस्सों को जला दें।',
    prevention: 'बीज उपचार (Seed Treatment) करें।',
    color: 'gray'
  },
  {
    id: 'late-blight',
    name_hi: 'पछेती झुलसा (Late Blight)',
    name_en: 'Late Blight',
    crop: 'आलू, टमाटर',
    symptoms: 'पत्तियों के किनारों पर काले पानी जैसे धब्बे।',
    cause: 'फाइटोफ्थोरा इन्फेस्टन्स।',
    treatment: 'Ridomil Gold का उपयोग करें।',
    prevention: 'खेत में स्वच्छता बनाए रखें।',
    color: 'red'
  }
];

const Learn = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const [selectedDisease, setSelectedDisease] = useState(null);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{t.learn}</h1>
        <p className="text-muted text-lg">{language === 'hi' ? 'फसल की बीमारियों और उनके उपचार के बारे में जानें' : 'Learn about crop diseases and their treatments'}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {DISEASES.map((disease) => (
          <motion.div
            key={disease.id}
            layoutId={disease.id}
            onClick={() => setSelectedDisease(disease)}
            whileHover={{ y: -10 }}
            className="glass-card p-8 cursor-pointer relative overflow-hidden group"
          >
            {/* Animated Disease Spread Visualization */}
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 1],
                  rotate: [0, 90, 180, 270, 360] 
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 border-4 border-dashed border-primary rounded-full flex items-center justify-center"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      x: [0, Math.cos(i * 60 * Math.PI/180) * 40, 0],
                      y: [0, Math.sin(i * 60 * Math.PI/180) * 40, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    className="absolute w-2 h-2 bg-primary rounded-full"
                  />
                ))}
              </motion.div>
            </div>

            <h3 className="text-2xl font-bold mb-2">{language === 'hi' ? disease.name_hi : disease.name_en}</h3>
            <p className="text-primary font-medium mb-4">{disease.crop}</p>
            <p className="text-muted text-sm line-clamp-2 mb-6">{disease.symptoms}</p>
            <div className="flex items-center text-primary font-bold text-sm">
              {language === 'hi' ? 'विवरण देखें' : 'View Details'}
              <ChevronRight size={18} className="ml-1" />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedDisease && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDisease(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 p-6 flex items-center justify-center"
            >
              <motion.div
                layoutId={selectedDisease.id}
                onClick={(e) => e.stopPropagation()}
                className="glass-card w-full max-w-2xl max-h-[80vh] overflow-y-auto p-10 relative"
              >
                <button 
                  onClick={() => setSelectedDisease(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-surface rounded-full transition-colors"
                >
                  <X size={24} />
                </button>

                <h2 className="text-3xl font-display font-bold mb-2">
                  {language === 'hi' ? selectedDisease.name_hi : selectedDisease.name_en}
                </h2>
                <p className="text-primary text-xl mb-8">{selectedDisease.crop}</p>

                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-muted uppercase tracking-widest mb-3">
                        <AlertTriangle size={16} className="text-warning" />
                        {language === 'hi' ? 'लक्षण' : 'Symptoms'}
                      </h4>
                      <p className="text-text leading-relaxed">{selectedDisease.symptoms}</p>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-muted uppercase tracking-widest mb-3">
                        <Info size={16} className="text-primary" />
                        {language === 'hi' ? 'कारण' : 'Cause'}
                      </h4>
                      <p className="text-text leading-relaxed">{selectedDisease.cause}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-muted uppercase tracking-widest mb-3">
                        <Droplets size={16} className="text-secondary" />
                        {language === 'hi' ? 'उपचार' : 'Treatment'}
                      </h4>
                      <p className="text-text leading-relaxed">{selectedDisease.treatment}</p>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-muted uppercase tracking-widest mb-3">
                        <Shield size={16} className="text-success" />
                        {language === 'hi' ? 'बचाव' : 'Prevention'}
                      </h4>
                      <p className="text-text leading-relaxed">{selectedDisease.prevention}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Learn;
