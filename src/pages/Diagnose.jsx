import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { translations } from '../i18n/translations';
import { Camera, Upload, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';
import { diagnoseCrop } from '../services/aiService';
import ScanAnimation from '../components/ScanAnimation';
import DiseaseOverlay from '../components/DiseaseOverlay';
import ResultCard from '../components/ResultCard';
import LoadingScanner from '../components/LoadingScanner';
import WeatherCard from '../components/WeatherCard';
import { useUser, useSignIn } from "@clerk/clerk-react";

import { supabase } from '../lib/supabase';

const Diagnose = () => {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { 
    language, addHistory, setScanning, isScanning, 
    aiSource, cloudModel, localModel, plan,
    customGeminiKey, customOpenRouterKey
  } = useAppStore();
  const t = translations[language];
  
  const [image, setImage] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (!isSignedIn) {
      alert(language === 'hi' ? "कृपया पहले लॉगिन करें。" : "Please login first.");
      return;
    }
    fileInputRef.current.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const compressed = await compressImage(file);
      setImage(compressed);
      setDiagnosis(null);
      setError(null);
    } catch (err) {
      setError("Image processing failed.");
    }
  };

  const startDiagnosis = async () => {
    if (!image) return;
    
    setScanning(true);
    setDiagnosis(null);
    setError(null);

    try {
      const result = await diagnoseCrop(image, aiSource, { 
        cloudModel, 
        localModel,
        customGeminiKey,
        customOpenRouterKey
      });
      
      if (!result.is_crop) {
        setError(language === 'hi' ? "यह फसल की तस्वीर नहीं लग रही है।" : "This doesn't look like a crop image.");
        setScanning(false);
        return;
      }

      setDiagnosis(result);
      useAppStore.getState().setCurrentDiagnosis(result);

      // Save to Supabase
      if (isSignedIn && clerkUser) {
        try {
          const { error: dbError } = await supabase
            .from('scans')
            .insert([{
              user_id: clerkUser.id,
              crop_name: result.crop_name,
              disease_name: result.disease_name,
              confidence: result.confidence,
              severity: result.severity,
              image_url: image, 
              diagnosis_data: result
            }]);
          
          if (dbError) throw dbError;
          console.log('Scan saved to history');
        } catch (dbErr) {
          console.error('Supabase Save Error:', dbErr);
          // Show a subtle warning if DB save fails
          setError(language === 'hi' ? `इतिहास सुरक्षित नहीं हो सका: ${dbErr.message}` : `Could not save to history: ${dbErr.message}`);
        }
      }

      addHistory({
        ...result,
        id: Date.now(),
        image,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error(err);
      setError(err.message || (language === 'hi' ? "AI विश्लेषण विफल रहा। कृपया फिर से प्रयास करें।" : "AI analysis failed. Please try again."));
    } finally {
      setScanning(false);
    }
  };

  const reset = () => {
    setImage(null);
    setDiagnosis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto">
      <AnimatePresence>
        {isScanning && <LoadingScanner />}
      </AnimatePresence>

      <div className="mb-12 text-center flex flex-col items-center gap-6">
        <WeatherCard />
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-display font-bold text-text"
        >
          {t.scan_title}
        </motion.h1>
        <p className="text-muted text-lg">{language === 'hi' ? 'अपनी फसल की एक साफ फोटो अपलोड करें' : 'Upload a clear photo of your crop'}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Upload Zone */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className={`relative glass-card aspect-square flex flex-col items-center justify-center border-2 border-dashed transition-all overflow-hidden ${
              image ? 'border-primary' : 'border-border hover:border-primary/50'
            }`}
          >
            {image ? (
              <>
                <img src={image} alt="Upload" className="w-full h-full object-cover" />
                <ScanAnimation isScanning={isScanning} />
                {diagnosis && <DiseaseOverlay imageUrl={image} diseaseArea={diagnosis.disease_area} />}
              </>
            ) : (
              <div className="flex flex-col items-center p-12 text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6"
                >
                  <Camera size={40} />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{t.upload_text}</h3>
                <p className="text-muted text-sm max-w-xs">{language === 'hi' ? 'सीधे पत्तों या प्रभावित हिस्से की फोटो लें' : 'Take photo of leaves or affected parts directly'}</p>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </motion.div>

          <div className="flex gap-4">
            {!image ? (
              <>
                <button 
                  onClick={handleUploadClick}
                  className="btn-primary flex-1"
                >
                  <Upload size={20} />
                  {t.upload_browse}
                </button>
                <button 
                  onClick={handleUploadClick}
                  className="btn-secondary flex-1"
                >
                  <Camera size={20} />
                  {t.upload_camera}
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={reset}
                  className="btn-secondary flex-1"
                  disabled={isScanning}
                >
                  <RefreshCw size={20} />
                  {language === 'hi' ? 'बदलें' : 'Change'}
                </button>
                {!diagnosis && (
                  <button 
                    onClick={startDiagnosis}
                    className="btn-primary flex-[2]"
                    disabled={isScanning}
                  >
                    <CheckCircle2 size={20} />
                    {language === 'hi' ? 'विश्लेषण शुरू करें' : 'Start Analysis'}
                  </button>
                )}
              </>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-danger/10 border-2 border-danger/20 rounded-3xl text-danger space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-danger/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h4 className="font-black uppercase text-xs tracking-widest mb-1">Analysis Error</h4>
                  <p className="text-sm font-medium leading-relaxed">{error}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-danger/10 flex gap-3">
                <button 
                  onClick={startDiagnosis}
                  className="flex-1 bg-danger text-background py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  Retry Analysis
                </button>
                <button 
                  onClick={() => setError(null)}
                  className="px-4 py-2 bg-danger/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-danger/20 transition-all"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Result Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {diagnosis ? (
              <ResultCard diagnosis={diagnosis} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border border-border/50 rounded-2xl bg-surface/30"
              >
                <div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center text-muted mb-4">
                  <RefreshCw size={32} className="animate-spin-slow opacity-20" />
                </div>
                <p className="text-muted">{language === 'hi' ? 'परिणाम यहां दिखाई देंगे' : 'Results will appear here'}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Diagnose;
