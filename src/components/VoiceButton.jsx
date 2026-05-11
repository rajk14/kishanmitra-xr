import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic } from 'lucide-react';
import { speakHindi, stopVoice } from '../services/voiceService';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceButton = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleVoice = () => {
    if (isSpeaking) {
      stopVoice();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakHindi(text);
      
      // We can't perfectly know when it ends without events, but we can set a timer 
      // or use the onend event if we had a more robust service.
      // Basic implementation using SpeechSynthesisUtterance events is better.
    }
  };

  useEffect(() => {
    return () => stopVoice();
  }, []);

  return (
    <button
      onClick={toggleVoice}
      className={`p-3 rounded-full transition-all duration-300 flex items-center gap-2 ${
        isSpeaking ? 'bg-primary text-background' : 'bg-surface border border-border text-primary hover:bg-primary/10'
      }`}
    >
      <AnimatePresence mode="wait">
        {isSpeaking ? (
          <motion.div
            key="speaking"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1"
          >
            <VolumeX size={20} />
            <div className="flex gap-1 h-3 items-end">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 12, 4] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1 bg-background rounded-full"
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="silent"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Volume2 size={20} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default VoiceButton;
