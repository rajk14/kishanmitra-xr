import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScanAnimation = ({ isScanning }) => {
  return (
    <AnimatePresence>
      {isScanning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl"
        >
          {/* Scan Line */}
          <div className="scan-line" />
          
          {/* Corner Brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-sm" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-sm" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-sm" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-sm" />
          
          {/* Grid Overlay */}
          <div className="absolute inset-0 grid-overlay opacity-30" />
          
          {/* Scanning Beam / Glow */}
          <motion.div 
            animate={{ 
              top: ['0%', '100%', '0%'],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-20 bg-gradient-to-b from-primary/20 to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScanAnimation;
