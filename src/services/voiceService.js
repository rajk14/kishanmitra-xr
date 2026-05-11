export const speakHindi = (text) => {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'hi-IN';
  utterance.rate = 0.85;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Find a Hindi voice if available (sometimes browser defaults are better)
  const voices = window.speechSynthesis.getVoices();
  const hindiVoice = voices.find(voice => voice.lang.includes('hi'));
  if (hindiVoice) {
    utterance.voice = hindiVoice;
  }

  window.speechSynthesis.speak(utterance);
};

export const stopVoice = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
