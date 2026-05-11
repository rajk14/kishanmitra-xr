export const drawDiseaseOverlay = (canvas, imageUrl, diseaseArea, opacity) => {
  if (!canvas || !imageUrl || !diseaseArea) return;

  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.src = imageUrl;

  img.onload = () => {
    // Set canvas size to match image aspect ratio but scaled to container
    const parent = canvas.parentElement;
    const scale = parent.clientWidth / img.width;
    canvas.width = parent.clientWidth;
    canvas.height = img.height * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // We don't draw the image on the canvas because the image is behind it in the UI
    // Draw hotspot
    const x = diseaseArea.x * canvas.width;
    const y = diseaseArea.y * canvas.height;
    const w = diseaseArea.w * canvas.width;
    const h = diseaseArea.h * canvas.height;

    ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    
    // Glowing effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00ff88';
    
    // Rect
    ctx.strokeRect(x, y, w, h);
    
    // Label background
    ctx.shadowBlur = 0;
    ctx.fillStyle = `rgba(0, 255, 136, ${opacity * 0.8})`;
    ctx.fillRect(x, y - 30, 100, 25);
    
    // Label text
    ctx.fillStyle = '#020b06';
    ctx.font = 'bold 12px Inter';
    ctx.fillText('⚠️ रोग क्षेत्र', x + 10, y - 13);
    
    // Pulse animation logic is handled in the component calling this
  };
};
