import React, { useRef, useEffect, useState } from 'react';
import { drawDiseaseOverlay } from '../utils/canvasOverlay';

const DiseaseOverlay = ({ imageUrl, diseaseArea }) => {
  const canvasRef = useRef(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!diseaseArea || !imageUrl) return;

    let animationId;
    let start;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      
      // Pulse opacity between 0.5 and 1.0
      const currentOpacity = 0.75 + Math.sin(progress / 500) * 0.25;
      setOpacity(currentOpacity);
      
      drawDiseaseOverlay(canvasRef.current, imageUrl, diseaseArea, currentOpacity);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [imageUrl, diseaseArea]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-30 pointer-events-none w-full h-full rounded-2xl"
    />
  );
};

export default DiseaseOverlay;
